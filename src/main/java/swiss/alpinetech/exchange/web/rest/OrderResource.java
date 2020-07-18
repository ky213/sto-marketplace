package swiss.alpinetech.exchange.web.rest;

import org.springframework.core.io.InputStreamResource;
import org.springframework.security.access.prepost.PreAuthorize;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.OrderService;
import swiss.alpinetech.exchange.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link swiss.alpinetech.exchange.domain.Order}.
 */
@RestController
@RequestMapping("/api")
public class OrderResource {

    private final Logger log = LoggerFactory.getLogger(OrderResource.class);

    private static final String ENTITY_NAME = "order";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrderService orderService;

    public OrderResource(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * {@code POST  /orders} : Create a new order.
     *
     * @param order the order to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new order, or with status {@code 400 (Bad Request)} if the order has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.USER+"\")")
    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody Order order) throws URISyntaxException {
        log.debug("REST request to save Order : {}", order);
        if (order.getId() != null) {
            throw new BadRequestAlertException("A new order cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Order result = orderService.save(order);
        return ResponseEntity.created(new URI("/api/orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /orders} : custom Create a new order.
     *
     * @param order the order to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new order, or with status {@code 400 (Bad Request)} if the order has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.USER+"\")")
    @PostMapping("/create-order")
    public ResponseEntity<Order> customCreateOrder(@Valid @RequestBody Order order) throws URISyntaxException {
        log.debug("REST request to create Order : {}", order);
        if (order.getId() != null) {
            throw new BadRequestAlertException("A new order cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Order result = orderService.create(order);
        return ResponseEntity.created(new URI("/api/orders/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /orders} : Updates an existing order.
     *
     * @param order the order to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated order,
     * or with status {@code 400 (Bad Request)} if the order is not valid,
     * or with status {@code 500 (Internal Server Error)} if the order couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/orders")
    public ResponseEntity<Order> updateOrder(@Valid @RequestBody Order order) throws URISyntaxException {
        log.debug("REST request to update Order : {}", order);
        if (order.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Order result = orderService.save(order);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, order.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /orders} : Updates an existing order.
     *
     * @param orderId the order to cancel.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the canceled order,
     * or with status {@code 400 (Bad Request)} if the order is not valid,
     * or with status {@code 500 (Internal Server Error)} if the order couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/cancel-order")
    public ResponseEntity<Order> cancelOrder(@Valid @RequestParam Long orderId) throws URISyntaxException {
        log.debug("REST request to cancel Order by Id : {}", orderId);
        if (orderId == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Order result = orderService.cancel(orderId);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, orderId.toString()))
            .body(result);
    }

    /**
     * {@code GET  /orders} : get all the orders.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orders in body.
     */
    @GetMapping("/orders")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<List<Order>> getAllOrders(Pageable pageable) {
        log.debug("REST request to get a page of Orders");
        Page<Order> page = orderService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }


    /**
     * {@code GET  /orders} : get all the orders.
     *
     * @param beginDateParam the begin date of orders.
     * @param endDateParam the end date of orders.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the excel file list of orders in body.
     */
    @GetMapping("/orders/export")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<InputStreamResource> exportOrders(@RequestParam String beginDateParam, @RequestParam String endDateParam) throws IOException {
        log.debug("REST request to export list of Orders between beginDate {} and endDate {}", beginDateParam, endDateParam);
        ZonedDateTime beginDate = ZonedDateTime.parse(beginDateParam);
        ZonedDateTime endDate = ZonedDateTime.parse(endDateParam);
        InputStreamResource ordersExcelFile = orderService.exportOrders(beginDate, endDate);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=orders.xlsx");
        return ResponseEntity
            .ok()
            .headers(headers)
            .body(ordersExcelFile);
    }

    /**
     * {@code GET  /orders} : get all the orders.
     *
     * @param beginDateParam the begin date of orders.
     * @param endDateParam the end date of orders.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the excel file list of orders in body.
     */
    @GetMapping("/user-orders/export")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.USER+"\")")
    public ResponseEntity<InputStreamResource> exportUserOrders(@RequestParam Long userId, @RequestParam String beginDateParam, @RequestParam String endDateParam) throws IOException {
        log.debug("REST request to export list of user {} Orders between beginDate {} and endDate {}", userId, beginDateParam, endDateParam);
        ZonedDateTime beginDate = ZonedDateTime.parse(beginDateParam);
        ZonedDateTime endDate = ZonedDateTime.parse(endDateParam);
        InputStreamResource ordersExcelFile = orderService.exportUserOrders(userId, beginDate, endDate);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=orders.xlsx");
        return ResponseEntity
            .ok()
            .headers(headers)
            .body(ordersExcelFile);
    }

    /**
     * {@code GET  /orders/:id} : get the "id" order.
     *
     * @param id the id of the order to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the order, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable Long id) {
        log.debug("REST request to get Order : {}", id);
        Optional<Order> order = orderService.findOne(id);
        return ResponseUtil.wrapOrNotFound(order);
    }

    /**
     * {@code GET  /user-orders} : get user orders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the user orders, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-orders")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.USER+"\")")
    public ResponseEntity<List<Order>> getUserOrders(@RequestParam Long userId, Pageable pageable) {
        log.debug("REST request to get User Orders");
        Page<Order> page = orderService.findUserOrders(userId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-orders} : get user orders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the user orders, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-orders/status")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.USER+"\")")
    public ResponseEntity<List<Order>> getUserOrdersByStatus(@RequestParam Long userId, @RequestParam List<STATUS> statuses, Pageable pageable) {
        log.debug("REST request to get User Orders by statuses");
        Page<Order> page = orderService.findUserOrdersByStatus(statuses, userId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code DELETE  /orders/:id} : delete the "id" order.
     *
     * @param id the id of the order to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        log.debug("REST request to delete Order : {}", id);
        orderService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/orders?query=:query} : search for the order corresponding
     * to the query.
     *
     * @param query the query of the order search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/orders")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<List<Order>> searchOrders(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Orders for query {}", query);
        Page<Order> page = orderService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code SEARCH  /_search/orders?query=:query} : search for the order corresponding
     * to the query.
     *
     * @param query the query of the order search.
     * @param pageable the pagination information.
     * @param userId the order user Id.
     * @return the result of the search.
     */
    @GetMapping("/_search/user-orders")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.USER+"\")")
    public ResponseEntity<List<Order>> searchUserOrders(@RequestParam String query, @RequestParam Long userId, Pageable pageable) {
        log.debug("REST request to search for a page of user {} Orders for query {}", userId, query);
        Page<Order> page = orderService.searchUserOrders(query, userId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
