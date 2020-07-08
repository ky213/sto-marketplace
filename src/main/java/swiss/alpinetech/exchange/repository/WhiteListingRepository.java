package swiss.alpinetech.exchange.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.Authority;
import swiss.alpinetech.exchange.domain.WhiteListing;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data  repository for the WhiteListing entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WhiteListingRepository extends JpaRepository<WhiteListing, Long> {

    @Query("select whiteListing from WhiteListing whiteListing where whiteListing.user.login = ?#{principal.username}")
    Page<WhiteListing> findByUserIsCurrentUser(Pageable pageable);

    @Query("select whiteListing from WhiteListing whiteListing where ?1 = whiteListing.user.login and ?2 = whiteListing.id")
    Optional<WhiteListing> findOneForUser(String login, Long whiteListingId);

    @Query("select whiteListing from WhiteListing whiteListing where ?1 not member of whiteListing.user.authorities")
    Page<WhiteListing> findWhiteListingForUser(Pageable pageable, Authority authority);
}
