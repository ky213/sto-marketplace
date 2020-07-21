package swiss.alpinetech.exchange.service;

import org.springframework.core.io.InputStreamResource;
import swiss.alpinetech.exchange.domain.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.Trade;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service Interface for managing {@link Order}.
 */
public interface OrderService {

    /**
     * Save a order.
     *
     * @param order the entity to save.
     * @return the persisted entity.
     */
    Order save(Order order);

    /**
     * Custom create a order.
     *
     * @param order the entity to save.
     * @return the persisted entity.
     */
    Order create(Order order);

    /**
     * Cancel order.
     *
     * @param orderId the entity to cancel.
     * @return the cancelled entity.
     */
    Order cancel(Long orderId) throws Exception;

    /**
     * Update fillToken and fillAmount orders of trade.
     *
     * @param resultListTrades the list of trades result of matching engine.
     * @return the updated entity.
     */
    void updateOrderFillTokenAndFillAmount(List<Trade> resultListTrades);

    /**
     * Update order total amount.
     *
     * @param totalAmount the total amount.
     * @param orderId the order to update.
     * @return the updated entity.
     */
    Order updateOrderAmount(Long orderId, Double totalAmount);

    /**
     * Update order status.
     *
     * @param status the list of trades result of matching engine.
     * @param orderId the order to update.
     * @return the updated entity.
     */
    Order updateOrderStatus(Long orderId, STATUS status);

    /**
     * Get all the orders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Order> findAll(Pageable pageable);

    /**
     * Get the "id" order.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Order> findOne(Long id);

    /**
     * Get one order by idOrder.
     *
     * @param idOrder the idOrder of the entity.
     * @return the entity.
     */
    Optional<Order> findOneByIdOrder(String idOrder);

    /**
     * Get all user Orders.
     *
     * @return the list of entities.
     */
    Page<Order> findUserOrders(Long userId, Pageable pageable);

    /**
     * Get all user Orders.
     *
     * @return the list of entities.
     */
    List<Order> findUserOrders(Long userId);

    /**
     * Get all user Orders.
     *
     * @return the list of entities.
     */
    Page<Order> findUserOrdersByStatus(List<STATUS> statuses, Long userId, Pageable pageable);

    /**
     * Get all user success Orders per day.
     *
     * @return the list of entities.
     */
    Map<String, List<Order>> findUserSuccessOrders(Long userId);

    /**
     * get last 4 orders added.
     *
     * @return orders list.
     */
    List<Order> getLastOrders();

    /**
     * export orders.
     *
     * @param beginDate .
     * @param endDate .
     * @return excel file of all orders between two dates.
     */
    InputStreamResource exportOrders(ZonedDateTime beginDate, ZonedDateTime endDate) throws IOException;

    /**
     * export orders.
     *
     * @param beginDate .
     * @param endDate .
     * @param userId .
     * @return excel file of user orders between two dates.
     */
    InputStreamResource exportUserOrders(Long userId, ZonedDateTime beginDate, ZonedDateTime endDate) throws IOException;

    /**
     * Delete the "id" order.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the order corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Order> search(String query, Pageable pageable);


    Page<Order> searchUserOrders(String query, Long userId, Pageable pageable);

    boolean isSameUser(Order orderA, Order orderB);
}
