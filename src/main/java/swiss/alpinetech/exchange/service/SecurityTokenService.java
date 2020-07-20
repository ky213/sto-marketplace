package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.OrderBookWrapper;
import swiss.alpinetech.exchange.domain.SecurityToken;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Service Interface for managing {@link SecurityToken}.
 */
public interface SecurityTokenService {

    /**
     * Save a securityToken.
     *
     * @param securityToken the entity to save.
     * @return the persisted entity.
     */
    SecurityToken save(SecurityToken securityToken);

    /**
     * Deactivate a securityToken.
     *
     * @param id the entity id to update.
     * @return the persisted entity.
     */
    SecurityToken deactivateSecurityToken(Long id);

    /**
     * Update securityToken price according to order.
     *
     * @param order the entity id to update.
     * @return the persisted entity.
     */
    SecurityToken updateSecurityTokenPrice(Order order);

    /**
     * Get all the securityTokens.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SecurityToken> findAll(Pageable pageable);

    /**
     * get Total Balance of securityToken.
     *
     * @param securityTokenId the security token Id.
     * @return the total Balance.
     */
    Double getTotalBalance(Long securityTokenId);

    /**
     * get Order book of securityToken.
     *
     * @param securityTokenId the security token Id.
     * @return OrderBook.
     */
    OrderBookWrapper getSecurityTokenOrderBook(Long securityTokenId);

    /**
     * get Assets of securityTokens for whitelisted user.
     *
     * @return Assets.
     */
    Map<CATEGORY, Long> getAssets();

    /**
     * get Total amounts of securityTokens.
     *
     * @return Total amounts of securityTokens.
     */
    Map<String, Double> getTotalAmount();

    /**
     * get last 5 Security Token whitelisted on the marketplace by the bank for current user.
     *
     * @return securityTokens list.
     */
    List<SecurityToken> getLastSTOWhitelisted();

    /**
     * Get the "id" securityToken.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<SecurityToken> findOne(Long id);

    /**
     * Delete the "id" securityToken.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the securityToken corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SecurityToken> search(String query, Pageable pageable);

    /**
     * Search for the securityToken corresponding to the query and permited for user to create whitelisting.
     *
     * @param query the query of the search.
     *
     * @param userId the user Id.
     * @return the list of entities.
     */
    List<SecurityToken> searchForWhiteListing(String query, Long userId);
}
