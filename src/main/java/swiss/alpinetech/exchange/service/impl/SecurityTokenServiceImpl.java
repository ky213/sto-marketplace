package swiss.alpinetech.exchange.service.impl;

import org.apache.commons.collections4.IteratorUtils;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import swiss.alpinetech.exchange.domain.enumeration.STSTATUS;
import swiss.alpinetech.exchange.repository.WhiteListingRepository;
import swiss.alpinetech.exchange.repository.search.WhiteListingSearchRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
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

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Autowired
    private WhiteListingSearchRepository whiteListingSearchRepository;

    @Autowired
    private WhiteListingRepository whiteListingRepository;

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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN)) {
                return securityTokenRepository.findAll(pageable);
            }
        }
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.BANK)) {
                return securityTokenRepository.findAllByStatusACTIVE(pageable);
            }
        }
        List<SecurityToken> securityTokenList = IteratorUtils.toList(this.whiteListingRepository.findByUserIsCurrentUser(pageable).iterator())
            .stream()
            .filter(wl -> wl.getSecuritytoken().getStatus().equals(STSTATUS.ACTIVE))
            .map(wl -> wl.getSecuritytoken())
            .collect(Collectors.toList());
        Page<SecurityToken> securityTokensPage = new PageImpl<SecurityToken>(
            securityTokenList,
            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()),
            securityTokenList.size());
        return securityTokensPage;
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
        return securityTokenSearchRepository.search(queryStringQuery(query), pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SecurityToken> searchForWhiteListing(String query, Long userId) {
        log.debug("Request to search security tokens for query {} for whiteListing autocomplete", query);
        if (userId == null) {
            List<SecurityToken> securityTokenList = IteratorUtils.toList(securityTokenSearchRepository.search(queryStringQuery(query)
                .fuzziness(Fuzziness.ONE)
                .fuzzyPrefixLength(2))
                .iterator());
            return securityTokenList;
        }
        List<Long> securityTokensPermitted = IteratorUtils.toList(this.whiteListingSearchRepository.search(QueryBuilders.boolQuery()
            .must(matchQuery("user.id", userId))).iterator())
            .stream()
            .map(wl -> wl.getSecuritytoken().getId())
            .collect(Collectors.toList());

        List<SecurityToken> securityTokenList = IteratorUtils.toList(securityTokenSearchRepository.search(queryStringQuery(query)
            .fuzziness(Fuzziness.ONE)
            .fuzzyPrefixLength(2))
            .iterator())
            .stream()
            .filter(st -> !securityTokensPermitted.contains(st.getId()))
            .collect(Collectors.toList());

        return securityTokenList;
    }
}
