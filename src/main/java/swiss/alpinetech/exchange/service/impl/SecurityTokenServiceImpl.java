package swiss.alpinetech.exchange.service.impl;

import org.apache.commons.collections4.IteratorUtils;
import org.elasticsearch.index.query.QueryBuilders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import swiss.alpinetech.exchange.domain.*;
import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;
import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;
import swiss.alpinetech.exchange.domain.enumeration.STSTATUS;
import swiss.alpinetech.exchange.repository.WhiteListingRepository;
import swiss.alpinetech.exchange.repository.search.WhiteListingSearchRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.OrderBookService;
import swiss.alpinetech.exchange.service.OrderService;
import swiss.alpinetech.exchange.service.SecurityTokenService;
import swiss.alpinetech.exchange.repository.SecurityTokenRepository;
import swiss.alpinetech.exchange.repository.search.SecurityTokenSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swiss.alpinetech.exchange.service.UserService;
import swiss.alpinetech.exchange.service.dto.AssetsDistributionDTO;
import swiss.alpinetech.exchange.service.dto.AssetsHeldDTO;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static java.util.stream.Collectors.*;
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
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private WhiteListingRepository whiteListingRepository;

    @Autowired
    private OrderBookService orderBookService;

    private SecurityTokenOrderBook securityTokenOrderBook;

    private Authentication authentication;

    public SecurityTokenServiceImpl(SecurityTokenRepository securityTokenRepository, SecurityTokenSearchRepository securityTokenSearchRepository) {
        this.securityTokenRepository = securityTokenRepository;
        this.securityTokenSearchRepository = securityTokenSearchRepository;
    }

    @JmsListener(destination = "outbound.orderBook.topic")
    void getSecurityTokenOrderBookFromTopic(Map<String, Map<String, List<String>>> message) {
        log.debug("consume securityTokenOrderBook {} from security token service", message);
        this.securityTokenOrderBook = orderBookService.readAndConvertFromTopic(message);
        log.debug("new securityTokenOrderBook {} from topic", securityTokenOrderBook.toString());
    };

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
     * Update securityToken price according to order.
     *
     * @param order the entity id to update.
     * @return the persisted entity.
     */
    @Override
    public SecurityToken updateSecurityTokenPrice(Order order) {
        SecurityToken securityToken = this.securityTokenRepository.findById(order.getSecurityToken().getId()).get();
        if (this.securityTokenOrderBook == null) {
            return securityToken;
        }
        Set<Order> buyOrders = this.orderBookService.getBuyOrdersBySecurityToken(""+securityToken.getId(), this.securityTokenOrderBook);
        Set<Order> sellOrders = this.orderBookService.getSellOrdersBySecurityToken(""+securityToken.getId(), this.securityTokenOrderBook);

        if(order.getType().name().equals(ACTIONTYPE.BUY.name())) {
            if (!sellOrders.isEmpty()) {
                Double minSellOrdersPrice = sellOrders.stream().min(Comparator.comparing(Order::getPrice)).get().getPrice();
                if (order.getPrice() >= minSellOrdersPrice) {
                    securityToken.setLastSellingprice(order.getPrice());
                }
            } else {
                securityToken.setLastBuyingPrice(order.getPrice());
            }
        }
        if(order.getType().name().equals(ACTIONTYPE.SELL.name())) {
            if (!buyOrders.isEmpty()) {
                Double maxBuyOrdersPrice = buyOrders.stream().max(Comparator.comparing(Order::getPrice)).get().getPrice();
                if (order.getPrice() <= maxBuyOrdersPrice) {
                    securityToken.setLastBuyingPrice(order.getPrice());
                }
            } else {
                securityToken.setLastSellingprice(order.getPrice());
            }
        }
        return save(securityToken);
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
        if (currentUserIsAdmin()) {
            return securityTokenRepository.findAll(pageable);
        }
        if (currentUserIsBank()) {
            return securityTokenRepository.findAllByStatusACTIVE(pageable);
        }
        List<SecurityToken> securityTokenList = IteratorUtils.toList(this.whiteListingRepository.findByUserIsCurrentUser(pageable).iterator())
            .stream()
            .filter(wl -> wl.getSecuritytoken().getStatus().equals(STSTATUS.ACTIVE) && wl.isActive())
            .map(wl -> wl.getSecuritytoken())
            .collect(Collectors.toList());
        return convertListToPage(securityTokenList, pageable);
    }

    /**
     * get Total Balance of securityToken.
     *
     * @param securityTokenId the security token Id.
     * @return the total Balance.
     */
    @Override
    public Double getTotalBalance(Long securityTokenId) {
        Double totalBalance = this.whiteListingRepository.findBySecuritytokenId(securityTokenId).stream().mapToDouble(item -> item.getBalance()).sum();
        return totalBalance;
    }

    /**
     * get Order book of securityToken.
     *
     * @param securityTokenId the security token Id.
     * @return OrderBook.
     */
    @Override
    public OrderBookWrapper getSecurityTokenOrderBook(Long securityTokenId) {
        if (this.securityTokenOrderBook == null) {
            return null;
        }
        return this.securityTokenOrderBook.getSecurityTokenOrderBook().get(""+securityTokenId);
    }

    /**
     * get Assets of securityTokens for whitelisted user.
     *
     * @return Assets.
     */
    @Override
    public List<AssetsDistributionDTO> getAssets() {
        authentication = getAuth();
        Long userId = this.userService.getUserWithAuthoritiesByLogin(authentication.getName()).get().getId();
        List<AssetsDistributionDTO> distributionAssetsList = this.whiteListingRepository.findAssetsDistributionForUser(userId)
            .stream()
            .map(item -> new AssetsDistributionDTO( CATEGORY.valueOf((String) item.get(0)), (Double) item.get(1), (Double) item.get(2)))
            .collect(toList());
        return distributionAssetsList;
    }

    /**
     * get distribution (type of token) about Asset allocation of all token of all users.
     *
     * @return distribution Assets list.
     */
    @Override
    public List<AssetsDistributionDTO> getDistributionAssets() {
        List<AssetsDistributionDTO> distributionAssetsList = this.whiteListingRepository.findAssetsDistribution()
            .stream()
            .map(item -> new AssetsDistributionDTO( CATEGORY.valueOf((String) item.get(0)), (Double) item.get(1), (Double) item.get(2)))
            .collect(toList());
        return distributionAssetsList;
    }

    /**
     * get all list 5 of security Token oder by total amount for user.
     *
     * @return sto tuple list.
     */
    @Override
    public List<AssetsHeldDTO> getTopSTOByTotalAmount(Long userId) {
        List<AssetsHeldDTO> list = this.whiteListingRepository.findWhiteListedSTOforUserTopAmount(userId, 5)
            .stream()
            .map(item -> new AssetsHeldDTO(
                (String) item.get(0),
                (Double) item.get(1),
                (Double) item.get(2),
                (Double) item.get(3)
            ))
            .collect(Collectors.toList());
        return list;
    }

    /**
     * get Total amounts of securityTokens.
     *
     * @return Total amounts of securityTokens.
     */
    @Override
    public Map<String, Double> getTotalAmount() {
        authentication = getAuth();
        Long userId = this.userService.getUserWithAuthoritiesByLogin(authentication.getName()).get().getId();
        Map<String, Double> map = this.whiteListingRepository.findWhiteListedSTOforUserTopAmount(userId, 3)
            .stream()
            .collect(Collectors.toMap(item -> (String) item.get(0), item -> (Double) item.get(3)));
        return map;
    }

    /**
     * get Total custody of securityTokens.
     *
     * @return Total custody of securityTokens.
     */
    @Override
    public Double getTotalCustody() {
        Double totalCustody = this.whiteListingRepository.findAll()
            .stream()
            .filter(wl -> wl.isActive() && wl.getSecuritytoken().getStatus().equals(STSTATUS.ACTIVE))
            .mapToDouble(wl -> wl.getBalance() * wl.getSecuritytoken().getLastBuyingPrice()).sum();
        return totalCustody;
    }

    /**
     * get last 5 Security Token whitelisted on the marketplace by the bank for current user.
     *
     * @return securityTokens list.
     */
    @Override
    public List<SecurityToken> getLastSTOWhitelisted() {
        List<SecurityToken> securityTokenList = IteratorUtils.toList(this.whiteListingRepository.findByUserIsCurrentUser().iterator())
            .stream()
            .sorted(Comparator.comparing(wl -> wl.getDateEvent()))
            .filter(wl -> wl.getSecuritytoken().getStatus().equals(STSTATUS.ACTIVE) && wl.isActive())
            .map(wl -> wl.getSecuritytoken())
            .collect(Collectors.toList());
        if (securityTokenList.size() >= 5) {
            return securityTokenList.subList(0,5);
        }
        return securityTokenList;
    }

    /**
     * get last 5 Security Token added.
     *
     * @return securityTokens list.
     */
    @Override
    public List<SecurityToken> getLastSTOAdded() {
        List<SecurityToken> securityTokenList = securityTokenRepository.findLast();
        return securityTokenList;
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
        authentication = getAuth();
        if (currentUserIsAdmin()) {
            return securityTokenSearchRepository.search(queryStringQuery(query), pageable);
        }
        if (currentUserIsBank()) {
            List<SecurityToken> securityTokenList = IteratorUtils.toList(securityTokenSearchRepository.search(
                QueryBuilders
                    .boolQuery()
                    .must(queryStringQuery(query))
                    .must(matchQuery("status", STSTATUS.ACTIVE.name()))
            ).iterator());
            return convertListToPage(securityTokenList, pageable);
        }
        Long userId = this.userService.getUserWithAuthoritiesByLogin(authentication.getName()).get().getId();
        List<SecurityToken> securityTokenList =  this.searchForWhiteListing(query, userId);
        return convertListToPage(securityTokenList, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SecurityToken> searchForWhiteListing(String query, Long userId) {
        log.debug("Request to search security tokens for query {} for whiteListing autocomplete", query);
        if (userId == null) {
            List<SecurityToken> securityTokenList = IteratorUtils.toList(securityTokenSearchRepository.search(queryStringQuery(query+"*").field("name"))
                .iterator())
                .stream()
                .filter(st -> st.getStatus().equals(STSTATUS.ACTIVE))
                .collect(Collectors.toList());
            return securityTokenList;
        }
        User user = this.userService.getUserWithAuthorities(userId).get();
        List<Long> securityTokensWhitelisted = IteratorUtils.toList(this.whiteListingSearchRepository.search(QueryBuilders.boolQuery()
            .must(matchQuery("user.id", userId))).iterator())
            .stream()
            .filter(wl -> wl.isActive())
            .map(wl -> wl.getSecuritytoken().getId())
            .collect(Collectors.toList());

        List<SecurityToken> securityTokenList = IteratorUtils.toList(securityTokenSearchRepository.search(queryStringQuery(query+"*").field("name"))
            .iterator())
            .stream()
            .filter(st -> {
                if (Optional.ofNullable(user.getSetting()).isPresent()) {
                    return
                        !securityTokensWhitelisted.contains(st.getId()) &&
                        !Stream.of(st.getRestrictionNationality().trim().split("\\s*;\\s*")).collect(Collectors.toList()).contains(user.getSetting().getNationality().name()) &&
                        !Stream.of(st.getRestrictionCounty().trim().split("\\s*;\\s*")).collect(Collectors.toList()).contains(user.getSetting().getCountry().name()) &&
                        st.getStatus().equals(STSTATUS.ACTIVE);
                }
                return false;
            }
            )
            .collect(Collectors.toList());

        return securityTokenList;
    }

    private Authentication getAuth() {
        Authentication newAuthentication = SecurityContextHolder.getContext().getAuthentication();
        if (newAuthentication != null) {
            return newAuthentication;
        }
        return this.authentication;
    }

    private boolean currentUserIsAdmin() {
        authentication = getAuth();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN)) {
                return true;
            }
        }
        return false;
    }

    private boolean currentUserIsBank() {
        authentication = getAuth();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.BANK)) {
                return true;
            }
        }
        return false;
    }

    private Page<SecurityToken> convertListToPage(List<SecurityToken> securityTokenList, Pageable pageable) {
        Page<SecurityToken> securityTokensPage = new PageImpl<SecurityToken>(
            securityTokenList,
            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()),
            securityTokenList.size());
        return securityTokensPage;
    }

    private List<SecurityToken> getSecurityTokensForUserWhiteList() {
        List<SecurityToken> securityTokenList = IteratorUtils.toList(this.whiteListingRepository.findByUserIsCurrentUser().iterator())
            .stream()
            .filter(wl -> wl.getSecuritytoken().getStatus().equals(STSTATUS.ACTIVE) && wl.isActive())
            .map(wl -> wl.getSecuritytoken())
            .collect(Collectors.toList());

        return securityTokenList;
    }
}
