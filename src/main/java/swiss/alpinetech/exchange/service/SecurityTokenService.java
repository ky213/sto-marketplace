package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.SecurityToken;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
     * Get all the securityTokens.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<SecurityToken> findAll(Pageable pageable);

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
}
