package swiss.alpinetech.exchange.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.Authority;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.domain.WhiteListing;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the WhiteListing entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WhiteListingRepository extends JpaRepository<WhiteListing, Long> {

    @Query("select whiteListing from WhiteListing whiteListing where whiteListing.user.login = ?#{principal.username}")
    Page<WhiteListing> findByUserIsCurrentUser(Pageable pageable);

    @Query("select whiteListing from WhiteListing whiteListing where whiteListing.user.login = ?#{principal.username}")
    List<WhiteListing> findByUserIsCurrentUser();

    @Query("select whiteListing from WhiteListing whiteListing where ?1 = whiteListing.securitytoken.id")
    List<WhiteListing> findBySecuritytokenId(Long securityTokenId);

    @Query("select whiteListing from WhiteListing whiteListing where ?1 = whiteListing.user.login and ?2 = whiteListing.id")
    Optional<WhiteListing> findOneForUser(String login, Long whiteListingId);

    @Query("select whiteListing from WhiteListing whiteListing where ?1 not member of whiteListing.user.authorities")
    Page<WhiteListing> findWhiteListingForUser(Pageable pageable, Authority authority);

    @Query(value = "SELECT TOP 6 jhi_user.login, SUM (balance) as sum_balance from white_listing INNER JOIN jhi_user ON white_listing.user_id = jhi_user.ID GROUP BY user_id ORDER BY sum_balance DESC", nativeQuery = true)
    List<Object> findAllGroupByUserSumAmount();
}
