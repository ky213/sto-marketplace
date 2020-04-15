package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.ExchangeApp;
import swiss.alpinetech.exchange.domain.BankInfo;
import swiss.alpinetech.exchange.repository.BankInfoRepository;
import swiss.alpinetech.exchange.repository.search.BankInfoSearchRepository;
import swiss.alpinetech.exchange.service.BankInfoService;

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
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;
/**
 * Integration tests for the {@link BankInfoResource} REST controller.
 */
@SpringBootTest(classes = ExchangeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class BankInfoResourceIT {

    private static final String DEFAULT_BANK_NAME = "AAAAAAAAAA";
    private static final String UPDATED_BANK_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final COUNTRY DEFAULT_COUNTRY = COUNTRY.FRANCE;
    private static final COUNTRY UPDATED_COUNTRY = COUNTRY.USA;

    private static final String DEFAULT_BIC_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_BIC_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_OMNIBUS_ACCOUNT = "AAAAAAAAAAAAAA";
    private static final String UPDATED_OMNIBUS_ACCOUNT = "BBBBBBBBBBBBBB";

    private static final Double DEFAULT_FIXED_FEE = 0D;
    private static final Double UPDATED_FIXED_FEE = 1D;

    private static final Float DEFAULT_PERCENT_FEE = 0F;
    private static final Float UPDATED_PERCENT_FEE = 1F;

    @Autowired
    private BankInfoRepository bankInfoRepository;

    @Autowired
    private BankInfoService bankInfoService;

    /**
     * This repository is mocked in the swiss.alpinetech.exchange.repository.search test package.
     *
     * @see swiss.alpinetech.exchange.repository.search.BankInfoSearchRepositoryMockConfiguration
     */
    @Autowired
    private BankInfoSearchRepository mockBankInfoSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restBankInfoMockMvc;

    private BankInfo bankInfo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankInfo createEntity(EntityManager em) {
        BankInfo bankInfo = new BankInfo()
            .bankName(DEFAULT_BANK_NAME)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE)
            .country(DEFAULT_COUNTRY)
            .bicNumber(DEFAULT_BIC_NUMBER)
            .omnibusAccount(DEFAULT_OMNIBUS_ACCOUNT)
            .fixedFee(DEFAULT_FIXED_FEE)
            .percentFee(DEFAULT_PERCENT_FEE);
        return bankInfo;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static BankInfo createUpdatedEntity(EntityManager em) {
        BankInfo bankInfo = new BankInfo()
            .bankName(UPDATED_BANK_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .country(UPDATED_COUNTRY)
            .bicNumber(UPDATED_BIC_NUMBER)
            .omnibusAccount(UPDATED_OMNIBUS_ACCOUNT)
            .fixedFee(UPDATED_FIXED_FEE)
            .percentFee(UPDATED_PERCENT_FEE);
        return bankInfo;
    }

    @BeforeEach
    public void initTest() {
        bankInfo = createEntity(em);
    }

    @Test
    @Transactional
    public void createBankInfo() throws Exception {
        int databaseSizeBeforeCreate = bankInfoRepository.findAll().size();

        // Create the BankInfo
        restBankInfoMockMvc.perform(post("/api/bank-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankInfo)))
            .andExpect(status().isCreated());

        // Validate the BankInfo in the database
        List<BankInfo> bankInfoList = bankInfoRepository.findAll();
        assertThat(bankInfoList).hasSize(databaseSizeBeforeCreate + 1);
        BankInfo testBankInfo = bankInfoList.get(bankInfoList.size() - 1);
        assertThat(testBankInfo.getBankName()).isEqualTo(DEFAULT_BANK_NAME);
        assertThat(testBankInfo.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testBankInfo.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testBankInfo.getCountry()).isEqualTo(DEFAULT_COUNTRY);
        assertThat(testBankInfo.getBicNumber()).isEqualTo(DEFAULT_BIC_NUMBER);
        assertThat(testBankInfo.getOmnibusAccount()).isEqualTo(DEFAULT_OMNIBUS_ACCOUNT);
        assertThat(testBankInfo.getFixedFee()).isEqualTo(DEFAULT_FIXED_FEE);
        assertThat(testBankInfo.getPercentFee()).isEqualTo(DEFAULT_PERCENT_FEE);

        // Validate the BankInfo in Elasticsearch
        verify(mockBankInfoSearchRepository, times(1)).save(testBankInfo);
    }

    @Test
    @Transactional
    public void createBankInfoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = bankInfoRepository.findAll().size();

        // Create the BankInfo with an existing ID
        bankInfo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restBankInfoMockMvc.perform(post("/api/bank-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankInfo)))
            .andExpect(status().isBadRequest());

        // Validate the BankInfo in the database
        List<BankInfo> bankInfoList = bankInfoRepository.findAll();
        assertThat(bankInfoList).hasSize(databaseSizeBeforeCreate);

        // Validate the BankInfo in Elasticsearch
        verify(mockBankInfoSearchRepository, times(0)).save(bankInfo);
    }


    @Test
    @Transactional
    public void checkBankNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = bankInfoRepository.findAll().size();
        // set the field null
        bankInfo.setBankName(null);

        // Create the BankInfo, which fails.

        restBankInfoMockMvc.perform(post("/api/bank-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankInfo)))
            .andExpect(status().isBadRequest());

        List<BankInfo> bankInfoList = bankInfoRepository.findAll();
        assertThat(bankInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkFixedFeeIsRequired() throws Exception {
        int databaseSizeBeforeTest = bankInfoRepository.findAll().size();
        // set the field null
        bankInfo.setFixedFee(null);

        // Create the BankInfo, which fails.

        restBankInfoMockMvc.perform(post("/api/bank-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankInfo)))
            .andExpect(status().isBadRequest());

        List<BankInfo> bankInfoList = bankInfoRepository.findAll();
        assertThat(bankInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkPercentFeeIsRequired() throws Exception {
        int databaseSizeBeforeTest = bankInfoRepository.findAll().size();
        // set the field null
        bankInfo.setPercentFee(null);

        // Create the BankInfo, which fails.

        restBankInfoMockMvc.perform(post("/api/bank-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankInfo)))
            .andExpect(status().isBadRequest());

        List<BankInfo> bankInfoList = bankInfoRepository.findAll();
        assertThat(bankInfoList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllBankInfos() throws Exception {
        // Initialize the database
        bankInfoRepository.saveAndFlush(bankInfo);

        // Get all the bankInfoList
        restBankInfoMockMvc.perform(get("/api/bank-infos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bankInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].bankName").value(hasItem(DEFAULT_BANK_NAME)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].bicNumber").value(hasItem(DEFAULT_BIC_NUMBER)))
            .andExpect(jsonPath("$.[*].omnibusAccount").value(hasItem(DEFAULT_OMNIBUS_ACCOUNT)))
            .andExpect(jsonPath("$.[*].fixedFee").value(hasItem(DEFAULT_FIXED_FEE.doubleValue())))
            .andExpect(jsonPath("$.[*].percentFee").value(hasItem(DEFAULT_PERCENT_FEE.doubleValue())));
    }
    
    @Test
    @Transactional
    public void getBankInfo() throws Exception {
        // Initialize the database
        bankInfoRepository.saveAndFlush(bankInfo);

        // Get the bankInfo
        restBankInfoMockMvc.perform(get("/api/bank-infos/{id}", bankInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(bankInfo.getId().intValue()))
            .andExpect(jsonPath("$.bankName").value(DEFAULT_BANK_NAME))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.country").value(DEFAULT_COUNTRY.toString()))
            .andExpect(jsonPath("$.bicNumber").value(DEFAULT_BIC_NUMBER))
            .andExpect(jsonPath("$.omnibusAccount").value(DEFAULT_OMNIBUS_ACCOUNT))
            .andExpect(jsonPath("$.fixedFee").value(DEFAULT_FIXED_FEE.doubleValue()))
            .andExpect(jsonPath("$.percentFee").value(DEFAULT_PERCENT_FEE.doubleValue()));
    }

    @Test
    @Transactional
    public void getNonExistingBankInfo() throws Exception {
        // Get the bankInfo
        restBankInfoMockMvc.perform(get("/api/bank-infos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateBankInfo() throws Exception {
        // Initialize the database
        bankInfoService.save(bankInfo);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockBankInfoSearchRepository);

        int databaseSizeBeforeUpdate = bankInfoRepository.findAll().size();

        // Update the bankInfo
        BankInfo updatedBankInfo = bankInfoRepository.findById(bankInfo.getId()).get();
        // Disconnect from session so that the updates on updatedBankInfo are not directly saved in db
        em.detach(updatedBankInfo);
        updatedBankInfo
            .bankName(UPDATED_BANK_NAME)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .country(UPDATED_COUNTRY)
            .bicNumber(UPDATED_BIC_NUMBER)
            .omnibusAccount(UPDATED_OMNIBUS_ACCOUNT)
            .fixedFee(UPDATED_FIXED_FEE)
            .percentFee(UPDATED_PERCENT_FEE);

        restBankInfoMockMvc.perform(put("/api/bank-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedBankInfo)))
            .andExpect(status().isOk());

        // Validate the BankInfo in the database
        List<BankInfo> bankInfoList = bankInfoRepository.findAll();
        assertThat(bankInfoList).hasSize(databaseSizeBeforeUpdate);
        BankInfo testBankInfo = bankInfoList.get(bankInfoList.size() - 1);
        assertThat(testBankInfo.getBankName()).isEqualTo(UPDATED_BANK_NAME);
        assertThat(testBankInfo.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testBankInfo.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testBankInfo.getCountry()).isEqualTo(UPDATED_COUNTRY);
        assertThat(testBankInfo.getBicNumber()).isEqualTo(UPDATED_BIC_NUMBER);
        assertThat(testBankInfo.getOmnibusAccount()).isEqualTo(UPDATED_OMNIBUS_ACCOUNT);
        assertThat(testBankInfo.getFixedFee()).isEqualTo(UPDATED_FIXED_FEE);
        assertThat(testBankInfo.getPercentFee()).isEqualTo(UPDATED_PERCENT_FEE);

        // Validate the BankInfo in Elasticsearch
        verify(mockBankInfoSearchRepository, times(1)).save(testBankInfo);
    }

    @Test
    @Transactional
    public void updateNonExistingBankInfo() throws Exception {
        int databaseSizeBeforeUpdate = bankInfoRepository.findAll().size();

        // Create the BankInfo

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restBankInfoMockMvc.perform(put("/api/bank-infos")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(bankInfo)))
            .andExpect(status().isBadRequest());

        // Validate the BankInfo in the database
        List<BankInfo> bankInfoList = bankInfoRepository.findAll();
        assertThat(bankInfoList).hasSize(databaseSizeBeforeUpdate);

        // Validate the BankInfo in Elasticsearch
        verify(mockBankInfoSearchRepository, times(0)).save(bankInfo);
    }

    @Test
    @Transactional
    public void deleteBankInfo() throws Exception {
        // Initialize the database
        bankInfoService.save(bankInfo);

        int databaseSizeBeforeDelete = bankInfoRepository.findAll().size();

        // Delete the bankInfo
        restBankInfoMockMvc.perform(delete("/api/bank-infos/{id}", bankInfo.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<BankInfo> bankInfoList = bankInfoRepository.findAll();
        assertThat(bankInfoList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the BankInfo in Elasticsearch
        verify(mockBankInfoSearchRepository, times(1)).deleteById(bankInfo.getId());
    }

    @Test
    @Transactional
    public void searchBankInfo() throws Exception {
        // Initialize the database
        bankInfoService.save(bankInfo);
        when(mockBankInfoSearchRepository.search(queryStringQuery("id:" + bankInfo.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(bankInfo), PageRequest.of(0, 1), 1));
        // Search the bankInfo
        restBankInfoMockMvc.perform(get("/api/_search/bank-infos?query=id:" + bankInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(bankInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].bankName").value(hasItem(DEFAULT_BANK_NAME)))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].country").value(hasItem(DEFAULT_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].bicNumber").value(hasItem(DEFAULT_BIC_NUMBER)))
            .andExpect(jsonPath("$.[*].omnibusAccount").value(hasItem(DEFAULT_OMNIBUS_ACCOUNT)))
            .andExpect(jsonPath("$.[*].fixedFee").value(hasItem(DEFAULT_FIXED_FEE.doubleValue())))
            .andExpect(jsonPath("$.[*].percentFee").value(hasItem(DEFAULT_PERCENT_FEE.doubleValue())));
    }
}
