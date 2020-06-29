package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.ExchangeApp;
import swiss.alpinetech.exchange.domain.Transaction;
import swiss.alpinetech.exchange.repository.TransactionRepository;
import swiss.alpinetech.exchange.repository.search.TransactionSearchRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.TransactionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

import static swiss.alpinetech.exchange.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import swiss.alpinetech.exchange.domain.enumeration.ORDERTYPE;
import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;
/**
 * Integration tests for the {@link TransactionResource} REST controller.
 */
@SpringBootTest(classes = ExchangeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser(authorities = {AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.BANK})
public class TransactionResourceIT {

    private static final String DEFAULT_ID_TX = "AAAAAAAAAA";
    private static final String UPDATED_ID_TX = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CLOSE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CLOSE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_SECURITY_TOKEN_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SECURITY_TOKEN_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_SYMBOL = "AAAAAAAAAA";
    private static final String UPDATED_SYMBOL = "BBBBBBBBBB";

    private static final ORDERTYPE DEFAULT_LIMIT_OR_MARKET = ORDERTYPE.LIMIT;
    private static final ORDERTYPE UPDATED_LIMIT_OR_MARKET = ORDERTYPE.MARKET;

    private static final Double DEFAULT_VOLUME = 0D;
    private static final Double UPDATED_VOLUME = 1D;

    private static final Double DEFAULT_PRICE = 0D;
    private static final Double UPDATED_PRICE = 1D;

    private static final Double DEFAULT_TOTAL_AMOUNT = 0D;
    private static final Double UPDATED_TOTAL_AMOUNT = 1D;

    private static final CATEGORY DEFAULT_CATEGORY_TOKEN = CATEGORY.EQUITY;
    private static final CATEGORY UPDATED_CATEGORY_TOKEN = CATEGORY.FUNDS;

    private static final STATUS DEFAULT_STATUS = STATUS.NONE;
    private static final STATUS UPDATED_STATUS = STATUS.INIT;

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final Long DEFAULT_FEE_TRANSACTION = 1L;
    private static final Long UPDATED_FEE_TRANSACTION = 2L;

    private static final String DEFAULT_NUM_BLOCKCHAIN_TX = "AAAAAAAAAA";
    private static final String UPDATED_NUM_BLOCKCHAIN_TX = "BBBBBBBBBB";

    private static final String DEFAULT_NUM_BANK_TX = "AAAAAAAAAA";
    private static final String UPDATED_NUM_BANK_TX = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CONF_BLK_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CONF_BLK_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_CONF_BANK_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CONF_BANK_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_SELLER_BLK_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_SELLER_BLK_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_BUYER_BLK_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_BUYER_BLK_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_BUYER_IBAN = "AAAAAAAAAA";
    private static final String UPDATED_BUYER_IBAN = "BBBBBBBBBB";

    private static final String DEFAULT_SELLER_IBAN = "AAAAAAAAAA";
    private static final String UPDATED_SELLER_IBAN = "BBBBBBBBBB";

    private static final Long DEFAULT_BUYERID = 1L;
    private static final Long UPDATED_BUYERID = 2L;

    private static final Long DEFAULT_SELLERID = 1L;
    private static final Long UPDATED_SELLERID = 2L;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private TransactionService transactionService;

    /**
     * This repository is mocked in the swiss.alpinetech.exchange.repository.search test package.
     *
     * @see swiss.alpinetech.exchange.repository.search.TransactionSearchRepositoryMockConfiguration
     */
    @Autowired
    private TransactionSearchRepository mockTransactionSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTransactionMockMvc;

    private Transaction transaction;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transaction createEntity(EntityManager em) {
        Transaction transaction = new Transaction()
            .idTx(DEFAULT_ID_TX)
            .createDate(DEFAULT_CREATE_DATE)
            .updateDate(DEFAULT_UPDATE_DATE)
            .closeDate(DEFAULT_CLOSE_DATE)
            .securityTokenName(DEFAULT_SECURITY_TOKEN_NAME)
            .symbol(DEFAULT_SYMBOL)
            .limitOrMarket(DEFAULT_LIMIT_OR_MARKET)
            .volume(DEFAULT_VOLUME)
            .price(DEFAULT_PRICE)
            .totalAmount(DEFAULT_TOTAL_AMOUNT)
            .categoryToken(DEFAULT_CATEGORY_TOKEN)
            .status(DEFAULT_STATUS)
            .active(DEFAULT_ACTIVE)
            .feeTransaction(DEFAULT_FEE_TRANSACTION)
            .numBlockchainTx(DEFAULT_NUM_BLOCKCHAIN_TX)
            .numBankTx(DEFAULT_NUM_BANK_TX)
            .confBlkDate(DEFAULT_CONF_BLK_DATE)
            .confBankDate(DEFAULT_CONF_BANK_DATE)
            .sellerBlkAddress(DEFAULT_SELLER_BLK_ADDRESS)
            .buyerBlkAddress(DEFAULT_BUYER_BLK_ADDRESS)
            .buyerIban(DEFAULT_BUYER_IBAN)
            .sellerIban(DEFAULT_SELLER_IBAN)
            .buyerid(DEFAULT_BUYERID)
            .sellerid(DEFAULT_SELLERID);
        return transaction;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Transaction createUpdatedEntity(EntityManager em) {
        Transaction transaction = new Transaction()
            .idTx(UPDATED_ID_TX)
            .createDate(UPDATED_CREATE_DATE)
            .updateDate(UPDATED_UPDATE_DATE)
            .closeDate(UPDATED_CLOSE_DATE)
            .securityTokenName(UPDATED_SECURITY_TOKEN_NAME)
            .symbol(UPDATED_SYMBOL)
            .limitOrMarket(UPDATED_LIMIT_OR_MARKET)
            .volume(UPDATED_VOLUME)
            .price(UPDATED_PRICE)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .categoryToken(UPDATED_CATEGORY_TOKEN)
            .status(UPDATED_STATUS)
            .active(UPDATED_ACTIVE)
            .feeTransaction(UPDATED_FEE_TRANSACTION)
            .numBlockchainTx(UPDATED_NUM_BLOCKCHAIN_TX)
            .numBankTx(UPDATED_NUM_BANK_TX)
            .confBlkDate(UPDATED_CONF_BLK_DATE)
            .confBankDate(UPDATED_CONF_BANK_DATE)
            .sellerBlkAddress(UPDATED_SELLER_BLK_ADDRESS)
            .buyerBlkAddress(UPDATED_BUYER_BLK_ADDRESS)
            .buyerIban(UPDATED_BUYER_IBAN)
            .sellerIban(UPDATED_SELLER_IBAN)
            .buyerid(UPDATED_BUYERID)
            .sellerid(UPDATED_SELLERID);
        return transaction;
    }

    @BeforeEach
    public void initTest() {
        transaction = createEntity(em);
    }

    @Test
    @Transactional
    public void createTransaction() throws Exception {
        int databaseSizeBeforeCreate = transactionRepository.findAll().size();

        // Create the Transaction
        restTransactionMockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isCreated());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeCreate + 1);
        Transaction testTransaction = transactionList.get(transactionList.size() - 1);
        assertThat(testTransaction.getIdTx()).isEqualTo(DEFAULT_ID_TX);
        assertThat(testTransaction.getCreateDate()).isEqualTo(DEFAULT_CREATE_DATE);
        assertThat(testTransaction.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testTransaction.getCloseDate()).isEqualTo(DEFAULT_CLOSE_DATE);
        assertThat(testTransaction.getSecurityTokenName()).isEqualTo(DEFAULT_SECURITY_TOKEN_NAME);
        assertThat(testTransaction.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
        assertThat(testTransaction.getLimitOrMarket()).isEqualTo(DEFAULT_LIMIT_OR_MARKET);
        assertThat(testTransaction.getVolume()).isEqualTo(DEFAULT_VOLUME);
        assertThat(testTransaction.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testTransaction.getTotalAmount()).isEqualTo(DEFAULT_TOTAL_AMOUNT);
        assertThat(testTransaction.getCategoryToken()).isEqualTo(DEFAULT_CATEGORY_TOKEN);
        assertThat(testTransaction.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testTransaction.isActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testTransaction.getFeeTransaction()).isEqualTo(DEFAULT_FEE_TRANSACTION);
        assertThat(testTransaction.getNumBlockchainTx()).isEqualTo(DEFAULT_NUM_BLOCKCHAIN_TX);
        assertThat(testTransaction.getNumBankTx()).isEqualTo(DEFAULT_NUM_BANK_TX);
        assertThat(testTransaction.getConfBlkDate()).isEqualTo(DEFAULT_CONF_BLK_DATE);
        assertThat(testTransaction.getConfBankDate()).isEqualTo(DEFAULT_CONF_BANK_DATE);
        assertThat(testTransaction.getSellerBlkAddress()).isEqualTo(DEFAULT_SELLER_BLK_ADDRESS);
        assertThat(testTransaction.getBuyerBlkAddress()).isEqualTo(DEFAULT_BUYER_BLK_ADDRESS);
        assertThat(testTransaction.getBuyerIban()).isEqualTo(DEFAULT_BUYER_IBAN);
        assertThat(testTransaction.getSellerIban()).isEqualTo(DEFAULT_SELLER_IBAN);
        assertThat(testTransaction.getBuyerid()).isEqualTo(DEFAULT_BUYERID);
        assertThat(testTransaction.getSellerid()).isEqualTo(DEFAULT_SELLERID);

        // Validate the Transaction in Elasticsearch
        verify(mockTransactionSearchRepository, times(1)).save(testTransaction);
    }

    @Test
    @Transactional
    public void createTransactionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = transactionRepository.findAll().size();

        // Create the Transaction with an existing ID
        transaction.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTransactionMockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isBadRequest());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeCreate);

        // Validate the Transaction in Elasticsearch
        verify(mockTransactionSearchRepository, times(0)).save(transaction);
    }


    @Test
    @Transactional
    public void checkIdTxIsRequired() throws Exception {
        int databaseSizeBeforeTest = transactionRepository.findAll().size();
        // set the field null
        transaction.setIdTx(null);

        // Create the Transaction, which fails.

        restTransactionMockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isBadRequest());

        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreateDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = transactionRepository.findAll().size();
        // set the field null
        transaction.setCreateDate(null);

        // Create the Transaction, which fails.

        restTransactionMockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isBadRequest());

        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSecurityTokenNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = transactionRepository.findAll().size();
        // set the field null
        transaction.setSecurityTokenName(null);

        // Create the Transaction, which fails.

        restTransactionMockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isBadRequest());

        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSymbolIsRequired() throws Exception {
        int databaseSizeBeforeTest = transactionRepository.findAll().size();
        // set the field null
        transaction.setSymbol(null);

        // Create the Transaction, which fails.

        restTransactionMockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isBadRequest());

        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkVolumeIsRequired() throws Exception {
        int databaseSizeBeforeTest = transactionRepository.findAll().size();
        // set the field null
        transaction.setVolume(null);

        // Create the Transaction, which fails.

        restTransactionMockMvc.perform(post("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isBadRequest());

        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTransactions() throws Exception {
        // Initialize the database
        transactionRepository.saveAndFlush(transaction);

        // Get all the transactionList
        restTransactionMockMvc.perform(get("/api/transactions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transaction.getId().intValue())))
            .andExpect(jsonPath("$.[*].idTx").value(hasItem(DEFAULT_ID_TX)))
            .andExpect(jsonPath("$.[*].createDate").value(hasItem(sameInstant(DEFAULT_CREATE_DATE))))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(sameInstant(DEFAULT_UPDATE_DATE))))
            .andExpect(jsonPath("$.[*].closeDate").value(hasItem(sameInstant(DEFAULT_CLOSE_DATE))))
            .andExpect(jsonPath("$.[*].securityTokenName").value(hasItem(DEFAULT_SECURITY_TOKEN_NAME)))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].limitOrMarket").value(hasItem(DEFAULT_LIMIT_OR_MARKET.toString())))
            .andExpect(jsonPath("$.[*].volume").value(hasItem(DEFAULT_VOLUME.doubleValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].totalAmount").value(hasItem(DEFAULT_TOTAL_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].categoryToken").value(hasItem(DEFAULT_CATEGORY_TOKEN.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].feeTransaction").value(hasItem(DEFAULT_FEE_TRANSACTION.intValue())))
            .andExpect(jsonPath("$.[*].numBlockchainTx").value(hasItem(DEFAULT_NUM_BLOCKCHAIN_TX)))
            .andExpect(jsonPath("$.[*].numBankTx").value(hasItem(DEFAULT_NUM_BANK_TX)))
            .andExpect(jsonPath("$.[*].confBlkDate").value(hasItem(sameInstant(DEFAULT_CONF_BLK_DATE))))
            .andExpect(jsonPath("$.[*].confBankDate").value(hasItem(sameInstant(DEFAULT_CONF_BANK_DATE))))
            .andExpect(jsonPath("$.[*].sellerBlkAddress").value(hasItem(DEFAULT_SELLER_BLK_ADDRESS)))
            .andExpect(jsonPath("$.[*].buyerBlkAddress").value(hasItem(DEFAULT_BUYER_BLK_ADDRESS)))
            .andExpect(jsonPath("$.[*].buyerIban").value(hasItem(DEFAULT_BUYER_IBAN)))
            .andExpect(jsonPath("$.[*].sellerIban").value(hasItem(DEFAULT_SELLER_IBAN)))
            .andExpect(jsonPath("$.[*].buyerid").value(hasItem(DEFAULT_BUYERID.intValue())))
            .andExpect(jsonPath("$.[*].sellerid").value(hasItem(DEFAULT_SELLERID.intValue())));
    }

    @Test
    @Transactional
    public void getTransaction() throws Exception {
        // Initialize the database
        transactionRepository.saveAndFlush(transaction);

        // Get the transaction
        restTransactionMockMvc.perform(get("/api/transactions/{id}", transaction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(transaction.getId().intValue()))
            .andExpect(jsonPath("$.idTx").value(DEFAULT_ID_TX))
            .andExpect(jsonPath("$.createDate").value(sameInstant(DEFAULT_CREATE_DATE)))
            .andExpect(jsonPath("$.updateDate").value(sameInstant(DEFAULT_UPDATE_DATE)))
            .andExpect(jsonPath("$.closeDate").value(sameInstant(DEFAULT_CLOSE_DATE)))
            .andExpect(jsonPath("$.securityTokenName").value(DEFAULT_SECURITY_TOKEN_NAME))
            .andExpect(jsonPath("$.symbol").value(DEFAULT_SYMBOL))
            .andExpect(jsonPath("$.limitOrMarket").value(DEFAULT_LIMIT_OR_MARKET.toString()))
            .andExpect(jsonPath("$.volume").value(DEFAULT_VOLUME.doubleValue()))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE.doubleValue()))
            .andExpect(jsonPath("$.totalAmount").value(DEFAULT_TOTAL_AMOUNT.doubleValue()))
            .andExpect(jsonPath("$.categoryToken").value(DEFAULT_CATEGORY_TOKEN.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.feeTransaction").value(DEFAULT_FEE_TRANSACTION.intValue()))
            .andExpect(jsonPath("$.numBlockchainTx").value(DEFAULT_NUM_BLOCKCHAIN_TX))
            .andExpect(jsonPath("$.numBankTx").value(DEFAULT_NUM_BANK_TX))
            .andExpect(jsonPath("$.confBlkDate").value(sameInstant(DEFAULT_CONF_BLK_DATE)))
            .andExpect(jsonPath("$.confBankDate").value(sameInstant(DEFAULT_CONF_BANK_DATE)))
            .andExpect(jsonPath("$.sellerBlkAddress").value(DEFAULT_SELLER_BLK_ADDRESS))
            .andExpect(jsonPath("$.buyerBlkAddress").value(DEFAULT_BUYER_BLK_ADDRESS))
            .andExpect(jsonPath("$.buyerIban").value(DEFAULT_BUYER_IBAN))
            .andExpect(jsonPath("$.sellerIban").value(DEFAULT_SELLER_IBAN))
            .andExpect(jsonPath("$.buyerid").value(DEFAULT_BUYERID.intValue()))
            .andExpect(jsonPath("$.sellerid").value(DEFAULT_SELLERID.intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingTransaction() throws Exception {
        // Get the transaction
        restTransactionMockMvc.perform(get("/api/transactions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTransaction() throws Exception {
        // Initialize the database
        transactionService.save(transaction);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockTransactionSearchRepository);

        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();

        // Update the transaction
        Transaction updatedTransaction = transactionRepository.findById(transaction.getId()).get();
        // Disconnect from session so that the updates on updatedTransaction are not directly saved in db
        em.detach(updatedTransaction);
        updatedTransaction
            .idTx(UPDATED_ID_TX)
            .createDate(UPDATED_CREATE_DATE)
            .updateDate(UPDATED_UPDATE_DATE)
            .closeDate(UPDATED_CLOSE_DATE)
            .securityTokenName(UPDATED_SECURITY_TOKEN_NAME)
            .symbol(UPDATED_SYMBOL)
            .limitOrMarket(UPDATED_LIMIT_OR_MARKET)
            .volume(UPDATED_VOLUME)
            .price(UPDATED_PRICE)
            .totalAmount(UPDATED_TOTAL_AMOUNT)
            .categoryToken(UPDATED_CATEGORY_TOKEN)
            .status(UPDATED_STATUS)
            .active(UPDATED_ACTIVE)
            .feeTransaction(UPDATED_FEE_TRANSACTION)
            .numBlockchainTx(UPDATED_NUM_BLOCKCHAIN_TX)
            .numBankTx(UPDATED_NUM_BANK_TX)
            .confBlkDate(UPDATED_CONF_BLK_DATE)
            .confBankDate(UPDATED_CONF_BANK_DATE)
            .sellerBlkAddress(UPDATED_SELLER_BLK_ADDRESS)
            .buyerBlkAddress(UPDATED_BUYER_BLK_ADDRESS)
            .buyerIban(UPDATED_BUYER_IBAN)
            .sellerIban(UPDATED_SELLER_IBAN)
            .buyerid(UPDATED_BUYERID)
            .sellerid(UPDATED_SELLERID);

        restTransactionMockMvc.perform(put("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTransaction)))
            .andExpect(status().isOk());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);
        Transaction testTransaction = transactionList.get(transactionList.size() - 1);
        assertThat(testTransaction.getIdTx()).isEqualTo(UPDATED_ID_TX);
        assertThat(testTransaction.getCreateDate()).isEqualTo(UPDATED_CREATE_DATE);
        assertThat(testTransaction.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testTransaction.getCloseDate()).isEqualTo(UPDATED_CLOSE_DATE);
        assertThat(testTransaction.getSecurityTokenName()).isEqualTo(UPDATED_SECURITY_TOKEN_NAME);
        assertThat(testTransaction.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testTransaction.getLimitOrMarket()).isEqualTo(UPDATED_LIMIT_OR_MARKET);
        assertThat(testTransaction.getVolume()).isEqualTo(UPDATED_VOLUME);
        assertThat(testTransaction.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testTransaction.getTotalAmount()).isEqualTo(UPDATED_TOTAL_AMOUNT);
        assertThat(testTransaction.getCategoryToken()).isEqualTo(UPDATED_CATEGORY_TOKEN);
        assertThat(testTransaction.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testTransaction.isActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testTransaction.getFeeTransaction()).isEqualTo(UPDATED_FEE_TRANSACTION);
        assertThat(testTransaction.getNumBlockchainTx()).isEqualTo(UPDATED_NUM_BLOCKCHAIN_TX);
        assertThat(testTransaction.getNumBankTx()).isEqualTo(UPDATED_NUM_BANK_TX);
        assertThat(testTransaction.getConfBlkDate()).isEqualTo(UPDATED_CONF_BLK_DATE);
        assertThat(testTransaction.getConfBankDate()).isEqualTo(UPDATED_CONF_BANK_DATE);
        assertThat(testTransaction.getSellerBlkAddress()).isEqualTo(UPDATED_SELLER_BLK_ADDRESS);
        assertThat(testTransaction.getBuyerBlkAddress()).isEqualTo(UPDATED_BUYER_BLK_ADDRESS);
        assertThat(testTransaction.getBuyerIban()).isEqualTo(UPDATED_BUYER_IBAN);
        assertThat(testTransaction.getSellerIban()).isEqualTo(UPDATED_SELLER_IBAN);
        assertThat(testTransaction.getBuyerid()).isEqualTo(UPDATED_BUYERID);
        assertThat(testTransaction.getSellerid()).isEqualTo(UPDATED_SELLERID);

        // Validate the Transaction in Elasticsearch
        verify(mockTransactionSearchRepository, times(1)).save(testTransaction);
    }

    @Test
    @Transactional
    public void updateNonExistingTransaction() throws Exception {
        int databaseSizeBeforeUpdate = transactionRepository.findAll().size();

        // Create the Transaction

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTransactionMockMvc.perform(put("/api/transactions")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(transaction)))
            .andExpect(status().isBadRequest());

        // Validate the Transaction in the database
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Transaction in Elasticsearch
        verify(mockTransactionSearchRepository, times(0)).save(transaction);
    }

    @Test
    @Transactional
    public void deleteTransaction() throws Exception {
        // Initialize the database
        transactionService.save(transaction);

        int databaseSizeBeforeDelete = transactionRepository.findAll().size();

        // Delete the transaction
        restTransactionMockMvc.perform(delete("/api/transactions/{id}", transaction.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Transaction> transactionList = transactionRepository.findAll();
        assertThat(transactionList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Transaction in Elasticsearch
        verify(mockTransactionSearchRepository, times(1)).deleteById(transaction.getId());
    }

    @Test
    @Transactional
    public void searchTransaction() throws Exception {
        // Initialize the database
        transactionService.save(transaction);
        when(mockTransactionSearchRepository.search(queryStringQuery("id:" + transaction.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(transaction), PageRequest.of(0, 1), 1));
        // Search the transaction
        restTransactionMockMvc.perform(get("/api/_search/transactions?query=id:" + transaction.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(transaction.getId().intValue())))
            .andExpect(jsonPath("$.[*].idTx").value(hasItem(DEFAULT_ID_TX)))
            .andExpect(jsonPath("$.[*].createDate").value(hasItem(sameInstant(DEFAULT_CREATE_DATE))))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(sameInstant(DEFAULT_UPDATE_DATE))))
            .andExpect(jsonPath("$.[*].closeDate").value(hasItem(sameInstant(DEFAULT_CLOSE_DATE))))
            .andExpect(jsonPath("$.[*].securityTokenName").value(hasItem(DEFAULT_SECURITY_TOKEN_NAME)))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].limitOrMarket").value(hasItem(DEFAULT_LIMIT_OR_MARKET.toString())))
            .andExpect(jsonPath("$.[*].volume").value(hasItem(DEFAULT_VOLUME.doubleValue())))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].totalAmount").value(hasItem(DEFAULT_TOTAL_AMOUNT.doubleValue())))
            .andExpect(jsonPath("$.[*].categoryToken").value(hasItem(DEFAULT_CATEGORY_TOKEN.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].feeTransaction").value(hasItem(DEFAULT_FEE_TRANSACTION.intValue())))
            .andExpect(jsonPath("$.[*].numBlockchainTx").value(hasItem(DEFAULT_NUM_BLOCKCHAIN_TX)))
            .andExpect(jsonPath("$.[*].numBankTx").value(hasItem(DEFAULT_NUM_BANK_TX)))
            .andExpect(jsonPath("$.[*].confBlkDate").value(hasItem(sameInstant(DEFAULT_CONF_BLK_DATE))))
            .andExpect(jsonPath("$.[*].confBankDate").value(hasItem(sameInstant(DEFAULT_CONF_BANK_DATE))))
            .andExpect(jsonPath("$.[*].sellerBlkAddress").value(hasItem(DEFAULT_SELLER_BLK_ADDRESS)))
            .andExpect(jsonPath("$.[*].buyerBlkAddress").value(hasItem(DEFAULT_BUYER_BLK_ADDRESS)))
            .andExpect(jsonPath("$.[*].buyerIban").value(hasItem(DEFAULT_BUYER_IBAN)))
            .andExpect(jsonPath("$.[*].sellerIban").value(hasItem(DEFAULT_SELLER_IBAN)))
            .andExpect(jsonPath("$.[*].buyerid").value(hasItem(DEFAULT_BUYERID.intValue())))
            .andExpect(jsonPath("$.[*].sellerid").value(hasItem(DEFAULT_SELLERID.intValue())));
    }
}
