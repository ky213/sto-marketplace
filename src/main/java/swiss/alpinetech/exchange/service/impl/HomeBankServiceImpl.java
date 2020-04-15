package swiss.alpinetech.exchange.service.impl;

import swiss.alpinetech.exchange.service.HomeBankService;
import swiss.alpinetech.exchange.domain.HomeBank;
import swiss.alpinetech.exchange.repository.HomeBankRepository;
import swiss.alpinetech.exchange.repository.search.HomeBankSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link HomeBank}.
 */
@Service
@Transactional
public class HomeBankServiceImpl implements HomeBankService {

    private final Logger log = LoggerFactory.getLogger(HomeBankServiceImpl.class);

    private final HomeBankRepository homeBankRepository;

    private final HomeBankSearchRepository homeBankSearchRepository;

    public HomeBankServiceImpl(HomeBankRepository homeBankRepository, HomeBankSearchRepository homeBankSearchRepository) {
        this.homeBankRepository = homeBankRepository;
        this.homeBankSearchRepository = homeBankSearchRepository;
    }

    /**
     * Save a homeBank.
     *
     * @param homeBank the entity to save.
     * @return the persisted entity.
     */
    @Override
    public HomeBank save(HomeBank homeBank) {
        log.debug("Request to save HomeBank : {}", homeBank);
        HomeBank result = homeBankRepository.save(homeBank);
        homeBankSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the homeBanks.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<HomeBank> findAll(Pageable pageable) {
        log.debug("Request to get all HomeBanks");
        return homeBankRepository.findAll(pageable);
    }

    /**
     * Get one homeBank by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<HomeBank> findOne(Long id) {
        log.debug("Request to get HomeBank : {}", id);
        return homeBankRepository.findById(id);
    }

    /**
     * Delete the homeBank by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete HomeBank : {}", id);
        homeBankRepository.deleteById(id);
        homeBankSearchRepository.deleteById(id);
    }

    /**
     * Search for the homeBank corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<HomeBank> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of HomeBanks for query {}", query);
        return homeBankSearchRepository.search(queryStringQuery(query), pageable);    }
}
