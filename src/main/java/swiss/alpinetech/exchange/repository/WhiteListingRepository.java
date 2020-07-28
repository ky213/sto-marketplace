package swiss.alpinetech.exchange.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.Authority;
import swiss.alpinetech.exchange.domain.WhiteListing;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import javax.persistence.Tuple;
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

    @Query(value = "SELECT " +
        "TOP 6 jhi_user.login, " +
        "SUM (balance) as sum_balance " +
        "from " +
        "white_listing INNER JOIN jhi_user ON white_listing.user_id = jhi_user.ID " +
        "WHERE white_listing.ACTIVE = true\n" +
        "GROUP BY user_id " +
        "ORDER BY sum_balance DESC", nativeQuery = true)
    List<Object> findAllGroupByUserSumAmount();

    @Query(value = "SELECT\n" +
        "category,\n" +
        "total_amount,\n" +
        "total_amount / SUM(total_amount) OVER() * 100 as percentage\n" +
        "from (\n" +
        "SELECT \n" +
        "security_token.category,\n" +
        "SUM (balance * security_token.LAST_BUYING_PRICE) as total_amount\n" +
        "from " +
        "white_listing INNER JOIN security_token ON white_listing.SECURITYTOKEN_ID = security_token.ID " +
        "WHERE white_listing.ACTIVE = true and security_token.STATUS = 'ACTIVE'\n" +
        "GROUP BY security_token.category " +
        "ORDER BY total_amount DESC\n" +
        ")", nativeQuery = true)
    List<Tuple> findAssetsDistribution();

    @Query(value = "SELECT \n" +
        "category, \n" +
        "total_amount, \n" +
        "total_amount / SUM(total_amount) OVER() * 100 as percentage from \n" +
        "( SELECT \n" +
        "security_token.category, \n" +
        "SUM (balance * security_token.LAST_BUYING_PRICE) as total_amount from \n" +
        "white_listing INNER JOIN security_token ON white_listing.SECURITYTOKEN_ID = security_token.ID\n" +
        "WHERE white_listing.USER_ID = ?1 and white_listing.ACTIVE = true and security_token.STATUS = 'ACTIVE'\n" +
        "GROUP BY security_token.category \n" +
        "ORDER BY total_amount DESC\n" +
        ")", nativeQuery = true)
    List<Tuple> findAssetsDistributionForUser(Long userId);

    @Query(value = "SELECT TOP ?2 security_token.symbol, balance, security_token.LAST_BUYING_PRICE, balance * security_token.LAST_BUYING_PRICE as total_amount\n" +
        "FROM WHITE_LISTING \n" +
        "INNER JOIN security_token ON white_listing.SECURITYTOKEN_ID = security_token.ID\n" +
        "WHERE USER_ID = ?1 AND ACTIVE = TRUE AND security_token.STATUS = 'ACTIVE'\n" +
        "ORDER BY total_amount DESC ", nativeQuery = true)
    List<Tuple> findWhiteListedSTOforUserTopAmount(Long userId, int top);

}
