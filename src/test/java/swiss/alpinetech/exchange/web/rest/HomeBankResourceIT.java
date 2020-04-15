package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.ExchangeApp;
import swiss.alpinetech.exchange.domain.HomeBank;
import swiss.alpinetech.exchange.repository.HomeBankRepository;
import swiss.alpinetech.exchange.repository.search.HomeBankSearchRepository;
import swiss.alpinetech.exchange.service.HomeBankService;

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
 * Integration tests for the {@link HomeBankResource} REST controller.
 */
@SpringBootTest(classes = ExchangeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class HomeBankResourceIT {

    private static final ZonedDateTime DEFAULT_DATE_EVENT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_EVENT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_CUSTODY_BALANCE = 1D;
    private static final Double UPDATED_CUSTODY_BALANCE = 2D;

    private static final Integer DEFAULT_TOTAL_USER = 1;
    private static final Integer UPDATED_TOTAL_USER = 2;

    private static final Double DEFAULT_VOLUME_ORDER = 1D;
    private static final Double UPDATED_VOLUME_ORDER = 2D;

    private static final Double DEFAULT_TOTAL_REVENU = 1D;
    private static final Double UPDATED_TOTAL_REVENU = 2D;

    private static final Float DEFAULT_EQUITY_ALLOCATION = 1F;
    private static final Float UPDATED_EQUITY_ALLOCATION = 2F;

    private static final Float DEFAULT_FUNDS_ALLOCATION = 1F;
    private static final Float UPDATED_FUNDS_ALLOCATION = 2F;

    private static final Float DEFAULT_REAL_ESTATE_ALLOCATION = 1F;
    private static final Float UPDATED_REAL_ESTATE_ALLOCATION = 2F;

    private static final Float DEFAULT_DERIVATIVE_ALLOCATION = 1F;
    private static final Float UPDATED_DERIVATIVE_ALLOCATION = 2F;

    @Autowired
    private HomeBankRepository homeBankRepository;

    @Autowired
    private HomeBankService homeBankService;

    /**
     * This repository is mocked in the swiss.alpinetech.exchange.repository.search test package.
     *
     * @see swiss.alpinetech.exchange.repository.search.HomeBankSearchRepositoryMockConfiguration
     */
    @Autowired
    private HomeBankSearchRepository mockHomeBankSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHomeBankMockMvc;

    private HomeBank homeBank;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HomeBank createEntity(EntityManager em) {
        HomeBank homeBank = new HomeBank()
            .dateEvent(DEFAULT_DATE_EVENT)
            .custodyBalance(DEFAULT_CUSTODY_BALANCE)
            .totalUser(DEFAULT_TOTAL_USER)
            .volumeOrder(DEFAULT_VOLUME_ORDER)
            .totalRevenu(DEFAULT_TOTAL_REVENU)
            .equityAllocation(DEFAULT_EQUITY_ALLOCATION)
            .fundsAllocation(DEFAULT_FUNDS_ALLOCATION)
            .realEstateAllocation(DEFAULT_REAL_ESTATE_ALLOCATION)
            .derivativeAllocation(DEFAULT_DERIVATIVE_ALLOCATION);
        return homeBank;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HomeBank createUpdatedEntity(EntityManager em) {
        HomeBank homeBank = new HomeBank()
            .dateEvent(UPDATED_DATE_EVENT)
            .custodyBalance(UPDATED_CUSTODY_BALANCE)
            .totalUser(UPDATED_TOTAL_USER)
            .volumeOrder(UPDATED_VOLUME_ORDER)
            .totalRevenu(UPDATED_TOTAL_REVENU)
            .equityAllocation(UPDATED_EQUITY_ALLOCATION)
            .fundsAllocation(UPDATED_FUNDS_ALLOCATION)
            .realEstateAllocation(UPDATED_REAL_ESTATE_ALLOCATION)
            .derivativeAllocation(UPDATED_DERIVATIVE_ALLOCATION);
        return homeBank;
    }

    @BeforeEach
    public void initTest() {
        homeBank = createEntity(em);
    }

    @Test
    @Transactional
    public void createHomeBank() throws Exception {
        int databaseSizeBeforeCreate = homeBankRepository.findAll().size();

        // Create the HomeBank
        restHomeBankMockMvc.perform(post("/api/home-banks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeBank)))
            .andExpect(status().isCreated());

        // Validate the HomeBank in the database
        List<HomeBank> homeBankList = homeBankRepository.findAll();
        assertThat(homeBankList).hasSize(databaseSizeBeforeCreate + 1);
        HomeBank testHomeBank = homeBankList.get(homeBankList.size() - 1);
        assertThat(testHomeBank.getDateEvent()).isEqualTo(DEFAULT_DATE_EVENT);
        assertThat(testHomeBank.getCustodyBalance()).isEqualTo(DEFAULT_CUSTODY_BALANCE);
        assertThat(testHomeBank.getTotalUser()).isEqualTo(DEFAULT_TOTAL_USER);
        assertThat(testHomeBank.getVolumeOrder()).isEqualTo(DEFAULT_VOLUME_ORDER);
        assertThat(testHomeBank.getTotalRevenu()).isEqualTo(DEFAULT_TOTAL_REVENU);
        assertThat(testHomeBank.getEquityAllocation()).isEqualTo(DEFAULT_EQUITY_ALLOCATION);
        assertThat(testHomeBank.getFundsAllocation()).isEqualTo(DEFAULT_FUNDS_ALLOCATION);
        assertThat(testHomeBank.getRealEstateAllocation()).isEqualTo(DEFAULT_REAL_ESTATE_ALLOCATION);
        assertThat(testHomeBank.getDerivativeAllocation()).isEqualTo(DEFAULT_DERIVATIVE_ALLOCATION);

        // Validate the HomeBank in Elasticsearch
        verify(mockHomeBankSearchRepository, times(1)).save(testHomeBank);
    }

    @Test
    @Transactional
    public void createHomeBankWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = homeBankRepository.findAll().size();

        // Create the HomeBank with an existing ID
        homeBank.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restHomeBankMockMvc.perform(post("/api/home-banks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeBank)))
            .andExpect(status().isBadRequest());

        // Validate the HomeBank in the database
        List<HomeBank> homeBankList = homeBankRepository.findAll();
        assertThat(homeBankList).hasSize(databaseSizeBeforeCreate);

        // Validate the HomeBank in Elasticsearch
        verify(mockHomeBankSearchRepository, times(0)).save(homeBank);
    }


    @Test
    @Transactional
    public void checkDateEventIsRequired() throws Exception {
        int databaseSizeBeforeTest = homeBankRepository.findAll().size();
        // set the field null
        homeBank.setDateEvent(null);

        // Create the HomeBank, which fails.

        restHomeBankMockMvc.perform(post("/api/home-banks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeBank)))
            .andExpect(status().isBadRequest());

        List<HomeBank> homeBankList = homeBankRepository.findAll();
        assertThat(homeBankList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCustodyBalanceIsRequired() throws Exception {
        int databaseSizeBeforeTest = homeBankRepository.findAll().size();
        // set the field null
        homeBank.setCustodyBalance(null);

        // Create the HomeBank, which fails.

        restHomeBankMockMvc.perform(post("/api/home-banks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeBank)))
            .andExpect(status().isBadRequest());

        List<HomeBank> homeBankList = homeBankRepository.findAll();
        assertThat(homeBankList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTotalUserIsRequired() throws Exception {
        int databaseSizeBeforeTest = homeBankRepository.findAll().size();
        // set the field null
        homeBank.setTotalUser(null);

        // Create the HomeBank, which fails.

        restHomeBankMockMvc.perform(post("/api/home-banks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeBank)))
            .andExpect(status().isBadRequest());

        List<HomeBank> homeBankList = homeBankRepository.findAll();
        assertThat(homeBankList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllHomeBanks() throws Exception {
        // Initialize the database
        homeBankRepository.saveAndFlush(homeBank);

        // Get all the homeBankList
        restHomeBankMockMvc.perform(get("/api/home-banks?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(homeBank.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateEvent").value(hasItem(sameInstant(DEFAULT_DATE_EVENT))))
            .andExpect(jsonPath("$.[*].custodyBalance").value(hasItem(DEFAULT_CUSTODY_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].totalUser").value(hasItem(DEFAULT_TOTAL_USER)))
            .andExpect(jsonPath("$.[*].volumeOrder").value(hasItem(DEFAULT_VOLUME_ORDER.doubleValue())))
            .andExpect(jsonPath("$.[*].totalRevenu").value(hasItem(DEFAULT_TOTAL_REVENU.doubleValue())))
            .andExpect(jsonPath("$.[*].equityAllocation").value(hasItem(DEFAULT_EQUITY_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].fundsAllocation").value(hasItem(DEFAULT_FUNDS_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].realEstateAllocation").value(hasItem(DEFAULT_REAL_ESTATE_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].derivativeAllocation").value(hasItem(DEFAULT_DERIVATIVE_ALLOCATION.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getHomeBank() throws Exception {
        // Initialize the database
        homeBankRepository.saveAndFlush(homeBank);

        // Get the homeBank
        restHomeBankMockMvc.perform(get("/api/home-banks/{id}", homeBank.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(homeBank.getId().intValue()))
            .andExpect(jsonPath("$.dateEvent").value(sameInstant(DEFAULT_DATE_EVENT)))
            .andExpect(jsonPath("$.custodyBalance").value(DEFAULT_CUSTODY_BALANCE.doubleValue()))
            .andExpect(jsonPath("$.totalUser").value(DEFAULT_TOTAL_USER))
            .andExpect(jsonPath("$.volumeOrder").value(DEFAULT_VOLUME_ORDER.doubleValue()))
            .andExpect(jsonPath("$.totalRevenu").value(DEFAULT_TOTAL_REVENU.doubleValue()))
            .andExpect(jsonPath("$.equityAllocation").value(DEFAULT_EQUITY_ALLOCATION.doubleValue()))
            .andExpect(jsonPath("$.fundsAllocation").value(DEFAULT_FUNDS_ALLOCATION.doubleValue()))
            .andExpect(jsonPath("$.realEstateAllocation").value(DEFAULT_REAL_ESTATE_ALLOCATION.doubleValue()))
            .andExpect(jsonPath("$.derivativeAllocation").value(DEFAULT_DERIVATIVE_ALLOCATION.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingHomeBank() throws Exception {
        // Get the homeBank
        restHomeBankMockMvc.perform(get("/api/home-banks/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHomeBank() throws Exception {
        // Initialize the database
        homeBankService.save(homeBank);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockHomeBankSearchRepository);

        int databaseSizeBeforeUpdate = homeBankRepository.findAll().size();

        // Update the homeBank
        HomeBank updatedHomeBank = homeBankRepository.findById(homeBank.getId()).get();
        // Disconnect from session so that the updates on updatedHomeBank are not directly saved in db
        em.detach(updatedHomeBank);
        updatedHomeBank
            .dateEvent(UPDATED_DATE_EVENT)
            .custodyBalance(UPDATED_CUSTODY_BALANCE)
            .totalUser(UPDATED_TOTAL_USER)
            .volumeOrder(UPDATED_VOLUME_ORDER)
            .totalRevenu(UPDATED_TOTAL_REVENU)
            .equityAllocation(UPDATED_EQUITY_ALLOCATION)
            .fundsAllocation(UPDATED_FUNDS_ALLOCATION)
            .realEstateAllocation(UPDATED_REAL_ESTATE_ALLOCATION)
            .derivativeAllocation(UPDATED_DERIVATIVE_ALLOCATION);

        restHomeBankMockMvc.perform(put("/api/home-banks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedHomeBank)))
            .andExpect(status().isOk());

        // Validate the HomeBank in the database
        List<HomeBank> homeBankList = homeBankRepository.findAll();
        assertThat(homeBankList).hasSize(databaseSizeBeforeUpdate);
        HomeBank testHomeBank = homeBankList.get(homeBankList.size() - 1);
        assertThat(testHomeBank.getDateEvent()).isEqualTo(UPDATED_DATE_EVENT);
        assertThat(testHomeBank.getCustodyBalance()).isEqualTo(UPDATED_CUSTODY_BALANCE);
        assertThat(testHomeBank.getTotalUser()).isEqualTo(UPDATED_TOTAL_USER);
        assertThat(testHomeBank.getVolumeOrder()).isEqualTo(UPDATED_VOLUME_ORDER);
        assertThat(testHomeBank.getTotalRevenu()).isEqualTo(UPDATED_TOTAL_REVENU);
        assertThat(testHomeBank.getEquityAllocation()).isEqualTo(UPDATED_EQUITY_ALLOCATION);
        assertThat(testHomeBank.getFundsAllocation()).isEqualTo(UPDATED_FUNDS_ALLOCATION);
        assertThat(testHomeBank.getRealEstateAllocation()).isEqualTo(UPDATED_REAL_ESTATE_ALLOCATION);
        assertThat(testHomeBank.getDerivativeAllocation()).isEqualTo(UPDATED_DERIVATIVE_ALLOCATION);

        // Validate the HomeBank in Elasticsearch
        verify(mockHomeBankSearchRepository, times(1)).save(testHomeBank);
    }

    @Test
    @Transactional
    public void updateNonExistingHomeBank() throws Exception {
        int databaseSizeBeforeUpdate = homeBankRepository.findAll().size();

        // Create the HomeBank

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHomeBankMockMvc.perform(put("/api/home-banks")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(homeBank)))
            .andExpect(status().isBadRequest());

        // Validate the HomeBank in the database
        List<HomeBank> homeBankList = homeBankRepository.findAll();
        assertThat(homeBankList).hasSize(databaseSizeBeforeUpdate);

        // Validate the HomeBank in Elasticsearch
        verify(mockHomeBankSearchRepository, times(0)).save(homeBank);
    }

    @Test
    @Transactional
    public void deleteHomeBank() throws Exception {
        // Initialize the database
        homeBankService.save(homeBank);

        int databaseSizeBeforeDelete = homeBankRepository.findAll().size();

        // Delete the homeBank
        restHomeBankMockMvc.perform(delete("/api/home-banks/{id}", homeBank.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HomeBank> homeBankList = homeBankRepository.findAll();
        assertThat(homeBankList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the HomeBank in Elasticsearch
        verify(mockHomeBankSearchRepository, times(1)).deleteById(homeBank.getId());
    }

    @Test
    @Transactional
    public void searchHomeBank() throws Exception {
        // Initialize the database
        homeBankService.save(homeBank);
        when(mockHomeBankSearchRepository.search(queryStringQuery("id:" + homeBank.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(homeBank), PageRequest.of(0, 1), 1));
        // Search the homeBank
        restHomeBankMockMvc.perform(get("/api/_search/home-banks?query=id:" + homeBank.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(homeBank.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateEvent").value(hasItem(sameInstant(DEFAULT_DATE_EVENT))))
            .andExpect(jsonPath("$.[*].custodyBalance").value(hasItem(DEFAULT_CUSTODY_BALANCE.doubleValue())))
            .andExpect(jsonPath("$.[*].totalUser").value(hasItem(DEFAULT_TOTAL_USER)))
            .andExpect(jsonPath("$.[*].volumeOrder").value(hasItem(DEFAULT_VOLUME_ORDER.doubleValue())))
            .andExpect(jsonPath("$.[*].totalRevenu").value(hasItem(DEFAULT_TOTAL_REVENU.doubleValue())))
            .andExpect(jsonPath("$.[*].equityAllocation").value(hasItem(DEFAULT_EQUITY_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].fundsAllocation").value(hasItem(DEFAULT_FUNDS_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].realEstateAllocation").value(hasItem(DEFAULT_REAL_ESTATE_ALLOCATION.doubleValue())))
            .andExpect(jsonPath("$.[*].derivativeAllocation").value(hasItem(DEFAULT_DERIVATIVE_ALLOCATION.doubleValue())));
    }
}
