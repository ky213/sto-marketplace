package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.ExchangeApp;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.domain.User;
import swiss.alpinetech.exchange.domain.WhiteListing;
import swiss.alpinetech.exchange.repository.WhiteListingRepository;
import swiss.alpinetech.exchange.repository.search.WhiteListingSearchRepository;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.WhiteListingService;

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

import swiss.alpinetech.exchange.domain.enumeration.STATUS;
/**
 * Integration tests for the {@link WhiteListingResource} REST controller.
 */
@SpringBootTest(classes = ExchangeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser(authorities = {AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER, AuthoritiesConstants.BANK})
public class WhiteListingResourceIT {

    private static final ZonedDateTime DEFAULT_DATE_EVENT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_EVENT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final STATUS DEFAULT_STATUS = STATUS.NONE;
    private static final STATUS UPDATED_STATUS = STATUS.INIT;

    private static final Boolean DEFAULT_ACTIVE = false;
    private static final Boolean UPDATED_ACTIVE = true;

    private static final String DEFAULT_ETH_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ETH_ADDRESS = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE_SYNCH_BLK = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_SYNCH_BLK = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_ST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CUSTOMER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CUSTOMER_NAME = "BBBBBBBBBB";

    private static final Double DEFAULT_BALANCE = 1D;
    private static final Double UPDATED_BALANCE = 2D;

    private static final SecurityToken DEFAULT_SECURITY_TOKEN = new SecurityToken();
    private static final User DEFAULT_USER = new User();

    @Autowired
    private WhiteListingRepository whiteListingRepository;

    @Autowired
    private WhiteListingService whiteListingService;

    /**
     * This repository is mocked in the swiss.alpinetech.exchange.repository.search test package.
     *
     * @see swiss.alpinetech.exchange.repository.search.WhiteListingSearchRepositoryMockConfiguration
     */
    @Autowired
    private WhiteListingSearchRepository mockWhiteListingSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWhiteListingMockMvc;

    private WhiteListing whiteListing;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WhiteListing createEntity(EntityManager em) {
        DEFAULT_SECURITY_TOKEN.setId(4L);
        DEFAULT_USER.setId(4L);
        WhiteListing whiteListing = new WhiteListing()
            .dateEvent(DEFAULT_DATE_EVENT)
            .status(DEFAULT_STATUS)
            .active(DEFAULT_ACTIVE)
            .ethAddress(DEFAULT_ETH_ADDRESS)
            .dateSynchBlk(DEFAULT_DATE_SYNCH_BLK)
            .stName(DEFAULT_ST_NAME)
            .customerName(DEFAULT_CUSTOMER_NAME)
            .balance(DEFAULT_BALANCE);
//            .securitytoken(DEFAULT_SECURITY_TOKEN)
//            .user(DEFAULT_USER);
        return whiteListing;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static WhiteListing createUpdatedEntity(EntityManager em) {
        WhiteListing whiteListing = new WhiteListing()
            .dateEvent(UPDATED_DATE_EVENT)
            .status(UPDATED_STATUS)
            .active(UPDATED_ACTIVE)
            .ethAddress(UPDATED_ETH_ADDRESS)
            .dateSynchBlk(UPDATED_DATE_SYNCH_BLK)
            .stName(UPDATED_ST_NAME)
            .customerName(UPDATED_CUSTOMER_NAME)
            .balance(UPDATED_BALANCE)
            .user(DEFAULT_USER)
            .securitytoken(DEFAULT_SECURITY_TOKEN);
        return whiteListing;
    }

    @BeforeEach
    public void initTest() {
        whiteListing = createEntity(em);
    }

    @Test
    @Transactional
    public void createWhiteListing() throws Exception {
        int databaseSizeBeforeCreate = whiteListingRepository.findAll().size();

        // Create the WhiteListing
        restWhiteListingMockMvc.perform(post("/api/white-listings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(whiteListing)))
            .andExpect(status().isCreated());

        // Validate the WhiteListing in the database
        List<WhiteListing> whiteListingList = whiteListingRepository.findAll();
        assertThat(whiteListingList).hasSize(databaseSizeBeforeCreate + 1);
        WhiteListing testWhiteListing = whiteListingList.get(whiteListingList.size() - 1);
        assertThat(testWhiteListing.getDateEvent()).isEqualTo(DEFAULT_DATE_EVENT);
        assertThat(testWhiteListing.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testWhiteListing.isActive()).isEqualTo(DEFAULT_ACTIVE);
        assertThat(testWhiteListing.getEthAddress()).isEqualTo(DEFAULT_ETH_ADDRESS);
        assertThat(testWhiteListing.getDateSynchBlk()).isEqualTo(DEFAULT_DATE_SYNCH_BLK);
        assertThat(testWhiteListing.getStName()).isEqualTo(DEFAULT_ST_NAME);
        assertThat(testWhiteListing.getCustomerName()).isEqualTo(DEFAULT_CUSTOMER_NAME);
        assertThat(testWhiteListing.getBalance()).isEqualTo(DEFAULT_BALANCE);

        // Validate the WhiteListing in Elasticsearch
        verify(mockWhiteListingSearchRepository, times(1)).save(testWhiteListing);
    }

    @Test
    @Transactional
    public void createWhiteListingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = whiteListingRepository.findAll().size();

        // Create the WhiteListing with an existing ID
        whiteListing.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restWhiteListingMockMvc.perform(post("/api/white-listings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(whiteListing)))
            .andExpect(status().isBadRequest());

        // Validate the WhiteListing in the database
        List<WhiteListing> whiteListingList = whiteListingRepository.findAll();
        assertThat(whiteListingList).hasSize(databaseSizeBeforeCreate);

        // Validate the WhiteListing in Elasticsearch
        verify(mockWhiteListingSearchRepository, times(0)).save(whiteListing);
    }

    @Test
    @Transactional
    public void getAllWhiteListings() throws Exception {
        // Initialize the database
        whiteListingRepository.saveAndFlush(whiteListing);

        // Get all the whiteListingList
        restWhiteListingMockMvc.perform(get("/api/white-listings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(whiteListing.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateEvent").value(hasItem(sameInstant(DEFAULT_DATE_EVENT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].ethAddress").value(hasItem(DEFAULT_ETH_ADDRESS)))
            .andExpect(jsonPath("$.[*].dateSynchBlk").value(hasItem(sameInstant(DEFAULT_DATE_SYNCH_BLK))))
            .andExpect(jsonPath("$.[*].stName").value(hasItem(DEFAULT_ST_NAME)))
            .andExpect(jsonPath("$.[*].customerName").value(hasItem(DEFAULT_CUSTOMER_NAME)))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.doubleValue())));
    }

    @Test
    @Transactional
    public void getWhiteListing() throws Exception {
        // Initialize the database
        whiteListingRepository.saveAndFlush(whiteListing);

        // Get the whiteListing
        restWhiteListingMockMvc.perform(get("/api/white-listings/{id}", whiteListing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(whiteListing.getId().intValue()))
            .andExpect(jsonPath("$.dateEvent").value(sameInstant(DEFAULT_DATE_EVENT)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.active").value(DEFAULT_ACTIVE.booleanValue()))
            .andExpect(jsonPath("$.ethAddress").value(DEFAULT_ETH_ADDRESS))
            .andExpect(jsonPath("$.dateSynchBlk").value(sameInstant(DEFAULT_DATE_SYNCH_BLK)))
            .andExpect(jsonPath("$.stName").value(DEFAULT_ST_NAME))
            .andExpect(jsonPath("$.customerName").value(DEFAULT_CUSTOMER_NAME))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingWhiteListing() throws Exception {
        // Get the whiteListing
        restWhiteListingMockMvc.perform(get("/api/white-listings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateWhiteListing() throws Exception {
        // Initialize the database
        whiteListingService.save(whiteListing);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockWhiteListingSearchRepository);

        int databaseSizeBeforeUpdate = whiteListingRepository.findAll().size();

        // Update the whiteListing
        WhiteListing updatedWhiteListing = whiteListingRepository.findById(whiteListing.getId()).get();
        // Disconnect from session so that the updates on updatedWhiteListing are not directly saved in db
        em.detach(updatedWhiteListing);
        updatedWhiteListing
            .dateEvent(UPDATED_DATE_EVENT)
            .status(UPDATED_STATUS)
            .active(UPDATED_ACTIVE)
            .ethAddress(UPDATED_ETH_ADDRESS)
            .dateSynchBlk(UPDATED_DATE_SYNCH_BLK)
            .stName(UPDATED_ST_NAME)
            .customerName(UPDATED_CUSTOMER_NAME)
            .balance(UPDATED_BALANCE);

        restWhiteListingMockMvc.perform(put("/api/white-listings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedWhiteListing)))
            .andExpect(status().isOk());

        // Validate the WhiteListing in the database
        List<WhiteListing> whiteListingList = whiteListingRepository.findAll();
        assertThat(whiteListingList).hasSize(databaseSizeBeforeUpdate);
        WhiteListing testWhiteListing = whiteListingList.get(whiteListingList.size() - 1);
        assertThat(testWhiteListing.getDateEvent()).isEqualTo(UPDATED_DATE_EVENT);
        assertThat(testWhiteListing.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testWhiteListing.isActive()).isEqualTo(UPDATED_ACTIVE);
        assertThat(testWhiteListing.getEthAddress()).isEqualTo(UPDATED_ETH_ADDRESS);
        assertThat(testWhiteListing.getDateSynchBlk()).isEqualTo(UPDATED_DATE_SYNCH_BLK);
        assertThat(testWhiteListing.getStName()).isEqualTo(UPDATED_ST_NAME);
        assertThat(testWhiteListing.getCustomerName()).isEqualTo(UPDATED_CUSTOMER_NAME);
        assertThat(testWhiteListing.getBalance()).isEqualTo(UPDATED_BALANCE);

        // Validate the WhiteListing in Elasticsearch
        verify(mockWhiteListingSearchRepository, times(1)).save(testWhiteListing);
    }

    @Test
    @Transactional
    public void updateNonExistingWhiteListing() throws Exception {
        int databaseSizeBeforeUpdate = whiteListingRepository.findAll().size();

        // Create the WhiteListing

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWhiteListingMockMvc.perform(put("/api/white-listings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(whiteListing)))
            .andExpect(status().isBadRequest());

        // Validate the WhiteListing in the database
        List<WhiteListing> whiteListingList = whiteListingRepository.findAll();
        assertThat(whiteListingList).hasSize(databaseSizeBeforeUpdate);

        // Validate the WhiteListing in Elasticsearch
        verify(mockWhiteListingSearchRepository, times(0)).save(whiteListing);
    }

    @Test
    @Transactional
    public void deleteWhiteListing() throws Exception {
        // Initialize the database
//        whiteListing.getUser().setId(4L);
//        whiteListing.getSecuritytoken().setId(5L);
        whiteListingService.save(whiteListing);

        int databaseSizeBeforeDelete = whiteListingRepository.findAll().size();

        // Delete the whiteListing
        restWhiteListingMockMvc.perform(delete("/api/white-listings/{id}", whiteListing.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<WhiteListing> whiteListingList = whiteListingRepository.findAll();
        assertThat(whiteListingList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the WhiteListing in Elasticsearch
        verify(mockWhiteListingSearchRepository, times(1)).deleteById(whiteListing.getId());
    }

    @Test
    @Transactional
    public void searchWhiteListing() throws Exception {
        // Initialize the database
        whiteListingService.save(whiteListing);
        when(mockWhiteListingSearchRepository.search(queryStringQuery("id:" + whiteListing.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(whiteListing), PageRequest.of(0, 1), 1));
        // Search the whiteListing
        restWhiteListingMockMvc.perform(get("/api/_search/white-listings?query=id:" + whiteListing.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(whiteListing.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateEvent").value(hasItem(sameInstant(DEFAULT_DATE_EVENT))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].active").value(hasItem(DEFAULT_ACTIVE.booleanValue())))
            .andExpect(jsonPath("$.[*].ethAddress").value(hasItem(DEFAULT_ETH_ADDRESS)))
            .andExpect(jsonPath("$.[*].dateSynchBlk").value(hasItem(sameInstant(DEFAULT_DATE_SYNCH_BLK))))
            .andExpect(jsonPath("$.[*].stName").value(hasItem(DEFAULT_ST_NAME)))
            .andExpect(jsonPath("$.[*].customerName").value(hasItem(DEFAULT_CUSTOMER_NAME)))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.doubleValue())));
    }
}
