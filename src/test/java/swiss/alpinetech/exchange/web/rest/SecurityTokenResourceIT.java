package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.ExchangeApp;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.repository.SecurityTokenRepository;
import swiss.alpinetech.exchange.repository.search.SecurityTokenSearchRepository;
import swiss.alpinetech.exchange.service.SecurityTokenService;

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
import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;
import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;
import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;
import swiss.alpinetech.exchange.domain.enumeration.STSTATUS;
/**
 * Integration tests for the {@link SecurityTokenResource} REST controller.
 */
@SpringBootTest(classes = ExchangeApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser(username = "ram", roles={"ADMIN"})
public class SecurityTokenResourceIT {

    private static final String DEFAULT_ID_RED = "AAAAAAAAAA";
    private static final String UPDATED_ID_RED = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_LAUCHE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_LAUCHE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final byte[] DEFAULT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_LOGO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_SYMBOL = "AAAAAAAAAA";
    private static final String UPDATED_SYMBOL = "BBBBBBBBBB";

    private static final COUNTRY DEFAULT_JURIDICTION = COUNTRY.FRANCE;
    private static final COUNTRY UPDATED_JURIDICTION = COUNTRY.USA;

    private static final String DEFAULT_ISSUER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ISSUER_NAME = "BBBBBBBBBB";

    private static final COUNTRY DEFAULT_ISSUER_COUNTY = COUNTRY.FRANCE;
    private static final COUNTRY UPDATED_ISSUER_COUNTY = COUNTRY.USA;

    private static final String DEFAULT_TOKENIZATION_FIRM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TOKENIZATION_FIRM_NAME = "BBBBBBBBBB";

    private static final COUNTRY DEFAULT_TOKENIZATION_FIRM_COUNTRY = COUNTRY.FRANCE;
    private static final COUNTRY UPDATED_TOKENIZATION_FIRM_COUNTRY = COUNTRY.USA;

    private static final String DEFAULT_KYC_PROVIDER_NAME = "AAAAAAAAAA";
    private static final String UPDATED_KYC_PROVIDER_NAME = "BBBBBBBBBB";

    private static final COUNTRY DEFAULT_KYC_PROVIDER_COUNTRY = COUNTRY.FRANCE;
    private static final COUNTRY UPDATED_KYC_PROVIDER_COUNTRY = COUNTRY.USA;

    private static final Double DEFAULT_STO_PRICE = 0D;
    private static final Double UPDATED_STO_PRICE = 1D;

    private static final Double DEFAULT_AMOUNT_RAISED = 0D;
    private static final Double UPDATED_AMOUNT_RAISED = 1D;

    private static final CATEGORY DEFAULT_CATEGORY = CATEGORY.EQUITY;
    private static final CATEGORY UPDATED_CATEGORY = CATEGORY.FUNDS;

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_RESTRICTION_COUNTY = "AAAAAAAAAA";
    private static final String UPDATED_RESTRICTION_COUNTY = "BBBBBBBBBB";

    private static final String DEFAULT_RESTRICTION_NATIONALITY = "AAAAAAAAAA";
    private static final String UPDATED_RESTRICTION_NATIONALITY = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PROSPECTUS = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PROSPECTUS = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PROSPECTUS_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PROSPECTUS_CONTENT_TYPE = "image/png";

    private static final STSTATUS DEFAULT_STATUS = STSTATUS.DRAFT;
    private static final STSTATUS UPDATED_STATUS = STSTATUS.DISABLED;

    private static final ZonedDateTime DEFAULT_REGISTRATION_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_REGISTRATION_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_DUE_DILIGENCE_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DUE_DILIGENCE_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Double DEFAULT_LAST_SELLINGPRICE = 0D;
    private static final Double UPDATED_LAST_SELLINGPRICE = 1D;

    private static final Double DEFAULT_LAST_BUYING_PRICE = 0D;
    private static final Double UPDATED_LAST_BUYING_PRICE = 1D;

    private static final String DEFAULT_SMARTCONTRACT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_SMARTCONTRACT_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_KYC_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_KYC_ADDRESS = "BBBBBBBBBB";

    private static final String DEFAULT_WEBSITE = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE = "BBBBBBBBBB";

    @Autowired
    private SecurityTokenRepository securityTokenRepository;

    @Autowired
    private SecurityTokenService securityTokenService;

    /**
     * This repository is mocked in the swiss.alpinetech.exchange.repository.search test package.
     *
     * @see swiss.alpinetech.exchange.repository.search.SecurityTokenSearchRepositoryMockConfiguration
     */
    @Autowired
    private SecurityTokenSearchRepository mockSecurityTokenSearchRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSecurityTokenMockMvc;

    private SecurityToken securityToken;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SecurityToken createEntity(EntityManager em) {
        SecurityToken securityToken = new SecurityToken()
            .idRed(DEFAULT_ID_RED)
            .name(DEFAULT_NAME)
            .laucheDate(DEFAULT_LAUCHE_DATE)
            .logo(DEFAULT_LOGO)
            .logoContentType(DEFAULT_LOGO_CONTENT_TYPE)
            .symbol(DEFAULT_SYMBOL)
            .juridiction(DEFAULT_JURIDICTION)
            .issuerName(DEFAULT_ISSUER_NAME)
            .issuerCounty(DEFAULT_ISSUER_COUNTY)
            .tokenizationFirmName(DEFAULT_TOKENIZATION_FIRM_NAME)
            .tokenizationFirmCountry(DEFAULT_TOKENIZATION_FIRM_COUNTRY)
            .kycProviderName(DEFAULT_KYC_PROVIDER_NAME)
            .kycProviderCountry(DEFAULT_KYC_PROVIDER_COUNTRY)
            .stoPrice(DEFAULT_STO_PRICE)
            .amountRaised(DEFAULT_AMOUNT_RAISED)
            .category(DEFAULT_CATEGORY)
            .summary(DEFAULT_SUMMARY)
            .description(DEFAULT_DESCRIPTION)
            .restrictionCounty(DEFAULT_RESTRICTION_COUNTY)
            .restrictionNationality(DEFAULT_RESTRICTION_NATIONALITY)
            .prospectus(DEFAULT_PROSPECTUS)
            .prospectusContentType(DEFAULT_PROSPECTUS_CONTENT_TYPE)
            .status(DEFAULT_STATUS)
            .registrationDate(DEFAULT_REGISTRATION_DATE)
            .updateDate(DEFAULT_UPDATE_DATE)
            .dueDiligenceDate(DEFAULT_DUE_DILIGENCE_DATE)
            .lastSellingprice(DEFAULT_LAST_SELLINGPRICE)
            .lastBuyingPrice(DEFAULT_LAST_BUYING_PRICE)
            .smartcontractAddress(DEFAULT_SMARTCONTRACT_ADDRESS)
            .kycAddress(DEFAULT_KYC_ADDRESS)
            .website(DEFAULT_WEBSITE);
        return securityToken;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SecurityToken createUpdatedEntity(EntityManager em) {
        SecurityToken securityToken = new SecurityToken()
            .idRed(UPDATED_ID_RED)
            .name(UPDATED_NAME)
            .laucheDate(UPDATED_LAUCHE_DATE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .symbol(UPDATED_SYMBOL)
            .juridiction(UPDATED_JURIDICTION)
            .issuerName(UPDATED_ISSUER_NAME)
            .issuerCounty(UPDATED_ISSUER_COUNTY)
            .tokenizationFirmName(UPDATED_TOKENIZATION_FIRM_NAME)
            .tokenizationFirmCountry(UPDATED_TOKENIZATION_FIRM_COUNTRY)
            .kycProviderName(UPDATED_KYC_PROVIDER_NAME)
            .kycProviderCountry(UPDATED_KYC_PROVIDER_COUNTRY)
            .stoPrice(UPDATED_STO_PRICE)
            .amountRaised(UPDATED_AMOUNT_RAISED)
            .category(UPDATED_CATEGORY)
            .summary(UPDATED_SUMMARY)
            .description(UPDATED_DESCRIPTION)
            .restrictionCounty(UPDATED_RESTRICTION_COUNTY)
            .restrictionNationality(UPDATED_RESTRICTION_NATIONALITY)
            .prospectus(UPDATED_PROSPECTUS)
            .prospectusContentType(UPDATED_PROSPECTUS_CONTENT_TYPE)
            .status(UPDATED_STATUS)
            .registrationDate(UPDATED_REGISTRATION_DATE)
            .updateDate(UPDATED_UPDATE_DATE)
            .dueDiligenceDate(UPDATED_DUE_DILIGENCE_DATE)
            .lastSellingprice(UPDATED_LAST_SELLINGPRICE)
            .lastBuyingPrice(UPDATED_LAST_BUYING_PRICE)
            .smartcontractAddress(UPDATED_SMARTCONTRACT_ADDRESS)
            .kycAddress(UPDATED_KYC_ADDRESS)
            .website(UPDATED_WEBSITE);
        return securityToken;
    }

    @BeforeEach
    public void initTest() {
        securityToken = createEntity(em);
    }

    @Test
    @Transactional
    public void createSecurityToken() throws Exception {
        int databaseSizeBeforeCreate = securityTokenRepository.findAll().size();

        // Create the SecurityToken
        restSecurityTokenMockMvc.perform(post("/api/security-tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(securityToken)))
            .andExpect(status().isCreated());

        // Validate the SecurityToken in the database
        List<SecurityToken> securityTokenList = securityTokenRepository.findAll();
        assertThat(securityTokenList).hasSize(databaseSizeBeforeCreate + 1);
        SecurityToken testSecurityToken = securityTokenList.get(securityTokenList.size() - 1);
        assertThat(testSecurityToken.getIdRed()).isEqualTo(DEFAULT_ID_RED);
        assertThat(testSecurityToken.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSecurityToken.getLaucheDate()).isEqualTo(DEFAULT_LAUCHE_DATE);
        assertThat(testSecurityToken.getLogo()).isEqualTo(DEFAULT_LOGO);
        assertThat(testSecurityToken.getLogoContentType()).isEqualTo(DEFAULT_LOGO_CONTENT_TYPE);
        assertThat(testSecurityToken.getSymbol()).isEqualTo(DEFAULT_SYMBOL);
        assertThat(testSecurityToken.getJuridiction()).isEqualTo(DEFAULT_JURIDICTION);
        assertThat(testSecurityToken.getIssuerName()).isEqualTo(DEFAULT_ISSUER_NAME);
        assertThat(testSecurityToken.getIssuerCounty()).isEqualTo(DEFAULT_ISSUER_COUNTY);
        assertThat(testSecurityToken.getTokenizationFirmName()).isEqualTo(DEFAULT_TOKENIZATION_FIRM_NAME);
        assertThat(testSecurityToken.getTokenizationFirmCountry()).isEqualTo(DEFAULT_TOKENIZATION_FIRM_COUNTRY);
        assertThat(testSecurityToken.getKycProviderName()).isEqualTo(DEFAULT_KYC_PROVIDER_NAME);
        assertThat(testSecurityToken.getKycProviderCountry()).isEqualTo(DEFAULT_KYC_PROVIDER_COUNTRY);
        assertThat(testSecurityToken.getStoPrice()).isEqualTo(DEFAULT_STO_PRICE);
        assertThat(testSecurityToken.getAmountRaised()).isEqualTo(DEFAULT_AMOUNT_RAISED);
        assertThat(testSecurityToken.getCategory()).isEqualTo(DEFAULT_CATEGORY);
        assertThat(testSecurityToken.getSummary()).isEqualTo(DEFAULT_SUMMARY);
        assertThat(testSecurityToken.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testSecurityToken.getRestrictionCounty()).isEqualTo(DEFAULT_RESTRICTION_COUNTY);
        assertThat(testSecurityToken.getRestrictionNationality()).isEqualTo(DEFAULT_RESTRICTION_NATIONALITY);
        assertThat(testSecurityToken.getProspectus()).isEqualTo(DEFAULT_PROSPECTUS);
        assertThat(testSecurityToken.getProspectusContentType()).isEqualTo(DEFAULT_PROSPECTUS_CONTENT_TYPE);
        assertThat(testSecurityToken.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSecurityToken.getRegistrationDate()).isEqualTo(DEFAULT_REGISTRATION_DATE);
        assertThat(testSecurityToken.getUpdateDate()).isEqualTo(DEFAULT_UPDATE_DATE);
        assertThat(testSecurityToken.getDueDiligenceDate()).isEqualTo(DEFAULT_DUE_DILIGENCE_DATE);
        assertThat(testSecurityToken.getLastSellingprice()).isEqualTo(DEFAULT_LAST_SELLINGPRICE);
        assertThat(testSecurityToken.getLastBuyingPrice()).isEqualTo(DEFAULT_LAST_BUYING_PRICE);
        assertThat(testSecurityToken.getSmartcontractAddress()).isEqualTo(DEFAULT_SMARTCONTRACT_ADDRESS);
        assertThat(testSecurityToken.getKycAddress()).isEqualTo(DEFAULT_KYC_ADDRESS);
        assertThat(testSecurityToken.getWebsite()).isEqualTo(DEFAULT_WEBSITE);

        // Validate the SecurityToken in Elasticsearch
        verify(mockSecurityTokenSearchRepository, times(1)).save(testSecurityToken);
    }

    @Test
    @Transactional
    public void createSecurityTokenWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = securityTokenRepository.findAll().size();

        // Create the SecurityToken with an existing ID
        securityToken.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSecurityTokenMockMvc.perform(post("/api/security-tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(securityToken)))
            .andExpect(status().isBadRequest());

        // Validate the SecurityToken in the database
        List<SecurityToken> securityTokenList = securityTokenRepository.findAll();
        assertThat(securityTokenList).hasSize(databaseSizeBeforeCreate);

        // Validate the SecurityToken in Elasticsearch
        verify(mockSecurityTokenSearchRepository, times(0)).save(securityToken);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = securityTokenRepository.findAll().size();
        // set the field null
        securityToken.setName(null);

        // Create the SecurityToken, which fails.

        restSecurityTokenMockMvc.perform(post("/api/security-tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(securityToken)))
            .andExpect(status().isBadRequest());

        List<SecurityToken> securityTokenList = securityTokenRepository.findAll();
        assertThat(securityTokenList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSymbolIsRequired() throws Exception {
        int databaseSizeBeforeTest = securityTokenRepository.findAll().size();
        // set the field null
        securityToken.setSymbol(null);

        // Create the SecurityToken, which fails.

        restSecurityTokenMockMvc.perform(post("/api/security-tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(securityToken)))
            .andExpect(status().isBadRequest());

        List<SecurityToken> securityTokenList = securityTokenRepository.findAll();
        assertThat(securityTokenList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkSummaryIsRequired() throws Exception {
        int databaseSizeBeforeTest = securityTokenRepository.findAll().size();
        // set the field null
        securityToken.setSummary(null);

        // Create the SecurityToken, which fails.

        restSecurityTokenMockMvc.perform(post("/api/security-tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(securityToken)))
            .andExpect(status().isBadRequest());

        List<SecurityToken> securityTokenList = securityTokenRepository.findAll();
        assertThat(securityTokenList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSecurityTokens() throws Exception {
        // Initialize the database
        securityTokenRepository.saveAndFlush(securityToken);

        // Get all the securityTokenList
        restSecurityTokenMockMvc.perform(get("/api/security-tokens?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(securityToken.getId().intValue())))
            .andExpect(jsonPath("$.[*].idRed").value(hasItem(DEFAULT_ID_RED)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].laucheDate").value(hasItem(sameInstant(DEFAULT_LAUCHE_DATE))))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].juridiction").value(hasItem(DEFAULT_JURIDICTION.toString())))
            .andExpect(jsonPath("$.[*].issuerName").value(hasItem(DEFAULT_ISSUER_NAME)))
            .andExpect(jsonPath("$.[*].issuerCounty").value(hasItem(DEFAULT_ISSUER_COUNTY.toString())))
            .andExpect(jsonPath("$.[*].tokenizationFirmName").value(hasItem(DEFAULT_TOKENIZATION_FIRM_NAME)))
            .andExpect(jsonPath("$.[*].tokenizationFirmCountry").value(hasItem(DEFAULT_TOKENIZATION_FIRM_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].kycProviderName").value(hasItem(DEFAULT_KYC_PROVIDER_NAME)))
            .andExpect(jsonPath("$.[*].kycProviderCountry").value(hasItem(DEFAULT_KYC_PROVIDER_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].stoPrice").value(hasItem(DEFAULT_STO_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].amountRaised").value(hasItem(DEFAULT_AMOUNT_RAISED.doubleValue())))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].restrictionCounty").value(hasItem(DEFAULT_RESTRICTION_COUNTY)))
            .andExpect(jsonPath("$.[*].restrictionNationality").value(hasItem(DEFAULT_RESTRICTION_NATIONALITY)))
            .andExpect(jsonPath("$.[*].prospectusContentType").value(hasItem(DEFAULT_PROSPECTUS_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].prospectus").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROSPECTUS))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].registrationDate").value(hasItem(sameInstant(DEFAULT_REGISTRATION_DATE))))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(sameInstant(DEFAULT_UPDATE_DATE))))
            .andExpect(jsonPath("$.[*].dueDiligenceDate").value(hasItem(sameInstant(DEFAULT_DUE_DILIGENCE_DATE))))
            .andExpect(jsonPath("$.[*].lastSellingprice").value(hasItem(DEFAULT_LAST_SELLINGPRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].lastBuyingPrice").value(hasItem(DEFAULT_LAST_BUYING_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].smartcontractAddress").value(hasItem(DEFAULT_SMARTCONTRACT_ADDRESS)))
            .andExpect(jsonPath("$.[*].kycAddress").value(hasItem(DEFAULT_KYC_ADDRESS)))
            .andExpect(jsonPath("$.[*].website").value(hasItem(DEFAULT_WEBSITE)));
    }

    @Test
    @Transactional
    public void getSecurityToken() throws Exception {
        // Initialize the database
        securityTokenRepository.saveAndFlush(securityToken);

        // Get the securityToken
        restSecurityTokenMockMvc.perform(get("/api/security-tokens/{id}", securityToken.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(securityToken.getId().intValue()))
            .andExpect(jsonPath("$.idRed").value(DEFAULT_ID_RED))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.laucheDate").value(sameInstant(DEFAULT_LAUCHE_DATE)))
            .andExpect(jsonPath("$.logoContentType").value(DEFAULT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.logo").value(Base64Utils.encodeToString(DEFAULT_LOGO)))
            .andExpect(jsonPath("$.symbol").value(DEFAULT_SYMBOL))
            .andExpect(jsonPath("$.juridiction").value(DEFAULT_JURIDICTION.toString()))
            .andExpect(jsonPath("$.issuerName").value(DEFAULT_ISSUER_NAME))
            .andExpect(jsonPath("$.issuerCounty").value(DEFAULT_ISSUER_COUNTY.toString()))
            .andExpect(jsonPath("$.tokenizationFirmName").value(DEFAULT_TOKENIZATION_FIRM_NAME))
            .andExpect(jsonPath("$.tokenizationFirmCountry").value(DEFAULT_TOKENIZATION_FIRM_COUNTRY.toString()))
            .andExpect(jsonPath("$.kycProviderName").value(DEFAULT_KYC_PROVIDER_NAME))
            .andExpect(jsonPath("$.kycProviderCountry").value(DEFAULT_KYC_PROVIDER_COUNTRY.toString()))
            .andExpect(jsonPath("$.stoPrice").value(DEFAULT_STO_PRICE.doubleValue()))
            .andExpect(jsonPath("$.amountRaised").value(DEFAULT_AMOUNT_RAISED.doubleValue()))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY.toString()))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.restrictionCounty").value(DEFAULT_RESTRICTION_COUNTY))
            .andExpect(jsonPath("$.restrictionNationality").value(DEFAULT_RESTRICTION_NATIONALITY))
            .andExpect(jsonPath("$.prospectusContentType").value(DEFAULT_PROSPECTUS_CONTENT_TYPE))
            .andExpect(jsonPath("$.prospectus").value(Base64Utils.encodeToString(DEFAULT_PROSPECTUS)))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.registrationDate").value(sameInstant(DEFAULT_REGISTRATION_DATE)))
            .andExpect(jsonPath("$.updateDate").value(sameInstant(DEFAULT_UPDATE_DATE)))
            .andExpect(jsonPath("$.dueDiligenceDate").value(sameInstant(DEFAULT_DUE_DILIGENCE_DATE)))
            .andExpect(jsonPath("$.lastSellingprice").value(DEFAULT_LAST_SELLINGPRICE.doubleValue()))
            .andExpect(jsonPath("$.lastBuyingPrice").value(DEFAULT_LAST_BUYING_PRICE.doubleValue()))
            .andExpect(jsonPath("$.smartcontractAddress").value(DEFAULT_SMARTCONTRACT_ADDRESS))
            .andExpect(jsonPath("$.kycAddress").value(DEFAULT_KYC_ADDRESS))
            .andExpect(jsonPath("$.website").value(DEFAULT_WEBSITE));
    }

    @Test
    @Transactional
    public void getNonExistingSecurityToken() throws Exception {
        // Get the securityToken
        restSecurityTokenMockMvc.perform(get("/api/security-tokens/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSecurityToken() throws Exception {
        // Initialize the database
        securityTokenService.save(securityToken);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockSecurityTokenSearchRepository);

        int databaseSizeBeforeUpdate = securityTokenRepository.findAll().size();

        // Update the securityToken
        SecurityToken updatedSecurityToken = securityTokenRepository.findById(securityToken.getId()).get();
        // Disconnect from session so that the updates on updatedSecurityToken are not directly saved in db
        em.detach(updatedSecurityToken);
        updatedSecurityToken
            .idRed(UPDATED_ID_RED)
            .name(UPDATED_NAME)
            .laucheDate(UPDATED_LAUCHE_DATE)
            .logo(UPDATED_LOGO)
            .logoContentType(UPDATED_LOGO_CONTENT_TYPE)
            .symbol(UPDATED_SYMBOL)
            .juridiction(UPDATED_JURIDICTION)
            .issuerName(UPDATED_ISSUER_NAME)
            .issuerCounty(UPDATED_ISSUER_COUNTY)
            .tokenizationFirmName(UPDATED_TOKENIZATION_FIRM_NAME)
            .tokenizationFirmCountry(UPDATED_TOKENIZATION_FIRM_COUNTRY)
            .kycProviderName(UPDATED_KYC_PROVIDER_NAME)
            .kycProviderCountry(UPDATED_KYC_PROVIDER_COUNTRY)
            .stoPrice(UPDATED_STO_PRICE)
            .amountRaised(UPDATED_AMOUNT_RAISED)
            .category(UPDATED_CATEGORY)
            .summary(UPDATED_SUMMARY)
            .description(UPDATED_DESCRIPTION)
            .restrictionCounty(UPDATED_RESTRICTION_COUNTY)
            .restrictionNationality(UPDATED_RESTRICTION_NATIONALITY)
            .prospectus(UPDATED_PROSPECTUS)
            .prospectusContentType(UPDATED_PROSPECTUS_CONTENT_TYPE)
            .status(UPDATED_STATUS)
            .registrationDate(UPDATED_REGISTRATION_DATE)
            .updateDate(UPDATED_UPDATE_DATE)
            .dueDiligenceDate(UPDATED_DUE_DILIGENCE_DATE)
            .lastSellingprice(UPDATED_LAST_SELLINGPRICE)
            .lastBuyingPrice(UPDATED_LAST_BUYING_PRICE)
            .smartcontractAddress(UPDATED_SMARTCONTRACT_ADDRESS)
            .kycAddress(UPDATED_KYC_ADDRESS)
            .website(UPDATED_WEBSITE);

        restSecurityTokenMockMvc.perform(put("/api/security-tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedSecurityToken)))
            .andExpect(status().isOk());

        // Validate the SecurityToken in the database
        List<SecurityToken> securityTokenList = securityTokenRepository.findAll();
        assertThat(securityTokenList).hasSize(databaseSizeBeforeUpdate);
        SecurityToken testSecurityToken = securityTokenList.get(securityTokenList.size() - 1);
        assertThat(testSecurityToken.getIdRed()).isEqualTo(UPDATED_ID_RED);
        assertThat(testSecurityToken.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSecurityToken.getLaucheDate()).isEqualTo(UPDATED_LAUCHE_DATE);
        assertThat(testSecurityToken.getLogo()).isEqualTo(UPDATED_LOGO);
        assertThat(testSecurityToken.getLogoContentType()).isEqualTo(UPDATED_LOGO_CONTENT_TYPE);
        assertThat(testSecurityToken.getSymbol()).isEqualTo(UPDATED_SYMBOL);
        assertThat(testSecurityToken.getJuridiction()).isEqualTo(UPDATED_JURIDICTION);
        assertThat(testSecurityToken.getIssuerName()).isEqualTo(UPDATED_ISSUER_NAME);
        assertThat(testSecurityToken.getIssuerCounty()).isEqualTo(UPDATED_ISSUER_COUNTY);
        assertThat(testSecurityToken.getTokenizationFirmName()).isEqualTo(UPDATED_TOKENIZATION_FIRM_NAME);
        assertThat(testSecurityToken.getTokenizationFirmCountry()).isEqualTo(UPDATED_TOKENIZATION_FIRM_COUNTRY);
        assertThat(testSecurityToken.getKycProviderName()).isEqualTo(UPDATED_KYC_PROVIDER_NAME);
        assertThat(testSecurityToken.getKycProviderCountry()).isEqualTo(UPDATED_KYC_PROVIDER_COUNTRY);
        assertThat(testSecurityToken.getStoPrice()).isEqualTo(UPDATED_STO_PRICE);
        assertThat(testSecurityToken.getAmountRaised()).isEqualTo(UPDATED_AMOUNT_RAISED);
        assertThat(testSecurityToken.getCategory()).isEqualTo(UPDATED_CATEGORY);
        assertThat(testSecurityToken.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testSecurityToken.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testSecurityToken.getRestrictionCounty()).isEqualTo(UPDATED_RESTRICTION_COUNTY);
        assertThat(testSecurityToken.getRestrictionNationality()).isEqualTo(UPDATED_RESTRICTION_NATIONALITY);
        assertThat(testSecurityToken.getProspectus()).isEqualTo(UPDATED_PROSPECTUS);
        assertThat(testSecurityToken.getProspectusContentType()).isEqualTo(UPDATED_PROSPECTUS_CONTENT_TYPE);
        assertThat(testSecurityToken.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSecurityToken.getRegistrationDate()).isEqualTo(UPDATED_REGISTRATION_DATE);
        assertThat(testSecurityToken.getUpdateDate()).isEqualTo(UPDATED_UPDATE_DATE);
        assertThat(testSecurityToken.getDueDiligenceDate()).isEqualTo(UPDATED_DUE_DILIGENCE_DATE);
        assertThat(testSecurityToken.getLastSellingprice()).isEqualTo(UPDATED_LAST_SELLINGPRICE);
        assertThat(testSecurityToken.getLastBuyingPrice()).isEqualTo(UPDATED_LAST_BUYING_PRICE);
        assertThat(testSecurityToken.getSmartcontractAddress()).isEqualTo(UPDATED_SMARTCONTRACT_ADDRESS);
        assertThat(testSecurityToken.getKycAddress()).isEqualTo(UPDATED_KYC_ADDRESS);
        assertThat(testSecurityToken.getWebsite()).isEqualTo(UPDATED_WEBSITE);

        // Validate the SecurityToken in Elasticsearch
        verify(mockSecurityTokenSearchRepository, times(1)).save(testSecurityToken);
    }

    @Test
    @Transactional
    public void updateNonExistingSecurityToken() throws Exception {
        int databaseSizeBeforeUpdate = securityTokenRepository.findAll().size();

        // Create the SecurityToken

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSecurityTokenMockMvc.perform(put("/api/security-tokens")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(securityToken)))
            .andExpect(status().isBadRequest());

        // Validate the SecurityToken in the database
        List<SecurityToken> securityTokenList = securityTokenRepository.findAll();
        assertThat(securityTokenList).hasSize(databaseSizeBeforeUpdate);

        // Validate the SecurityToken in Elasticsearch
        verify(mockSecurityTokenSearchRepository, times(0)).save(securityToken);
    }

    @Test
    @Transactional
    public void deleteSecurityToken() throws Exception {
        // Initialize the database
        securityTokenService.save(securityToken);

        int databaseSizeBeforeDelete = securityTokenRepository.findAll().size();

        // Delete the securityToken
        restSecurityTokenMockMvc.perform(delete("/api/security-tokens/{id}", securityToken.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SecurityToken> securityTokenList = securityTokenRepository.findAll();
        assertThat(securityTokenList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the SecurityToken in Elasticsearch
        verify(mockSecurityTokenSearchRepository, times(1)).deleteById(securityToken.getId());
    }

    @Test
    @Transactional
    public void searchSecurityToken() throws Exception {
        // Initialize the database
        securityTokenService.save(securityToken);
        when(mockSecurityTokenSearchRepository.search(queryStringQuery("id:" + securityToken.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(securityToken), PageRequest.of(0, 1), 1));
        // Search the securityToken
        restSecurityTokenMockMvc.perform(get("/api/_search/security-tokens?query=id:" + securityToken.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(securityToken.getId().intValue())))
            .andExpect(jsonPath("$.[*].idRed").value(hasItem(DEFAULT_ID_RED)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].laucheDate").value(hasItem(sameInstant(DEFAULT_LAUCHE_DATE))))
            .andExpect(jsonPath("$.[*].logoContentType").value(hasItem(DEFAULT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].logo").value(hasItem(Base64Utils.encodeToString(DEFAULT_LOGO))))
            .andExpect(jsonPath("$.[*].symbol").value(hasItem(DEFAULT_SYMBOL)))
            .andExpect(jsonPath("$.[*].juridiction").value(hasItem(DEFAULT_JURIDICTION.toString())))
            .andExpect(jsonPath("$.[*].issuerName").value(hasItem(DEFAULT_ISSUER_NAME)))
            .andExpect(jsonPath("$.[*].issuerCounty").value(hasItem(DEFAULT_ISSUER_COUNTY.toString())))
            .andExpect(jsonPath("$.[*].tokenizationFirmName").value(hasItem(DEFAULT_TOKENIZATION_FIRM_NAME)))
            .andExpect(jsonPath("$.[*].tokenizationFirmCountry").value(hasItem(DEFAULT_TOKENIZATION_FIRM_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].kycProviderName").value(hasItem(DEFAULT_KYC_PROVIDER_NAME)))
            .andExpect(jsonPath("$.[*].kycProviderCountry").value(hasItem(DEFAULT_KYC_PROVIDER_COUNTRY.toString())))
            .andExpect(jsonPath("$.[*].stoPrice").value(hasItem(DEFAULT_STO_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].amountRaised").value(hasItem(DEFAULT_AMOUNT_RAISED.doubleValue())))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].restrictionCounty").value(hasItem(DEFAULT_RESTRICTION_COUNTY)))
            .andExpect(jsonPath("$.[*].restrictionNationality").value(hasItem(DEFAULT_RESTRICTION_NATIONALITY)))
            .andExpect(jsonPath("$.[*].prospectusContentType").value(hasItem(DEFAULT_PROSPECTUS_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].prospectus").value(hasItem(Base64Utils.encodeToString(DEFAULT_PROSPECTUS))))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].registrationDate").value(hasItem(sameInstant(DEFAULT_REGISTRATION_DATE))))
            .andExpect(jsonPath("$.[*].updateDate").value(hasItem(sameInstant(DEFAULT_UPDATE_DATE))))
            .andExpect(jsonPath("$.[*].dueDiligenceDate").value(hasItem(sameInstant(DEFAULT_DUE_DILIGENCE_DATE))))
            .andExpect(jsonPath("$.[*].lastSellingprice").value(hasItem(DEFAULT_LAST_SELLINGPRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].lastBuyingPrice").value(hasItem(DEFAULT_LAST_BUYING_PRICE.doubleValue())))
            .andExpect(jsonPath("$.[*].smartcontractAddress").value(hasItem(DEFAULT_SMARTCONTRACT_ADDRESS)))
            .andExpect(jsonPath("$.[*].kycAddress").value(hasItem(DEFAULT_KYC_ADDRESS)))
            .andExpect(jsonPath("$.[*].website").value(hasItem(DEFAULT_WEBSITE)));
    }
}
