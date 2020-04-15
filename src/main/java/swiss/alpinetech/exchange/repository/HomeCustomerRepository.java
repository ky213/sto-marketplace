package swiss.alpinetech.exchange.repository;

import swiss.alpinetech.exchange.domain.HomeCustomer;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the HomeCustomer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HomeCustomerRepository extends JpaRepository<HomeCustomer, Long> {

    @Query("select homeCustomer from HomeCustomer homeCustomer where homeCustomer.user.login = ?#{principal.username}")
    List<HomeCustomer> findByUserIsCurrentUser();
}
