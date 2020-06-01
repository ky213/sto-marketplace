package swiss.alpinetech.exchange.service.impl;

import swiss.alpinetech.exchange.domain.enumeration.STATUS;
import swiss.alpinetech.exchange.service.WhiteListingService;
import swiss.alpinetech.exchange.domain.WhiteListing;
import swiss.alpinetech.exchange.repository.WhiteListingRepository;
import swiss.alpinetech.exchange.repository.search.WhiteListingSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link WhiteListing}.
 */
@Service
@Transactional
public class WhiteListingServiceImpl implements WhiteListingService {

    private final Logger log = LoggerFactory.getLogger(WhiteListingServiceImpl.class);

    private final WhiteListingRepository whiteListingRepository;

    private final WhiteListingSearchRepository whiteListingSearchRepository;

    public WhiteListingServiceImpl(WhiteListingRepository whiteListingRepository, WhiteListingSearchRepository whiteListingSearchRepository) {
        this.whiteListingRepository = whiteListingRepository;
        this.whiteListingSearchRepository = whiteListingSearchRepository;
    }

    /**
     * Save a whiteListing.
     *
     * @param whiteListing the entity to save.
     * @return the persisted entity.
     */
    @Override
    public WhiteListing save(WhiteListing whiteListing) {
        log.debug("Request to save WhiteListing : {}", whiteListing);
        WhiteListing result = whiteListingRepository.save(whiteListing);
        whiteListingSearchRepository.save(result);
        return result;
    }

    @Override
    public WhiteListing create(WhiteListing whiteListing) {
        log.debug("Request to create WhiteListing : {}", whiteListing);
        whiteListing.setStatus(STATUS.PENDING);
        whiteListing.setDateEvent(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        whiteListing.setDateSynchBlk(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        whiteListing.setStName(whiteListing.getSecuritytoken().getName());
        whiteListing.setEthAddress(whiteListing.getSecuritytoken().getKycAddress());
        whiteListing.setBalance(100.00);
        WhiteListing result = whiteListingRepository.save(whiteListing);
        whiteListingSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the whiteListings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<WhiteListing> findAll(Pageable pageable) {
        log.debug("Request to get all WhiteListings");
        return whiteListingRepository.findAll(pageable);
    }

    /**
     * Get one whiteListing by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<WhiteListing> findOne(Long id) {
        log.debug("Request to get WhiteListing : {}", id);
        return whiteListingRepository.findById(id);
    }

    /**
     * Delete the whiteListing by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete WhiteListing : {}", id);
        whiteListingRepository.deleteById(id);
        whiteListingSearchRepository.deleteById(id);
    }

    /**
     * Search for the whiteListing corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<WhiteListing> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of WhiteListings for query {}", query);
        return whiteListingSearchRepository.search(queryStringQuery(query), pageable);    }
}
