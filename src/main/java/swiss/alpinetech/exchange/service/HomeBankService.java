package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.HomeBank;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link HomeBank}.
 */
public interface HomeBankService {

    /**
     * Save a homeBank.
     *
     * @param homeBank the entity to save.
     * @return the persisted entity.
     */
    HomeBank save(HomeBank homeBank);

    /**
     * Get all the homeBanks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HomeBank> findAll(Pageable pageable);

    /**
     * Get the "id" homeBank.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<HomeBank> findOne(Long id);

    /**
     * Delete the "id" homeBank.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the homeBank corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HomeBank> search(String query, Pageable pageable);
}
