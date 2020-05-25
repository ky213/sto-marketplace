package swiss.alpinetech.exchange.service.impl;

import swiss.alpinetech.exchange.domain.enumeration.STSTATUS;
import swiss.alpinetech.exchange.service.SecurityTokenService;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.repository.SecurityTokenRepository;
import swiss.alpinetech.exchange.repository.search.SecurityTokenSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link SecurityToken}.
 */
@Service
@Transactional
public class SecurityTokenServiceImpl implements SecurityTokenService {

    private final Logger log = LoggerFactory.getLogger(SecurityTokenServiceImpl.class);

    private final SecurityTokenRepository securityTokenRepository;

    private final SecurityTokenSearchRepository securityTokenSearchRepository;

    public SecurityTokenServiceImpl(SecurityTokenRepository securityTokenRepository, SecurityTokenSearchRepository securityTokenSearchRepository) {
        this.securityTokenRepository = securityTokenRepository;
        this.securityTokenSearchRepository = securityTokenSearchRepository;
    }

    /**
     * Save a securityToken.
     *
     * @param securityToken the entity to save.
     * @return the persisted entity.
     */
    @Override
    public SecurityToken save(SecurityToken securityToken) {
        log.debug("Request to save SecurityToken : {}", securityToken);
        SecurityToken result = securityTokenRepository.save(securityToken);
        securityTokenSearchRepository.save(result);
        return result;
    }

    /**
     * Deactivate a securityToken.
     *
     * @param id the entity id to update.
     * @return the persisted entity.
     */
    @Override
    public SecurityToken deactivateSecurityToken(Long id) {
        log.debug("Request to deactivate SecurityToken : {}", id);
        SecurityToken result = securityTokenRepository.findById(id).get();
        result.setStatus(STSTATUS.DISABLED);
        securityTokenSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the securityTokens.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<SecurityToken> findAll(Pageable pageable) {
        log.debug("Request to get all SecurityTokens");
        return securityTokenRepository.findAll(pageable);
    }

    /**
     * Get one securityToken by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<SecurityToken> findOne(Long id) {
        log.debug("Request to get SecurityToken : {}", id);
        return securityTokenRepository.findById(id);
    }

    /**
     * Delete the securityToken by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete SecurityToken : {}", id);
        securityTokenRepository.deleteById(id);
        securityTokenSearchRepository.deleteById(id);
    }

    /**
     * Search for the securityToken corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<SecurityToken> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of SecurityTokens for query {}", query);
        return securityTokenSearchRepository.search(queryStringQuery(query), pageable);    }
}
