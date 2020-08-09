package swiss.alpinetech.exchange.domain;

import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;

import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;

import swiss.alpinetech.exchange.domain.enumeration.STSTATUS;

/**
 * Security Token.\n@author Charles
 */
@ApiModel(description = "Security Token.\n@author Charles")
@Entity
@Table(name = "security_token")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "securitytoken")
public class SecurityToken implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 2, max = 15)
    @Column(name = "id_red", length = 15)
    private String idRed;

    @NotNull
    @Size(min = 2, max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Column(name = "lauche_date")
    private ZonedDateTime laucheDate;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @NotNull
    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Enumerated(EnumType.STRING)
    @Column(name = "juridiction")
    private COUNTRY juridiction;

    @Column(name = "issuer_name")
    private String issuerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "issuer_county")
    private COUNTRY issuerCounty;

    @Column(name = "tokenization_firm_name")
    private String tokenizationFirmName;

    @Enumerated(EnumType.STRING)
    @Column(name = "tokenization_firm_country")
    private COUNTRY tokenizationFirmCountry;

    @Column(name = "kyc_provider_name")
    private String kycProviderName;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_provider_country")
    private COUNTRY kycProviderCountry;

    @DecimalMin(value = "0")
    @Column(name = "sto_price")
    private Double stoPrice;

    @DecimalMin(value = "0")
    @Column(name = "amount_raised")
    private Double amountRaised;

    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private CATEGORY category;

    @NotNull
    @Size(max = 1024)
    @Column(name = "summary", length = 1024, nullable = false)
    private String summary;

    @Size(max = 4096)
    @Column(name = "description", length = 4096)
    private String description;

    @Column(name = "restriction_county")
    private String restrictionCounty;

    @Column(name = "restriction_nationality")
    private String restrictionNationality;

    @Lob
    @Column(name = "prospectus")
    private byte[] prospectus;

    @Column(name = "prospectus_content_type")
    private String prospectusContentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private STSTATUS status;

    @Column(name = "registration_date")
    private ZonedDateTime registrationDate;

    @Column(name = "update_date")
    private ZonedDateTime updateDate;

    @Column(name = "due_diligence_date")
    private ZonedDateTime dueDiligenceDate;

    @DecimalMin(value = "0")
    @Column(name = "last_sellingprice")
    private Double lastSellingprice;

    @DecimalMin(value = "0")
    @Column(name = "last_buying_price")
    private Double lastBuyingPrice;

    @Column(name = "smartcontract_address")
    private String smartcontractAddress;

    @Column(name = "kyc_address")
    private String kycAddress;

    @Column(name = "website")
    private String website;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdRed() {
        return idRed;
    }

    public SecurityToken idRed(String idRed) {
        this.idRed = idRed;
        return this;
    }

    public void setIdRed(String idRed) {
        this.idRed = idRed;
    }

    public String getName() {
        return name;
    }

    public SecurityToken name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ZonedDateTime getLaucheDate() {
        return laucheDate;
    }

    public SecurityToken laucheDate(ZonedDateTime laucheDate) {
        this.laucheDate = laucheDate;
        return this;
    }

    public void setLaucheDate(ZonedDateTime laucheDate) {
        this.laucheDate = laucheDate;
    }

    public byte[] getLogo() {
        return logo;
    }

    public SecurityToken logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return logoContentType;
    }

    public SecurityToken logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public String getSymbol() {
        return symbol;
    }

    public SecurityToken symbol(String symbol) {
        this.symbol = symbol;
        return this;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public COUNTRY getJuridiction() {
        return juridiction;
    }

    public SecurityToken juridiction(COUNTRY juridiction) {
        this.juridiction = juridiction;
        return this;
    }

    public void setJuridiction(COUNTRY juridiction) {
        this.juridiction = juridiction;
    }

    public String getIssuerName() {
        return issuerName;
    }

    public SecurityToken issuerName(String issuerName) {
        this.issuerName = issuerName;
        return this;
    }

    public void setIssuerName(String issuerName) {
        this.issuerName = issuerName;
    }

    public COUNTRY getIssuerCounty() {
        return issuerCounty;
    }

    public SecurityToken issuerCounty(COUNTRY issuerCounty) {
        this.issuerCounty = issuerCounty;
        return this;
    }

    public void setIssuerCounty(COUNTRY issuerCounty) {
        this.issuerCounty = issuerCounty;
    }

    public String getTokenizationFirmName() {
        return tokenizationFirmName;
    }

    public SecurityToken tokenizationFirmName(String tokenizationFirmName) {
        this.tokenizationFirmName = tokenizationFirmName;
        return this;
    }

    public void setTokenizationFirmName(String tokenizationFirmName) {
        this.tokenizationFirmName = tokenizationFirmName;
    }

    public COUNTRY getTokenizationFirmCountry() {
        return tokenizationFirmCountry;
    }

    public SecurityToken tokenizationFirmCountry(COUNTRY tokenizationFirmCountry) {
        this.tokenizationFirmCountry = tokenizationFirmCountry;
        return this;
    }

    public void setTokenizationFirmCountry(COUNTRY tokenizationFirmCountry) {
        this.tokenizationFirmCountry = tokenizationFirmCountry;
    }

    public String getKycProviderName() {
        return kycProviderName;
    }

    public SecurityToken kycProviderName(String kycProviderName) {
        this.kycProviderName = kycProviderName;
        return this;
    }

    public void setKycProviderName(String kycProviderName) {
        this.kycProviderName = kycProviderName;
    }

    public COUNTRY getKycProviderCountry() {
        return kycProviderCountry;
    }

    public SecurityToken kycProviderCountry(COUNTRY kycProviderCountry) {
        this.kycProviderCountry = kycProviderCountry;
        return this;
    }

    public void setKycProviderCountry(COUNTRY kycProviderCountry) {
        this.kycProviderCountry = kycProviderCountry;
    }

    public Double getStoPrice() {
        return stoPrice;
    }

    public SecurityToken stoPrice(Double stoPrice) {
        this.stoPrice = stoPrice;
        return this;
    }

    public void setStoPrice(Double stoPrice) {
        this.stoPrice = stoPrice;
    }

    public Double getAmountRaised() {
        return amountRaised;
    }

    public SecurityToken amountRaised(Double amountRaised) {
        this.amountRaised = amountRaised;
        return this;
    }

    public void setAmountRaised(Double amountRaised) {
        this.amountRaised = amountRaised;
    }

    public CATEGORY getCategory() {
        return category;
    }

    public SecurityToken category(CATEGORY category) {
        this.category = category;
        return this;
    }

    public void setCategory(CATEGORY category) {
        this.category = category;
    }

    public String getSummary() {
        return summary;
    }

    public SecurityToken summary(String summary) {
        this.summary = summary;
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDescription() {
        return description;
    }

    public SecurityToken description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRestrictionCounty() {
        return restrictionCounty;
    }

    public SecurityToken restrictionCounty(String restrictionCounty) {
        this.restrictionCounty = restrictionCounty;
        return this;
    }

    public void setRestrictionCounty(String restrictionCounty) {
        this.restrictionCounty = restrictionCounty;
    }

    public String getRestrictionNationality() {
        return restrictionNationality;
    }

    public SecurityToken restrictionNationality(String restrictionNationality) {
        this.restrictionNationality = restrictionNationality;
        return this;
    }

    public void setRestrictionNationality(String restrictionNationality) {
        this.restrictionNationality = restrictionNationality;
    }

    public byte[] getProspectus() {
        return prospectus;
    }

    public SecurityToken prospectus(byte[] prospectus) {
        this.prospectus = prospectus;
        return this;
    }

    public void setProspectus(byte[] prospectus) {
        this.prospectus = prospectus;
    }

    public String getProspectusContentType() {
        return prospectusContentType;
    }

    public SecurityToken prospectusContentType(String prospectusContentType) {
        this.prospectusContentType = prospectusContentType;
        return this;
    }

    public void setProspectusContentType(String prospectusContentType) {
        this.prospectusContentType = prospectusContentType;
    }

    public STSTATUS getStatus() {
        return status;
    }

    public SecurityToken status(STSTATUS status) {
        this.status = status;
        return this;
    }

    public void setStatus(STSTATUS status) {
        this.status = status;
    }

    public ZonedDateTime getRegistrationDate() {
        return registrationDate;
    }

    public SecurityToken registrationDate(ZonedDateTime registrationDate) {
        this.registrationDate = registrationDate;
        return this;
    }

    public void setRegistrationDate(ZonedDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public ZonedDateTime getUpdateDate() {
        return updateDate;
    }

    public SecurityToken updateDate(ZonedDateTime updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(ZonedDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public ZonedDateTime getDueDiligenceDate() {
        return dueDiligenceDate;
    }

    public SecurityToken dueDiligenceDate(ZonedDateTime dueDiligenceDate) {
        this.dueDiligenceDate = dueDiligenceDate;
        return this;
    }

    public void setDueDiligenceDate(ZonedDateTime dueDiligenceDate) {
        this.dueDiligenceDate = dueDiligenceDate;
    }

    public Double getLastSellingprice() {
        return lastSellingprice;
    }

    public SecurityToken lastSellingprice(Double lastSellingprice) {
        this.lastSellingprice = lastSellingprice;
        return this;
    }

    public void setLastSellingprice(Double lastSellingprice) {
        this.lastSellingprice = lastSellingprice;
    }

    public Double getLastBuyingPrice() {
        return lastBuyingPrice;
    }

    public SecurityToken lastBuyingPrice(Double lastBuyingPrice) {
        this.lastBuyingPrice = lastBuyingPrice;
        return this;
    }

    public void setLastBuyingPrice(Double lastBuyingPrice) {
        this.lastBuyingPrice = lastBuyingPrice;
    }

    public String getSmartcontractAddress() {
        return smartcontractAddress;
    }

    public SecurityToken smartcontractAddress(String smartcontractAddress) {
        this.smartcontractAddress = smartcontractAddress;
        return this;
    }

    public void setSmartcontractAddress(String smartcontractAddress) {
        this.smartcontractAddress = smartcontractAddress;
    }

    public String getKycAddress() {
        return kycAddress;
    }

    public SecurityToken kycAddress(String kycAddress) {
        this.kycAddress = kycAddress;
        return this;
    }

    public void setKycAddress(String kycAddress) {
        this.kycAddress = kycAddress;
    }

    public String getWebsite() {
        return website;
    }

    public SecurityToken website(String website) {
        this.website = website;
        return this;
    }

    public void setWebsite(String website) {
        this.website = website;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SecurityToken)) {
            return false;
        }
        return id != null && id.equals(((SecurityToken) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "SecurityToken{" +
            "id=" + getId() +
            ", idRed='" + getIdRed() + "'" +
            ", name='" + getName() + "'" +
            ", laucheDate='" + getLaucheDate() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", symbol='" + getSymbol() + "'" +
            ", juridiction='" + getJuridiction() + "'" +
            ", issuerName='" + getIssuerName() + "'" +
            ", issuerCounty='" + getIssuerCounty() + "'" +
            ", tokenizationFirmName='" + getTokenizationFirmName() + "'" +
            ", tokenizationFirmCountry='" + getTokenizationFirmCountry() + "'" +
            ", kycProviderName='" + getKycProviderName() + "'" +
            ", kycProviderCountry='" + getKycProviderCountry() + "'" +
            ", stoPrice=" + getStoPrice() +
            ", amountRaised=" + getAmountRaised() +
            ", category='" + getCategory() + "'" +
            ", summary='" + getSummary() + "'" +
            ", description='" + getDescription() + "'" +
            ", restrictionCounty='" + getRestrictionCounty() + "'" +
            ", restrictionNationality='" + getRestrictionNationality() + "'" +
            ", prospectus='" + getProspectus() + "'" +
            ", prospectusContentType='" + getProspectusContentType() + "'" +
            ", status='" + getStatus() + "'" +
            ", registrationDate='" + getRegistrationDate() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", dueDiligenceDate='" + getDueDiligenceDate() + "'" +
            ", lastSellingprice=" + getLastSellingprice() +
            ", lastBuyingPrice=" + getLastBuyingPrice() +
            ", smartcontractAddress='" + getSmartcontractAddress() + "'" +
            ", kycAddress='" + getKycAddress() + "'" +
            ", website='" + getWebsite() + "'" +
            "}";
    }
}
