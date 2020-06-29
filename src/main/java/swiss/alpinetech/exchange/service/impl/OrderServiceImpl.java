package swiss.alpinetech.exchange.service.impl;

import org.apache.commons.collections4.IteratorUtils;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.domain.User;
import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;
import swiss.alpinetech.exchange.repository.SecurityTokenRepository;
import swiss.alpinetech.exchange.repository.UserRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.OrderService;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.repository.OrderRepository;
import swiss.alpinetech.exchange.repository.search.OrderSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swiss.alpinetech.exchange.service.SecurityTokenService;
import swiss.alpinetech.exchange.util.ExcelGenerator;

import java.io.*;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Order}.
 */
@Service
@Transactional
public class OrderServiceImpl implements OrderService {private final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;

    private final OrderSearchRepository orderSearchRepository;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    private Authentication authentication;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityTokenRepository securityTokenRepository;

    @Autowired
    private SecurityTokenService securityTokenService;

    @Autowired
    JmsTemplate jmsTemplate;

    public OrderServiceImpl(OrderRepository orderRepository, OrderSearchRepository orderSearchRepository) {
        this.orderRepository = orderRepository;
        this.orderSearchRepository = orderSearchRepository;
    }

    /**
     * Save a order.
     *
     * @param order the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Order save(Order order) {
        log.debug("Request to save Order : {}", order);
        authentication = SecurityContextHolder.getContext().getAuthentication();
        order.setUpdateBy(authentication.getName());
        Order result = orderRepository.save(order);
        String changedStatus[] = new String[] {
            STATUS.SUCCESS.name(), STATUS.FAIL.name(), STATUS.REMOVE.name()
        };
        if (Arrays.stream(changedStatus).anyMatch(order.getStatus().name()::equals)) {
            order.setCloseDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        }
        orderSearchRepository.save(result);
        return result;
    }

    /**
     * Create order.
     *
     * @param order the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Order create(Order order) {
        log.debug("Request to create Order : {}", order);
        authentication = SecurityContextHolder.getContext().getAuthentication();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String formattedString = ZonedDateTime.now().format(formatter);
        User user = this.userRepository.findOneByLogin(authentication.getName()).get();
        SecurityToken securityToken = this.securityTokenRepository.findById(order.getSecurityToken().getId()).get();
        if(order.getType().name().equals(ACTIONTYPE.BUY.name())) {
            securityToken.setLastBuyingPrice(order.getPrice());
        }
        if(order.getType().name().equals(ACTIONTYPE.SELL.name())) {
            securityToken.setLastSellingprice(order.getPrice());
        }
        SecurityToken newSecurityToken = this.securityTokenService.save(securityToken);
        order.setUser(user);
        order.setSecurityToken(newSecurityToken);
        order.setCategoryToken(order.getSecurityToken().getCategory());
        order.setActive(true);
        order.setIdOrder(""+order.getSecurityToken().getSymbol()+""+formattedString);
        order.setCreateDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        order.setUpdateDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        order.setStatus(STATUS.INIT);
        order.setRefOrder(Long.parseLong(formattedString));
        order.setUpdateBy(authentication.getName());
        Order result = orderRepository.save(order);
        orderSearchRepository.save(result);
        this.messagingTemplate.convertAndSend("/topic/tracker", result);
        this.jmsTemplate.convertAndSend("inbound.order.topic", result);
        return result;
    }

    /**
     * Cancel order.
     *
     * @param orderId the entity to cancel.
     * @return the cancelled entity.
     */
    @Override
    public Order cancel(Long orderId) {
        authentication = SecurityContextHolder.getContext().getAuthentication();
        log.debug("Request to cancel Order by orderId : {}", orderId);
        Order orderToCancel = orderRepository.findById(orderId).get();
        orderToCancel.setStatus(STATUS.REMOVE);
        orderToCancel.setUpdateBy(authentication.getName());
        Order result = orderRepository.save(orderToCancel);
        return result;
    }

    /**
     * Get all the orders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Order> findAll(Pageable pageable) {
        log.debug("Request to get all Orders");
        return orderRepository.findAll(pageable);
    }

    /**
     * Get one order by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Order> findOne(Long id) {
        log.debug("Request to get Order : {}", id);
        authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN) || authority.getAuthority().equals(AuthoritiesConstants.BANK)) {
                return orderRepository.findById(id);
            }
        }
        return orderRepository.findOneForUser(authentication.getName(),id);
    }

    /**
     * Get all user Orders.
     *
     * @return the list of entities.
     */
    @Override
    public Page<Order> findUserOrders(Long userId, Pageable pageable) {
        log.debug("Request to get user Orders");
        return orderRepository.findAllByUserId(userId, pageable);
    }

    /**
     * export orders.
     *
     * @param beginDate .
     * @param endDate .
     * @return excel file of all orders between two dates.
     */
    @Override
    public InputStreamResource exportOrders(ZonedDateTime beginDate, ZonedDateTime endDate) throws IOException {
        log.debug("Request to export all Orders between beginDate {} and endDate {}", beginDate, endDate);
        List<Order> orders = orderRepository.getAllBetweenDates(beginDate, endDate);
        ByteArrayInputStream in = ExcelGenerator.ordersToExcel(orders);
        return new InputStreamResource(in);
    }

    /**
     * export orders.
     *
     * @param beginDate .
     * @param endDate .
     * @param userId .
     * @return excel file of user orders between two dates.
     */
    @Override
    public InputStreamResource exportUserOrders(Long userId, ZonedDateTime beginDate, ZonedDateTime endDate) throws IOException {
        log.debug("Request to export user {} Orders between beginDate {} and endDate {}", userId, beginDate, endDate);
        List<Order> orders = orderRepository.getByUserAllBetweenDates(userId, beginDate, endDate);
        ByteArrayInputStream in = ExcelGenerator.ordersToExcel(orders);
        return new InputStreamResource(in);
    }

    /**
     * Delete the order by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Order : {}", id);
        orderRepository.deleteById(id);
        orderSearchRepository.deleteById(id);
    }

    /**
     * Search for the order corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Order> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Orders for query {}", query);
        return orderSearchRepository.search(queryStringQuery(query), pageable);
    }

    @Override
    public Page<Order> searchUserOrders(String query, Long userId, Pageable pageable) {
        List<Order> orderList = IteratorUtils.toList(orderSearchRepository.search(QueryBuilders.boolQuery()
            .must(queryStringQuery(query))
            .must(matchQuery("user.id", userId))).iterator());
        Page<Order> ordersPage = new PageImpl<Order>(
            orderList,
            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()),
            orderList.size());
        return ordersPage;
    }

}
