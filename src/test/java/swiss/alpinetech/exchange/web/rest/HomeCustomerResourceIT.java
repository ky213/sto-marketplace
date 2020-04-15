package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.ExchangeApp;
import swiss.alpinetech.exchange.domain.HomeCustomer;
import swiss.alpinetech.exchange.repository.HomeCustomerRepository;
import swiss.alpinetech.exchange.repository.search.HomeCustomerSearchRepository;
import swiss.alpinetech.exchange.service.HomeCustomerService;

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

/**
 * Integration tests for the {@link HomeCustomerResource} REST controller.
 */
@SpringBootTest(classes = ExchangeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class HomeCustomerResourceIT {

    private static final ZonedDateTime DEFAULT_DATE_EVENT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_EVENT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_TOKEN_BALANCE = 1D;
    private static final Double UPDATED_TOKEN_BALANCE = 2D;

    private static final String DEFAULT_BIGEST_TOKEN_NAME = "AAAAAAAAAA";
    private static final String UPDATED_BIGEST_TOKEN_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_BIGEST_TOKEN_VALUE = 1D;
    private static final Double UPDATED_BIGEST_TOKEN_VALUE = 2D;

    private static final String DEFAULT_SECOND_TOKEN_NAME = "AAAAAAAAAA";
    private static final String UPDATED_SECOND_TOKEN_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_SECOND_TOKEN_VALUE = 1D;
    private static final Double UPDATED_SECOND_TOKEN_VALUE = 2D;

    private static final Double DEFAULT_BANK_BALANCE = 1D;
    private static final Double UPDATED_BANK_BALANCE = 2D;

    private static final Float DEFAULT_EQUITY_ALLOCATION = 1F;
    private static final Float UPDATED_EQUITY_ALLOCATION = 2F;

    private static final Float DEFAULT_FUNDS_ALLOCATION = 1F;
    private static final Float UPDATED_FUNDS_ALLOCATION = 2F;

    private static final Float DEFAULT_REAL_ESTATE_ALLOCATION = 1F;
    private static final Float UPDATED_REAL_ESTATE_ALLOCATION = 2F;

    private static final Float DEFAULT_DERIVATIVE_ALLOCATION = 1F;
    private static final Float UPDATED_DERIVATIVE_ALLOCATION = 2F;

    @Autowired
    private HomeCustomerRepository homeCustomerRepository;

    @Autowired
    private HomeCustomerService homeCustomerService;

    /**
     * This repository is mocked in the swiss.alpinetech.exchange.repository.search test package.
     *
     * @see swiss.alpinetech.exchange.repository.search.HomeCustomerSearchRepositoryMockConfiguration
     */
    @Autowired
    private HomeCustomerSearchRepository mockHomeCustomerSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHomeCustomerMockMvc;

    private HomeCustomer homeCustomer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HomeCustomer createEntity(EntityManager em) {
        HomeCustomer homeCustomer = new HomeCustomer()
            .dateEvent(DEFAULT_DATE_EVENT)
            .tokenBalance(DEFAULT_TOKEN_BALANCE)
            .bigestTokenName(DEFAULT_BIGEST_TOKEN_NAME)
            .bigestTokenValue(DEFAULT_BIGEST_TOKEN_VALUE)
            .secondTokenName(DEFAULT_SECOND_TOKEN_NAME)
            .secondTokenValue(DEFAULT_SECOND_TOKEN_VALUE)
            .bankBalance(DEFAULT_BANK_BALANCE)
            .equityAllocation(DEFAULT_EQUITY_ALLOCATION)
            .fundsAllocation(DEFAULT_FUNDS_ALLOCATION)
            .realEstateAllocation(DEFAULT_REAL_ESTATE_ALLOCATION)
            .derivativeAllocation(DEFAULT_DERIVATIVE_ALLOCATION);
        return homeCustomer;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HomeCustomer createUpdatedEntity(EntityManager em) {
        HomeCustomer homeCustomer = new HomeCustomer()
            .dateEvent(UPDATED_DATE_EVENT)
            .tokenBalance(UPDATED_TOKEN_BALANCE)
            .bigestTokenName(UPDATED_BIGEST_TOKEN_NAME)
            .bigestTokenValue(UPDATED_BIGEST_TOKEN_VALUE)
            .secondTokenName(UPDATED_SECOND_TOKEN_NAME)
            .secondTokenValue(UPDATED_SECOND_TOKEN_VALUE)
            .bankBalance(UPDATED_BANK_BALANCE)
            .equityAllocation(UPDATED_EQUITY_ALLOCATION)
            .fundsAllocation(UPDATED_FUNDS_ALLOCATION)
            .realEstateAllocation(UPDATED_REAL_ESTATE_ALLOCATION)
            .derivativeAllocation(UPDATED_DERIVATIVE_ALLOCATION);
        return homeCustomer;
    }

    @BeforeEach
    public void initTest() {
        homeCustomer = createEntity(em);
    }

    @Test
    @Transactional
    public void createHomeCustomer() throws Exception {
        int databaseSizeBeforeCreate = homeCustomerRepository.findAll().size();

        // Create the HomeCustomer
        restHomeCustomerMockMvc.perform(post("/api/home-customers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeCustomer)))
            .andExpect(status().isCreated());

        // Validate the HomeCustomer in the database
        List<HomeCustomer> homeCustomerList = homeCustomerRepository.findAll();
        assertThat(homeCustomerList).hasSize(databaseSizeBeforeCreate + 1);
        HomeCustomer testHomeCustomer = homeCustomerList.get(homeCustomerList.size() - 1);
        assertThat(testHomeCustomer.getDateEvent()).isEqualTo(DEFAULT_DATE_EVENT);
        assertThat(testHomeCustomer.getTokenBalance()).isEqualTo(DEFAULT_TOKEN_BALANCE);
        assertThat(testHomeCustomer.getBigestTokenName()).isEqualTo(DEFAULT_BIGEST_TOKEN_NAME);
        assertThat(testHomeCustomer.getBigestTokenValue()).isEqualTo(DEFAULT_BIGEST_TOKEN_VALUE);
        assertThat(testHomeCustomer.getSecondTokenName()).isEqualTo(DEFAULT_SECOND_TOKEN_NAME);
        assertThat(testHomeCustomer.getSecondTokenValue()).isEqualTo(DEFAULT_SECOND_TOKEN_VALUE);
        assertThat(testHomeCustomer.getBankBalance()).isEqualTo(DEFAULT_BANK_BALANCE);
        assertThat(testHomeCustomer.getEquityAllocation()).isEqualTo(DEFAULT_EQUITY_ALLOCATION);
        assertThat(testHomeCustomer.getFundsAllocation()).isEqualTo(DEFAULT_FUNDS_ALLOCATION);
        assertThat(testHomeCustomer.getRealEstateAllocation()).isEqualTo(DEFAULT_REAL_ESTATE_ALLOCATION);
        assertThat(testHomeCustomer.getDerivativeAllocation()).isEqualTo(DEFAULT_DERIVATIVE_ALLOCATION);

        // Validate the HomeCustomer in Elasticsearch
        verify(mockHomeCustomerSearchRepository, times(1)).save(testHomeCustomer);
    }

    @Test
    @Transactional
    public void createHomeCustomerWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = homeCustomerRepository.findAll().size();

        // Create the HomeCustomer with an existing ID
        homeCustomer.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restHomeCustomerMockMvc.perform(post("/api/home-customers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeCustomer)))
            .andExpect(status().isBadRequest());

        // Validate the HomeCustomer in the database
        List<HomeCustomer> homeCustomerList = homeCustomerRepository.findAll();
        assertThat(homeCustomerList).hasSize(databaseSizeBeforeCreate);

        // Validate the HomeCustomer in Elasticsearch
        verify(mockHomeCustomerSearchRepository, times(0)).save(homeCustomer);
    }


    @Test
    @Transactional
    public void checkDateEventIsRequired() throws Exception {
        int databaseSizeBeforeTest = homeCustomerRepository.findAll().size();
        // set the field null
        homeCustomer.setDateEvent(null);

        // Create the HomeCustomer, which fails.

        restHomeCustomerMockMvc.perform(post("/api/home-customers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeCustomer)))
            .andExpect(status().isBadRequest());

        List<HomeCustomer> homeCustomerList = homeCustomerRepository.findAll();
        assertThat(homeCustomerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTokenBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = homeCustomerRepository.findAll().size();
        // set the field null
        homeCustomer.setTokenBalance(null);

        // Create the HomeCustomer, which fails.

        restHomeCustomerMockMvc.perform(post("/api/home-customers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeCustomer)))
            .andExpect(status().isBadRequest());

        List<HomeCustomer> homeCustomerList = homeCustomerRepository.findAll();
        assertThat(homeCustomerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkBankBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = homeCustomerRepository.findAll().size();
        // set the field null
        homeCustomer.setBankBalance(null);

        // Create the HomeCustomer, which fails.

        restHomeCustomerMockMvc.perform(post("/api/home-customers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeCustomer)))
            .andExpect(status().isBadRequest());

        List<HomeCustomer> homeCustomerList = homeCustomerRepository.findAll();
        assertThat(homeCustomerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllHomeCustomers() throws Exception {
        // Initialize the database
        homeCustomerRepository.saveAndFlush(homeCustomer);

        // Get all the homeCustomerList
        restHomeCustomerMockMvc.perform(get("/api/home-customers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(homeCustomer.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateEvent").value(hasItem(sameInstant(DEFAULT_DATE_EVENT))))
            .andExpect(jsonPath("$.[*].tokenBalance").value(hasItem(DEFAULT_TOKEN_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].bigestTokenName").value(hasItem(DEFAULT_BIGEST_TOKEN_NAME)))
            .andExpect(jsonPath("$.[*].bigestTokenValue").value(hasItem(DEFAULT_BIGEST_TOKEN_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].secondTokenName").value(hasItem(DEFAULT_SECOND_TOKEN_NAME)))
            .andExpect(jsonPath("$.[*].secondTokenValue").value(hasItem(DEFAULT_SECOND_TOKEN_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].bankBalance").value(hasItem(DEFAULT_BANK_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].equityAllocation").value(hasItem(DEFAULT_EQUITY_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].fundsAllocation").value(hasItem(DEFAULT_FUNDS_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].realEstateAllocation").value(hasItem(DEFAULT_REAL_ESTATE_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].derivativeAllocation").value(hasItem(DEFAULT_DERIVATIVE_ALLOCATION.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getHomeCustomer() throws Exception {
        // Initialize the database
        homeCustomerRepository.saveAndFlush(homeCustomer);

        // Get the homeCustomer
        restHomeCustomerMockMvc.perform(get("/api/home-customers/{id}", homeCustomer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(homeCustomer.getId().intValue()))
            .andExpect(jsonPath("$.dateEvent").value(sameInstant(DEFAULT_DATE_EVENT)))
            .andExpect(jsonPath("$.tokenBalance").value(DEFAULT_TOKEN_BALANCE.doubleValue()))
            .andExpect(jsonPath("$.bigestTokenName").value(DEFAULT_BIGEST_TOKEN_NAME))
            .andExpect(jsonPath("$.bigestTokenValue").value(DEFAULT_BIGEST_TOKEN_VALUE.doubleValue()))
            .andExpect(jsonPath("$.secondTokenName").value(DEFAULT_SECOND_TOKEN_NAME))
            .andExpect(jsonPath("$.secondTokenValue").value(DEFAULT_SECOND_TOKEN_VALUE.doubleValue()))
            .andExpect(jsonPath("$.bankBalance").value(DEFAULT_BANK_BALANCE.doubleValue()))
            .andExpect(jsonPath("$.equityAllocation").value(DEFAULT_EQUITY_ALLOCATION.doubleValue()))
            .andExpect(jsonPath("$.fundsAllocation").value(DEFAULT_FUNDS_ALLOCATION.doubleValue()))
            .andExpect(jsonPath("$.realEstateAllocation").value(DEFAULT_REAL_ESTATE_ALLOCATION.doubleValue()))
            .andExpect(jsonPath("$.derivativeAllocation").value(DEFAULT_DERIVATIVE_ALLOCATION.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingHomeCustomer() throws Exception {
        // Get the homeCustomer
        restHomeCustomerMockMvc.perform(get("/api/home-customers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHomeCustomer() throws Exception {
        // Initialize the database
        homeCustomerService.save(homeCustomer);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockHomeCustomerSearchRepository);

        int databaseSizeBeforeUpdate = homeCustomerRepository.findAll().size();

        // Update the homeCustomer
        HomeCustomer updatedHomeCustomer = homeCustomerRepository.findById(homeCustomer.getId()).get();
        // Disconnect from session so that the updates on updatedHomeCustomer are not directly saved in db
        em.detach(updatedHomeCustomer);
        updatedHomeCustomer
            .dateEvent(UPDATED_DATE_EVENT)
            .tokenBalance(UPDATED_TOKEN_BALANCE)
            .bigestTokenName(UPDATED_BIGEST_TOKEN_NAME)
            .bigestTokenValue(UPDATED_BIGEST_TOKEN_VALUE)
            .secondTokenName(UPDATED_SECOND_TOKEN_NAME)
            .secondTokenValue(UPDATED_SECOND_TOKEN_VALUE)
            .bankBalance(UPDATED_BANK_BALANCE)
            .equityAllocation(UPDATED_EQUITY_ALLOCATION)
            .fundsAllocation(UPDATED_FUNDS_ALLOCATION)
            .realEstateAllocation(UPDATED_REAL_ESTATE_ALLOCATION)
            .derivativeAllocation(UPDATED_DERIVATIVE_ALLOCATION);

        restHomeCustomerMockMvc.perform(put("/api/home-customers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedHomeCustomer)))
            .andExpect(status().isOk());

        // Validate the HomeCustomer in the database
        List<HomeCustomer> homeCustomerList = homeCustomerRepository.findAll();
        assertThat(homeCustomerList).hasSize(databaseSizeBeforeUpdate);
        HomeCustomer testHomeCustomer = homeCustomerList.get(homeCustomerList.size() - 1);
        assertThat(testHomeCustomer.getDateEvent()).isEqualTo(UPDATED_DATE_EVENT);
        assertThat(testHomeCustomer.getTokenBalance()).isEqualTo(UPDATED_TOKEN_BALANCE);
        assertThat(testHomeCustomer.getBigestTokenName()).isEqualTo(UPDATED_BIGEST_TOKEN_NAME);
        assertThat(testHomeCustomer.getBigestTokenValue()).isEqualTo(UPDATED_BIGEST_TOKEN_VALUE);
        assertThat(testHomeCustomer.getSecondTokenName()).isEqualTo(UPDATED_SECOND_TOKEN_NAME);
        assertThat(testHomeCustomer.getSecondTokenValue()).isEqualTo(UPDATED_SECOND_TOKEN_VALUE);
        assertThat(testHomeCustomer.getBankBalance()).isEqualTo(UPDATED_BANK_BALANCE);
        assertThat(testHomeCustomer.getEquityAllocation()).isEqualTo(UPDATED_EQUITY_ALLOCATION);
        assertThat(testHomeCustomer.getFundsAllocation()).isEqualTo(UPDATED_FUNDS_ALLOCATION);
        assertThat(testHomeCustomer.getRealEstateAllocation()).isEqualTo(UPDATED_REAL_ESTATE_ALLOCATION);
        assertThat(testHomeCustomer.getDerivativeAllocation()).isEqualTo(UPDATED_DERIVATIVE_ALLOCATION);

        // Validate the HomeCustomer in Elasticsearch
        verify(mockHomeCustomerSearchRepository, times(1)).save(testHomeCustomer);
    }

    @Test
    @Transactional
    public void updateNonExistingHomeCustomer() throws Exception {
        int databaseSizeBeforeUpdate = homeCustomerRepository.findAll().size();

        // Create the HomeCustomer

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHomeCustomerMockMvc.perform(put("/api/home-customers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeCustomer)))
            .andExpect(status().isBadRequest());

        // Validate the HomeCustomer in the database
        List<HomeCustomer> homeCustomerList = homeCustomerRepository.findAll();
        assertThat(homeCustomerList).hasSize(databaseSizeBeforeUpdate);

        // Validate the HomeCustomer in Elasticsearch
        verify(mockHomeCustomerSearchRepository, times(0)).save(homeCustomer);
    }

    @Test
    @Transactional
    public void deleteHomeCustomer() throws Exception {
        // Initialize the database
        homeCustomerService.save(homeCustomer);

        int databaseSizeBeforeDelete = homeCustomerRepository.findAll().size();

        // Delete the homeCustomer
        restHomeCustomerMockMvc.perform(delete("/api/home-customers/{id}", homeCustomer.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HomeCustomer> homeCustomerList = homeCustomerRepository.findAll();
        assertThat(homeCustomerList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the HomeCustomer in Elasticsearch
        verify(mockHomeCustomerSearchRepository, times(1)).deleteById(homeCustomer.getId());
    }

    @Test
    @Transactional
    public void searchHomeCustomer() throws Exception {
        // Initialize the database
        homeCustomerService.save(homeCustomer);
        when(mockHomeCustomerSearchRepository.search(queryStringQuery("id:" + homeCustomer.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(homeCustomer), PageRequest.of(0, 1), 1));
        // Search the homeCustomer
        restHomeCustomerMockMvc.perform(get("/api/_search/home-customers?query=id:" + homeCustomer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(homeCustomer.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateEvent").value(hasItem(sameInstant(DEFAULT_DATE_EVENT))))
            .andExpect(jsonPath("$.[*].tokenBalance").value(hasItem(DEFAULT_TOKEN_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].bigestTokenName").value(hasItem(DEFAULT_BIGEST_TOKEN_NAME)))
            .andExpect(jsonPath("$.[*].bigestTokenValue").value(hasItem(DEFAULT_BIGEST_TOKEN_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].secondTokenName").value(hasItem(DEFAULT_SECOND_TOKEN_NAME)))
            .andExpect(jsonPath("$.[*].secondTokenValue").value(hasItem(DEFAULT_SECOND_TOKEN_VALUE.doubleValue())))
            .andExpect(jsonPath("$.[*].bankBalance").value(hasItem(DEFAULT_BANK_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].equityAllocation").value(hasItem(DEFAULT_EQUITY_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].fundsAllocation").value(hasItem(DEFAULT_FUNDS_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].realEstateAllocation").value(hasItem(DEFAULT_REAL_ESTATE_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].derivativeAllocation").value(hasItem(DEFAULT_DERIVATIVE_ALLOCATION.doubleValue())));
    }
}
