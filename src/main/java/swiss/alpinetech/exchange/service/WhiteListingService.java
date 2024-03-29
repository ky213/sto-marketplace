package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.WhiteListing;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link WhiteListing}.
 */
public interface WhiteListingService {

    /**
     * Save a whiteListing.
     *
     * @param whiteListing the entity to save.
     * @return the persisted entity.
     */
    WhiteListing save(WhiteListing whiteListing);

    /**
     * Update a whiteListing.
     *
     * @param whiteListing the entity to update.
     * @return the persisted entity.
     */
    WhiteListing update(WhiteListing whiteListing);

    /**
     * Create a whiteListing.
     *
     * @param whiteListing the entity to save.
     * @return the persisted entity.
     */
    WhiteListing create(WhiteListing whiteListing);

    /**
     * Get all the whiteListings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<WhiteListing> findAll(Pageable pageable);

    /**
     * Get all the user's whiteListings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<WhiteListing> findUserwhiteListings(Pageable pageable);

    /**
     * Get the "id" whiteListing.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<WhiteListing> findOne(Long id);

    /**
     * Delete the "id" whiteListing.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the whiteListing corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<WhiteListing> search(String query, Pageable pageable);

    /**
     * Search for the whiteListing user corresponding to the query.
     *
     * @param query the query of the search.
     * @param userId the id of the user.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<WhiteListing> searchUserWhiteListings(String query, Long userId, Pageable pageable);
}
