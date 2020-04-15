package swiss.alpinetech.exchange.service.impl;

import swiss.alpinetech.exchange.service.BankInfoService;
import swiss.alpinetech.exchange.domain.BankInfo;
import swiss.alpinetech.exchange.repository.BankInfoRepository;
import swiss.alpinetech.exchange.repository.search.BankInfoSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link BankInfo}.
 */
@Service
@Transactional
public class BankInfoServiceImpl implements BankInfoService {

    private final Logger log = LoggerFactory.getLogger(BankInfoServiceImpl.class);

    private final BankInfoRepository bankInfoRepository;

    private final BankInfoSearchRepository bankInfoSearchRepository;

    public BankInfoServiceImpl(BankInfoRepository bankInfoRepository, BankInfoSearchRepository bankInfoSearchRepository) {
        this.bankInfoRepository = bankInfoRepository;
        this.bankInfoSearchRepository = bankInfoSearchRepository;
    }

    /**
     * Save a bankInfo.
     *
     * @param bankInfo the entity to save.
     * @return the persisted entity.
     */
    @Override
    public BankInfo save(BankInfo bankInfo) {
        log.debug("Request to save BankInfo : {}", bankInfo);
        BankInfo result = bankInfoRepository.save(bankInfo);
        bankInfoSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the bankInfos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<BankInfo> findAll(Pageable pageable) {
        log.debug("Request to get all BankInfos");
        return bankInfoRepository.findAll(pageable);
    }

    /**
     * Get one bankInfo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<BankInfo> findOne(Long id) {
        log.debug("Request to get BankInfo : {}", id);
        return bankInfoRepository.findById(id);
    }

    /**
     * Delete the bankInfo by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete BankInfo : {}", id);
        bankInfoRepository.deleteById(id);
        bankInfoSearchRepository.deleteById(id);
    }

    /**
     * Search for the bankInfo corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<BankInfo> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of BankInfos for query {}", query);
        return bankInfoSearchRepository.search(queryStringQuery(query), pageable);    }
}
