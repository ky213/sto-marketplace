package swiss.alpinetech.exchange.repository;

import org.springframework.data.domain.Page;
import swiss.alpinetech.exchange.domain.Order;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Order entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("select order from Order order where order.user.login = ?#{principal.username}")
    List<Order> findByUserIsCurrentUser();

    Page<Order> findAllByUserId(Long userId, Pageable pageable);

    List<Order> findAllByUserId(Long userId);

    @Query(value = "SELECT * from jhi_order where update_date BETWEEN ?1 AND ?2", nativeQuery = true)
    List<Order> getAllBetweenDates(ZonedDateTime startDate, ZonedDateTime endDate);

    @Query(value = "SELECT * from jhi_order where user_id = ?1 and update_date BETWEEN ?2 AND ?3", nativeQuery = true)
    List<Order> getByUserAllBetweenDates(Long userId, ZonedDateTime startDate, ZonedDateTime endDate);

    @Query("select order from Order order where order.user.login = ?1 and order.id = ?2")
    Optional<Order> findOneForUser(String login, Long orderId);

    Optional<Order> findByIdOrder(String idOrder);
}
