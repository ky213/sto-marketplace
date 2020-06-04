package swiss.alpinetech.exchange.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.WhiteListing;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the WhiteListing entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WhiteListingRepository extends JpaRepository<WhiteListing, Long> {

    @Query("select whiteListing from WhiteListing whiteListing where whiteListing.user.login = ?#{principal.username}")
    Page<WhiteListing> findByUserIsCurrentUser(Pageable pageable);
}
