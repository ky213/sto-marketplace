package swiss.alpinetech.exchange.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.HomeCustomer;



import java.util.Optional;

/**
 * Service Interface for managing {@link HomeCustomer}.
 */
public interface HomeCustomerService {

    /**
     * Save a homeCustomer.
     *
     * @param homeCustomer the entity to save.
     * @return the persisted entity.
     */
    HomeCustomer save(HomeCustomer homeCustomer);

    /**
     * Get all the homeCustomers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HomeCustomer> findAll(Pageable pageable);

    /**
     * Get the "id" homeCustomer.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<HomeCustomer> findOne(Long id);

    /**
     * Delete the "id" homeCustomer.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the homeCustomer corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<HomeCustomer> search(String query, Pageable pageable);
}
