package swiss.alpinetech.exchange.service.impl;

import swiss.alpinetech.exchange.service.HomeCustomerService;
import swiss.alpinetech.exchange.domain.HomeCustomer;
import swiss.alpinetech.exchange.repository.HomeCustomerRepository;
import swiss.alpinetech.exchange.repository.search.HomeCustomerSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link HomeCustomer}.
 */
@Service
@Transactional
public class HomeCustomerServiceImpl implements HomeCustomerService {

    private final Logger log = LoggerFactory.getLogger(HomeCustomerServiceImpl.class);

    private final HomeCustomerRepository homeCustomerRepository;

    private final HomeCustomerSearchRepository homeCustomerSearchRepository;

    public HomeCustomerServiceImpl(HomeCustomerRepository homeCustomerRepository, HomeCustomerSearchRepository homeCustomerSearchRepository) {
        this.homeCustomerRepository = homeCustomerRepository;
        this.homeCustomerSearchRepository = homeCustomerSearchRepository;
    }

    /**
     * Save a homeCustomer.
     *
     * @param homeCustomer the entity to save.
     * @return the persisted entity.
     */
    @Override
    public HomeCustomer save(HomeCustomer homeCustomer) {
        log.debug("Request to save HomeCustomer : {}", homeCustomer);
        HomeCustomer result = homeCustomerRepository.save(homeCustomer);
        homeCustomerSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the homeCustomers.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<HomeCustomer> findAll(Pageable pageable) {
        log.debug("Request to get all HomeCustomers");
        return homeCustomerRepository.findAll(pageable);
    }

    /**
     * Get one homeCustomer by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<HomeCustomer> findOne(Long id) {
        log.debug("Request to get HomeCustomer : {}", id);
        return homeCustomerRepository.findById(id);
    }

    /**
     * Delete the homeCustomer by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete HomeCustomer : {}", id);
        homeCustomerRepository.deleteById(id);
        homeCustomerSearchRepository.deleteById(id);
    }

    /**
     * Search for the homeCustomer corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<HomeCustomer> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of HomeCustomers for query {}", query);
        return homeCustomerSearchRepository.search(queryStringQuery(query), pageable);    }
}
