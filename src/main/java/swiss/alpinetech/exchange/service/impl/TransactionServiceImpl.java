package swiss.alpinetech.exchange.service.impl;

import org.apache.commons.collections4.IteratorUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.User;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;
import swiss.alpinetech.exchange.repository.UserRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.BankInfoService;
import swiss.alpinetech.exchange.service.TransactionService;
import swiss.alpinetech.exchange.domain.Transaction;
import swiss.alpinetech.exchange.repository.TransactionRepository;
import swiss.alpinetech.exchange.repository.search.TransactionSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swiss.alpinetech.exchange.service.dto.TransactionPriceDTO;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Transaction}.
 */
@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final Logger log = LoggerFactory.getLogger(TransactionServiceImpl.class);

    private final TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BankInfoService bankInfoService;

    private final TransactionSearchRepository transactionSearchRepository;

    public TransactionServiceImpl(TransactionRepository transactionRepository, TransactionSearchRepository transactionSearchRepository) {
        this.transactionRepository = transactionRepository;
        this.transactionSearchRepository = transactionSearchRepository;
    }

    /**
     * Save a transaction.
     *
     * @param transaction the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Transaction save(Transaction transaction) {
        log.debug("Request to save Transaction : {}", transaction);
        Transaction result = transactionRepository.save(transaction);
        transactionSearchRepository.save(result);
        return result;
    }

    @Override
    public Transaction createBuyTransaction(Transaction transaction, Order buyOrder, Order sellOrder) {
        log.debug("Request to create buy Transaction : {}", transaction);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String formattedString = ZonedDateTime.now().format(formatter);
        transaction.setIdTx(formattedString);
        transaction.setCreateDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setUpdateDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setCloseDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setSecurityTokenName(buyOrder.getSecurityToken().getName());
        transaction.setSymbol(buyOrder.getSecurityToken().getSymbol());
        transaction.setLimitOrMarket(buyOrder.getLimitOrMarket());
        transaction.setVolume(buyOrder.getVolume());
        transaction.setPrice(buyOrder.getPrice());
        transaction.setTotalAmount(buyOrder.getTotalAmount());
        transaction.setCategoryToken(buyOrder.getCategoryToken());
        transaction.setStatus(STATUS.SUCCESS);
        transaction.setActive(true);
        transaction.setConfBlkDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setConfBankDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setBuyerBlkAddress(buyOrder.getUser().getSetting().getEthAddress());
        transaction.setSellerBlkAddress(sellOrder.getUser().getSetting().getEthAddress());
        transaction.setBuyerIban(buyOrder.getUser().getSetting().getIban());
        transaction.setSellerIban(sellOrder.getUser().getSetting().getIban());
        transaction.setBuyerid(buyOrder.getUser().getId());
        transaction.setSellerid(sellOrder.getUser().getId());
        transaction.setBuyOrderId(buyOrder.getId());
        transaction.setSellOrderId(sellOrder.getId());
        transaction.setBuyerName(buyOrder.getUser().getLastName()+" "+buyOrder.getUser().getFirstName());
        transaction.setSellerName(sellOrder.getUser().getLastName()+" "+sellOrder.getUser().getFirstName());
        transaction.setFeeTransaction(this.calculateFeeTransaction(transaction));
        transaction.setNumBankTx("XXXXXXXXXX");
        transaction.setNumBlockchainTx("XXXXXXXXXX");
        Transaction result = transactionRepository.save(transaction);
        transactionSearchRepository.save(result);
        return result;
    }

    @Override
    public Transaction createSellTransaction(Transaction transaction, Order buyOrder, Order sellOrder) {
        log.debug("Request to create sell Transaction : {}", transaction);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String formattedString = ZonedDateTime.now().format(formatter);
        transaction.setIdTx(formattedString);
        transaction.setCreateDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setUpdateDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setCloseDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setSecurityTokenName(sellOrder.getSecurityToken().getName());
        transaction.setSymbol(sellOrder.getSecurityToken().getSymbol());
        transaction.setLimitOrMarket(sellOrder.getLimitOrMarket());
        transaction.setVolume(sellOrder.getVolume());
        transaction.setPrice(sellOrder.getPrice());
        transaction.setTotalAmount(sellOrder.getTotalAmount());
        transaction.setCategoryToken(sellOrder.getCategoryToken());
        transaction.setStatus(STATUS.SUCCESS);
        transaction.setActive(true);
        transaction.setConfBlkDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setConfBankDate(ZonedDateTime.now(ZoneId.systemDefault()).withNano(0));
        transaction.setBuyerBlkAddress(buyOrder.getUser().getSetting().getEthAddress());
        transaction.setSellerBlkAddress(sellOrder.getUser().getSetting().getEthAddress());
        transaction.setBuyerIban(buyOrder.getUser().getSetting().getIban());
        transaction.setSellerIban(sellOrder.getUser().getSetting().getIban());
        transaction.setBuyerid(buyOrder.getUser().getId());
        transaction.setSellerid(sellOrder.getUser().getId());
        transaction.setBuyOrderId(buyOrder.getId());
        transaction.setSellOrderId(sellOrder.getId());
        transaction.setBuyerName(buyOrder.getUser().getLastName()+" "+buyOrder.getUser().getFirstName());
        transaction.setSellerName(sellOrder.getUser().getLastName()+" "+sellOrder.getUser().getFirstName());
        transaction.setFeeTransaction(this.calculateFeeTransaction(transaction));
        transaction.setNumBankTx("XXXXXXXXXX");
        transaction.setNumBlockchainTx("XXXXXXXXXX");
        Transaction result = transactionRepository.save(transaction);
        transactionSearchRepository.save(result);
        return result;
    }

    private Long calculateFeeTransaction(Transaction transaction) {
        return Double.valueOf(this.bankInfoService.getFirstBankInfo().get().getFixedFee()
            + this.bankInfoService.getFirstBankInfo().get().getPercentFee() * transaction.getTotalAmount()).longValue();
    }

    /**
     * Get all the transactions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Transaction> findAll(Pageable pageable) {
        log.debug("Request to get all Transactions");
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN) || authority.getAuthority().equals(AuthoritiesConstants.BANK)) {
                return transactionRepository.findAll(pageable);
            }
        }
        User user = this.userRepository.findOneByLogin(authentication.getName()).get();
        List<Transaction> transactionList = IteratorUtils.toList(transactionRepository.findAllByUser(user.getId(), pageable).iterator())
            .stream()
            .map(item -> transactionByUserType(item, user))
            .collect(Collectors.toList());
        Page<Transaction> transactionsPage = new PageImpl<Transaction>(
            transactionList,
            PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), pageable.getSort()),
            transactionList.size());
        return transactionsPage;
    }

    /**
     * Get all the transactions.
     *
     * @param securityTokenName the security token name.
     * @param startDate the start created date.
     * @param endDate the end created date.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<TransactionPriceDTO> findBySecurityTokenBetweenDate(String securityTokenName, ZonedDateTime startDate, ZonedDateTime endDate) {
        log.debug("Request to get all Transactions by security token name and between two created dates");
        List<TransactionPriceDTO> transactionPriceDTOS = transactionRepository.findBySecurityTokenNameAndCreateDateBetween(securityTokenName, startDate, endDate)
            .stream()
            .map(TransactionPriceDTO::new)
            .collect(Collectors.toList());
        return transactionPriceDTOS;
    }

    /**
     * Get one transaction by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Transaction> findOne(Long id) throws Exception {
        log.debug("Request to get Transaction : {}", id);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            if(authority.getAuthority().equals(AuthoritiesConstants.ADMIN) || authority.getAuthority().equals(AuthoritiesConstants.BANK)) {
                return transactionRepository.findById(id);
            }
        }
        Optional<Transaction> transaction = transactionRepository.findById(id);
        Optional<User> user = this.userRepository.findOneByLogin(authentication.getName());
        if (!user.isPresent() || !transaction.isPresent()) {
            throw new Exception("current User or Transaction could not be found");
        }
        if (transaction.get().getBuyerid().equals(user.get().getId()) || transaction.get().getSellerid().equals(user.get().getId())) {
            return Optional.of(transactionByUserType(transaction.get(), user.get()));
        }
        return Optional.empty();
    }

    private Transaction transactionByUserType(Transaction transaction, User user) {
        if (user.getId().equals(transaction.getSellerid())) {
            transaction.setBuyerBlkAddress("not authorized");
            transaction.setBuyerIban("not authorized");
            transaction.setBuyerName("not authorized");
            transaction.setBuyerid(null);
            transaction.buyOrderId(null);
        }
        if (user.getId().equals(transaction.getBuyerid())) {
            transaction.setSellerBlkAddress("not authorized");
            transaction.setSellerIban("not authorized");
            transaction.setSellerName("not authorized");
            transaction.setSellerid(null);
            transaction.sellOrderId(null);
        }
        return transaction;
    }

    /**
     * Delete the transaction by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Transaction : {}", id);
        transactionRepository.deleteById(id);
        transactionSearchRepository.deleteById(id);
    }

    /**
     * Search for the transaction corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Transaction> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Transactions for query {}", query);
        return transactionSearchRepository.search(queryStringQuery(query), pageable);    }
}
