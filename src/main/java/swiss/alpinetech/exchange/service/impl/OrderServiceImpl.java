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
import swiss.alpinetech.exchange.domain.*;
import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;
import swiss.alpinetech.exchange.domain.enumeration.ORDERTYPE;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;
import swiss.alpinetech.exchange.repository.UserRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.OrderBookService;
import swiss.alpinetech.exchange.service.OrderService;
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
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.counting;
import static java.util.stream.Collectors.groupingBy;
import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Order}.
 */
@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);

    private final OrderRepository orderRepository;

    private final OrderSearchRepository orderSearchRepository;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    private Authentication authentication;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecurityTokenService securityTokenService;

    @Autowired
    JmsTemplate jmsTemplate;

    @Autowired
    private OrderBookService orderBookService;

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
        authentication = this.getAuth();
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
        authentication = this.getAuth();
        SecurityToken newSecurityToken = this.securityTokenService.findOne(order.getSecurityToken().getId()).get();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String formattedString = ZonedDateTime.now().format(formatter);
        User user = this.userRepository.findOneByLogin(authentication.getName()).get();
        if (this.orderBookService.orderBookIsEmpty(newSecurityToken)) {
            newSecurityToken = order.getType().equals(ACTIONTYPE.BUY) ? this.securityTokenService.save(newSecurityToken.lastBuyingPrice(order.getPrice())) : this.securityTokenService.save(newSecurityToken.lastSellingprice(order.getPrice()));
        }
        order.setUser(user);
        order.setSecurityToken(newSecurityToken);
        order.setCategoryToken(order.getSecurityToken().getCategory());
        if (order.getLimitOrMarket().equals(ORDERTYPE.MARKET)) {
            order = this.updateMarketOrderPrice(order);
        }
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

    Order updateMarketOrderPrice(Order order) {
        log.debug("Update market order price : {}", order);
        String stoId = ""+order.getSecurityToken().getId();
        Double marketPrice = order.getType() == ACTIONTYPE.BUY ? orderBookService.getLowestSellingPrice(stoId) : orderBookService.getHighestBuyingPrice(stoId);
        if (marketPrice != null) {
            order.setPrice(marketPrice);
            order.setTotalAmount(order.getPrice() * order.getVolume());
            return order;
        }
        order.setPrice(
            order.getType() == ACTIONTYPE.BUY ? order.getSecurityToken().getLastBuyingPrice() : order.getSecurityToken().getLastSellingprice()
        );
        order.setTotalAmount(order.getPrice() * order.getVolume());
        return order;
    }

    /**
     * Cancel order.
     *
     * @param orderId the entity to cancel.
     * @return the cancelled entity.
     */
    @Override
    public Order cancel(Long orderId) throws Exception {
        authentication = this.getAuth();
        log.debug("Request to cancel Order by orderId : {}", orderId);
        Order orderToCancel = orderRepository.findById(orderId).get();
        if (Arrays.asList(STATUS.SUCCESS, STATUS.FAIL, STATUS.REMOVE).contains(orderToCancel.getStatus())) {
            throw new Exception("Order is already completed");
        }
        orderToCancel.setStatus(STATUS.REMOVE);
        orderToCancel.setUpdateBy(authentication.getName());
        Order result = orderRepository.save(orderToCancel);
        return result;
    }

    /**
     * Update fillToken and fillAmount orders of trade.
     *
     * @param resultListTrades the list of trades result of matching engine.
     * @return the updated entity.
     */
    @Override
    public void updateOrderFillTokenAndFillAmount(List<Trade> resultListTrades) {
        log.debug("update orders of trade list", resultListTrades);
        if (resultListTrades.isEmpty()) {
            return;
        }
        for (Trade trade : resultListTrades) {
            orderRepository.findByIdOrder(trade.getMakerOrderID()).ifPresent(order -> {
                order.setFillAmount(trade.getAmount());
                order.setFillToken(trade.getAmount() / trade.getPrice());
                orderRepository.save(order);
            });
            orderRepository.findByIdOrder(trade.getTakerOrderID()).ifPresent(order -> {
                order.setFillAmount(trade.getAmount());
                order.setFillToken(trade.getAmount() / trade.getPrice());
                orderRepository.save(order);
            });
        }
    }

    /**
     * Update order total amount.
     *
     * @param totalAmount the total amount.
     * @param orderId the order to update.
     * @return the updated entity.
     */
    @Override
    public Order updateOrderAmount(Long orderId, Double totalAmount) {
        log.debug("Request to update Order amount by orderId : {}", orderId);
        Order orderToUpdate = orderRepository.findById(orderId).get();
        orderToUpdate.setTotalAmount(totalAmount);
        orderToUpdate.setUpdateBy(this.getAuth().getName());
        Order result = orderRepository.save(orderToUpdate);
        return result;
    }

    /**
     * Update order status.
     *
     * @param status the list of trades result of matching engine.
     * @param orderId the order to update.
     * @return the updated entity.
     */
    @Override
    public Order updateOrderStatus(Long orderId, STATUS status) {
        log.debug("Request to update Order status by orderId : {}", orderId);
        Order orderToUpdate = orderRepository.findById(orderId).get();
        orderToUpdate.setStatus(status);
        orderToUpdate.setUpdateBy(this.getAuth().getName());
        Order result = orderRepository.save(orderToUpdate);
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
        authentication = this.getAuth();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN) || authority.getAuthority().equals(AuthoritiesConstants.BANK)) {
                return orderRepository.findById(id);
            }
        }
        return orderRepository.findOneForUser(authentication.getName(),id);
    }

    /**
     * Get one order by idOrder.
     *
     * @param idOrder the idOrder of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Order> findOneByIdOrder(String idOrder) {
        log.debug("Request to get Order : {}", idOrder);
        return orderRepository.findByIdOrder(idOrder);
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
     * Get all user Orders.
     *
     * @return the list of entities.
     */
    @Override
    public Page<Order> findUserOrdersByStatus(List<STATUS> statuses, Long userId, Pageable pageable) {
        log.debug("Request to get list of user Orders by statuses");
        List<Order> orderList = orderRepository.findAllByUserId(userId)
            .stream()
            .filter(item -> statuses.contains(item.getStatus()))
            .collect(Collectors.toList());
        return convertListToPage(orderList, pageable);
    }

    /**
     * Get all user success Orders per day.
     *
     * @return the list of entities.
     */
    @Override
    public Map<String, Map<ACTIONTYPE, Long>> findUserSuccessOrdersForTwoWeeks(Long userId) {
        log.debug("Request to get list of user success Orders per day");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        ZonedDateTime today = ZonedDateTime.now();
        ZonedDateTime before2Week = today.minusWeeks(2);
        List<Order> orderList = userId != null ? orderRepository.findAllByUserId(userId) : orderRepository.findAll();
        Map<String, List<Order>> map =  orderList
            .stream()
            .filter(
                item ->
                    item.getStatus().equals(STATUS.SUCCESS) &&
                        (
                                item.getUpdateDate().isEqual(today) ||
                                item.getUpdateDate().isEqual(before2Week) ||
                                 (
                                     item.getUpdateDate().isAfter(before2Week) &&
                                     item.getUpdateDate().isBefore(today)
                                 )
                        )
            )
            .collect(groupingBy(item -> item.getUpdateDate().format(formatter)));
        Map<String, Map<ACTIONTYPE, Long>> map2 = new HashMap<>();
        map.forEach((s, list) -> {
            map2.put(s, list.stream().collect(groupingBy(Order::getType, counting())));
            map2.get(s).putIfAbsent(ACTIONTYPE.BUY, 0L);
            map2.get(s).putIfAbsent(ACTIONTYPE.SELL, 0L);
            }
        );
        return map2;
    }

    @Override
    public List<Order> getLastOrders() {
        List<Order> orderList = orderRepository.findLast();
        return orderList;
    }

    /**
     * Get all user Orders.
     *
     * @return the list of entities.
     */
    @Override
    public List<Order> findUserOrders(Long userId) {
        log.debug("Request to get list of user Orders");
        return orderRepository.findAllByUserId(userId);
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
        return convertListToPage(orderList, pageable);
    }

    private Authentication getAuth() {
        Authentication newAuthentication = SecurityContextHolder.getContext().getAuthentication();
        if (newAuthentication != null) {
            return newAuthentication;
        }
        return this.authentication;
    }

    @Override
    public boolean isSameUser(Order orderA, Order orderB) {
        orderB = orderRepository.findById(orderB.getId()).get();
        if (orderA.getUser().getId().equals(orderB.getUser().getId())) {
            return true;
        }
        return false;
    }

    private Page<Order> convertListToPage(List<Order> orderList, Pageable pageable) {
        Page<Order> orderPage = new PageImpl<Order>(
            orderList,
            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()),
            orderList.size());
        return orderPage;
    }

}
