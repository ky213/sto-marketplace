package swiss.alpinetech.exchange.service;

import org.springframework.core.io.InputStreamResource;
import swiss.alpinetech.exchange.domain.Order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.IOException;
import java.time.ZonedDateTime;
import java.util.List;
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
     * Cancel order.
     *
     * @param orderId the entity to cancel.
     * @return the cancelled entity.
     */
    Order cancel(Long orderId);

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
     * Get all user Orders.
     *
     * @return the list of entities.
     */
    Page<Order> findUserOrders(Long userId, Pageable pageable);

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
}
