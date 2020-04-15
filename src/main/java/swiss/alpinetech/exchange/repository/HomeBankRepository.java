package swiss.alpinetech.exchange.repository;

import swiss.alpinetech.exchange.domain.HomeBank;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the HomeBank entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HomeBankRepository extends JpaRepository<HomeBank, Long> {

    @Query("select homeBank from HomeBank homeBank where homeBank.user.login = ?#{principal.username}")
    List<HomeBank> findByUserIsCurrentUser();
}
