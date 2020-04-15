package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.ExchangeApp;
import swiss.alpinetech.exchange.domain.UserSetting;
import swiss.alpinetech.exchange.repository.UserSettingRepository;
import swiss.alpinetech.exchange.repository.search.UserSettingSearchRepository;
import swiss.alpinetech.exchange.service.UserSettingService;

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

import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;
import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;
/**
 * Integration tests for the {@link UserSettingResource} REST controller.
 */
@SpringBootTest(classes = ExchangeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class UserSettingResourceIT {

    private static final ZonedDateTime DEFAULT_DATE_OF_BIRTH = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_OF_BIRTH = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final COUNTRY DEFAULT_NATIONALITY = COUNTRY.FRANCE;
    private static final COUNTRY UPDATED_NATIONALITY = COUNTRY.USA;

    private static final String DEFAULT_PHONE_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_PHONE_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_POSITION = "AAAAAAAAAA";
    private static final String UPDATED_POSITION = "BBBBBBBBBB";

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final COUNTRY DEFAULT_COUNTRY = COUNTRY.FRANCE;
    private static final COUNTRY UPDATED_COUNTRY = COUNTRY.USA;

    private static final String DEFAULT_IBAN = "AAAAAAAAAAAAAA";
    private static final String UPDATED_IBAN = "BBBBBBBBBBBBBB";

    private static final String DEFAULT_ETH_ADDRESS = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
    private static final String UPDATED_ETH_ADDRESS = "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";

    private static final Integer DEFAULT_RISK_PROFIL = 0;
    private static final Integer UPDATED_RISK_PROFIL = 1;

    private static final Double DEFAULT_BALANCE = 1D;
    private static final Double UPDATED_BALANCE = 2D;

    @Autowired
    private UserSettingRepository userSettingRepository;

    @Autowired
    private UserSettingService userSettingService;

    /**
     * This repository is mocked in the swiss.alpinetech.exchange.repository.search test package.
     *
     * @see swiss.alpinetech.exchange.repository.search.UserSettingSearchRepositoryMockConfiguration
     */
    @Autowired
    private UserSettingSearchRepository mockUserSettingSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserSettingMockMvc;

    private UserSetting userSetting;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserSetting createEntity(EntityManager em) {
        UserSetting userSetting = new UserSetting()
            .dateOfBirth(DEFAULT_DATE_OF_BIRTH)
            .nationality(DEFAULT_NATIONALITY)
            .phoneNumber(DEFAULT_PHONE_NUMBER)
            .position(DEFAULT_POSITION)
            .address(DEFAULT_ADDRESS)
            .code(DEFAULT_CODE)
            .city(DEFAULT_CITY)
            .country(DEFAULT_COUNTRY)
            .iban(DEFAULT_IBAN)
            .ethAddress(DEFAULT_ETH_ADDRESS)
            .riskProfil(DEFAULT_RISK_PROFIL)
            .balance(DEFAULT_BALANCE);
        return userSetting;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserSetting createUpdatedEntity(EntityManager em) {
        UserSetting userSetting = new UserSetting()
            .dateOfBirth(UPDATED_DATE_OF_BIRTH)
            .nationality(UPDATED_NATIONALITY)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .position(UPDATED_POSITION)
            .address(UPDATED_ADDRESS)
            .code(UPDATED_CODE)
            .city(UPDATED_CITY)
            .country(UPDATED_COUNTRY)
            .iban(UPDATED_IBAN)
            .ethAddress(UPDATED_ETH_ADDRESS)
            .riskProfil(UPDATED_RISK_PROFIL)
            .balance(UPDATED_BALANCE);
        return userSetting;
    }

    @BeforeEach
    public void initTest() {
        userSetting = createEntity(em);
    }

    @Test
    @Transactional
    public void createUserSetting() throws Exception {
        int databaseSizeBeforeCreate = userSettingRepository.findAll().size();

        // Create the UserSetting
        restUserSettingMockMvc.perform(post("/api/user-settings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userSetting)))
            .andExpect(status().isCreated());

        // Validate the UserSetting in the database
        List<UserSetting> userSettingList = userSettingRepository.findAll();
        assertThat(userSettingList).hasSize(databaseSizeBeforeCreate + 1);
        UserSetting testUserSetting = userSettingList.get(userSettingList.size() - 1);
        assertThat(testUserSetting.getDateOfBirth()).isEqualTo(DEFAULT_DATE_OF_BIRTH);
        assertThat(testUserSetting.getNationality()).isEqualTo(DEFAULT_NATIONALITY);
        assertThat(testUserSetting.getPhoneNumber()).isEqualTo(DEFAULT_PHONE_NUMBER);
        assertThat(testUserSetting.getPosition()).isEqualTo(DEFAULT_POSITION);
        assertThat(testUserSetting.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testUserSetting.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testUserSetting.getCity()).isEqualTo(DEFAULT_CITY);
        assertThat(testUserSetting.getCountry()).isEqualTo(DEFAULT_COUNTRY);
        assertThat(testUserSetting.getIban()).isEqualTo(DEFAULT_IBAN);
        assertThat(testUserSetting.getEthAddress()).isEqualTo(DEFAULT_ETH_ADDRESS);
        assertThat(testUserSetting.getRiskProfil()).isEqualTo(DEFAULT_RISK_PROFIL);
        assertThat(testUserSetting.getBalance()).isEqualTo(DEFAULT_BALANCE);

        // Validate the UserSetting in Elasticsearch
        verify(mockUserSettingSearchRepository, times(1)).save(testUserSetting);
    }

    @Test
    @Transactional
    public void createUserSettingWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userSettingRepository.findAll().size();

        // Create the UserSetting with an existing ID
        userSetting.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserSettingMockMvc.perform(post("/api/user-settings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userSetting)))
            .andExpect(status().isBadRequest());

        // Validate the UserSetting in the database
        List<UserSetting> userSettingList = userSettingRepository.findAll();
        assertThat(userSettingList).hasSize(databaseSizeBeforeCreate);

        // Validate the UserSetting in Elasticsearch
        verify(mockUserSettingSearchRepository, times(0)).save(userSetting);
    }


    @Test
    @Transactional
    public void checkDateOfBirthIsRequired() throws Exception {
        int databaseSizeBeforeTest = userSettingRepository.findAll().size();
        // set the field null
        userSetting.setDateOfBirth(null);

        // Create the UserSetting, which fails.

        restUserSettingMockMvc.perform(post("/api/user-settings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userSetting)))
            .andExpect(status().isBadRequest());

        List<UserSetting> userSettingList = userSettingRepository.findAll();
        assertThat(userSettingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkIbanIsRequired() throws Exception {
        int databaseSizeBeforeTest = userSettingRepository.findAll().size();
        // set the field null
        userSetting.setIban(null);

        // Create the UserSetting, which fails.

        restUserSettingMockMvc.perform(post("/api/user-settings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userSetting)))
            .andExpect(status().isBadRequest());

        List<UserSetting> userSettingList = userSettingRepository.findAll();
        assertThat(userSettingList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllUserSettings() throws Exception {
        // Initialize the database
        userSettingRepository.saveAndFlush(userSetting);

        // Get all the userSettingList
        restUserSettingMockMvc.perform(get("/api/user-settings?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userSetting.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateOfBirth").value(hasItem(sameInstant(DEFAULT_DATE_OF_BIRTH))))
            .andExpect(jsonPath("$.[*].nationality").value(hasItem(DEFAULT_NATIONALITY.toString())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].iban").value(hasItem(DEFAULT_IBAN)))
            .andExpect(jsonPath("$.[*].ethAddress").value(hasItem(DEFAULT_ETH_ADDRESS)))
            .andExpect(jsonPath("$.[*].riskProfil").value(hasItem(DEFAULT_RISK_PROFIL)))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getUserSetting() throws Exception {
        // Initialize the database
        userSettingRepository.saveAndFlush(userSetting);

        // Get the userSetting
        restUserSettingMockMvc.perform(get("/api/user-settings/{id}", userSetting.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userSetting.getId().intValue()))
            .andExpect(jsonPath("$.dateOfBirth").value(sameInstant(DEFAULT_DATE_OF_BIRTH)))
            .andExpect(jsonPath("$.nationality").value(DEFAULT_NATIONALITY.toString()))
            .andExpect(jsonPath("$.phoneNumber").value(DEFAULT_PHONE_NUMBER))
            .andExpect(jsonPath("$.position").value(DEFAULT_POSITION))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY.toString()))
            .andExpect(jsonPath("$.iban").value(DEFAULT_IBAN))
            .andExpect(jsonPath("$.ethAddress").value(DEFAULT_ETH_ADDRESS))
            .andExpect(jsonPath("$.riskProfil").value(DEFAULT_RISK_PROFIL))
            .andExpect(jsonPath("$.balance").value(DEFAULT_BALANCE.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingUserSetting() throws Exception {
        // Get the userSetting
        restUserSettingMockMvc.perform(get("/api/user-settings/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserSetting() throws Exception {
        // Initialize the database
        userSettingService.save(userSetting);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockUserSettingSearchRepository);

        int databaseSizeBeforeUpdate = userSettingRepository.findAll().size();

        // Update the userSetting
        UserSetting updatedUserSetting = userSettingRepository.findById(userSetting.getId()).get();
        // Disconnect from session so that the updates on updatedUserSetting are not directly saved in db
        em.detach(updatedUserSetting);
        updatedUserSetting
            .dateOfBirth(UPDATED_DATE_OF_BIRTH)
            .nationality(UPDATED_NATIONALITY)
            .phoneNumber(UPDATED_PHONE_NUMBER)
            .position(UPDATED_POSITION)
            .address(UPDATED_ADDRESS)
            .code(UPDATED_CODE)
            .city(UPDATED_CITY)
            .country(UPDATED_COUNTRY)
            .iban(UPDATED_IBAN)
            .ethAddress(UPDATED_ETH_ADDRESS)
            .riskProfil(UPDATED_RISK_PROFIL)
            .balance(UPDATED_BALANCE);

        restUserSettingMockMvc.perform(put("/api/user-settings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedUserSetting)))
            .andExpect(status().isOk());

        // Validate the UserSetting in the database
        List<UserSetting> userSettingList = userSettingRepository.findAll();
        assertThat(userSettingList).hasSize(databaseSizeBeforeUpdate);
        UserSetting testUserSetting = userSettingList.get(userSettingList.size() - 1);
        assertThat(testUserSetting.getDateOfBirth()).isEqualTo(UPDATED_DATE_OF_BIRTH);
        assertThat(testUserSetting.getNationality()).isEqualTo(UPDATED_NATIONALITY);
        assertThat(testUserSetting.getPhoneNumber()).isEqualTo(UPDATED_PHONE_NUMBER);
        assertThat(testUserSetting.getPosition()).isEqualTo(UPDATED_POSITION);
        assertThat(testUserSetting.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testUserSetting.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testUserSetting.getCity()).isEqualTo(UPDATED_CITY);
        assertThat(testUserSetting.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testUserSetting.getIban()).isEqualTo(UPDATED_IBAN);
        assertThat(testUserSetting.getEthAddress()).isEqualTo(UPDATED_ETH_ADDRESS);
        assertThat(testUserSetting.getRiskProfil()).isEqualTo(UPDATED_RISK_PROFIL);
        assertThat(testUserSetting.getBalance()).isEqualTo(UPDATED_BALANCE);

        // Validate the UserSetting in Elasticsearch
        verify(mockUserSettingSearchRepository, times(1)).save(testUserSetting);
    }

    @Test
    @Transactional
    public void updateNonExistingUserSetting() throws Exception {
        int databaseSizeBeforeUpdate = userSettingRepository.findAll().size();

        // Create the UserSetting

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserSettingMockMvc.perform(put("/api/user-settings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(userSetting)))
            .andExpect(status().isBadRequest());

        // Validate the UserSetting in the database
        List<UserSetting> userSettingList = userSettingRepository.findAll();
        assertThat(userSettingList).hasSize(databaseSizeBeforeUpdate);

        // Validate the UserSetting in Elasticsearch
        verify(mockUserSettingSearchRepository, times(0)).save(userSetting);
    }

    @Test
    @Transactional
    public void deleteUserSetting() throws Exception {
        // Initialize the database
        userSettingService.save(userSetting);

        int databaseSizeBeforeDelete = userSettingRepository.findAll().size();

        // Delete the userSetting
        restUserSettingMockMvc.perform(delete("/api/user-settings/{id}", userSetting.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<UserSetting> userSettingList = userSettingRepository.findAll();
        assertThat(userSettingList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the UserSetting in Elasticsearch
        verify(mockUserSettingSearchRepository, times(1)).deleteById(userSetting.getId());
    }

    @Test
    @Transactional
    public void searchUserSetting() throws Exception {
        // Initialize the database
        userSettingService.save(userSetting);
        when(mockUserSettingSearchRepository.search(queryStringQuery("id:" + userSetting.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(userSetting), PageRequest.of(0, 1), 1));
        // Search the userSetting
        restUserSettingMockMvc.perform(get("/api/_search/user-settings?query=id:" + userSetting.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userSetting.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateOfBirth").value(hasItem(sameInstant(DEFAULT_DATE_OF_BIRTH))))
            .andExpect(jsonPath("$.[*].nationality").value(hasItem(DEFAULT_NATIONALITY.toString())))
            .andExpect(jsonPath("$.[*].phoneNumber").value(hasItem(DEFAULT_PHONE_NUMBER)))
            .andExpect(jsonPath("$.[*].position").value(hasItem(DEFAULT_POSITION)))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].iban").value(hasItem(DEFAULT_IBAN)))
            .andExpect(jsonPath("$.[*].ethAddress").value(hasItem(DEFAULT_ETH_ADDRESS)))
            .andExpect(jsonPath("$.[*].riskProfil").value(hasItem(DEFAULT_RISK_PROFIL)))
            .andExpect(jsonPath("$.[*].balance").value(hasItem(DEFAULT_BALANCE.doubleValue())));
    }
}
