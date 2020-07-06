package swiss.alpinetech.exchange.service.dto;

import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;
import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;
import swiss.alpinetech.exchange.domain.enumeration.STSTATUS;

import java.io.Serializable;
import java.util.Objects;

public class SecurityTokenDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public SecurityTokenDTO() {}

    public SecurityTokenDTO(SecurityToken securityToken) {
        this.id = securityToken.getId();
        this.idRed = securityToken.getIdRed();
        this.name = securityToken.getName();
        this.symbol = securityToken.getSymbol();
        this.juridiction = securityToken.getJuridiction();
        this.issuerName = securityToken.getIssuerName();
        this.issuerCounty = securityToken.getIssuerCounty();
        this.tokenizationFirmName = securityToken.getTokenizationFirmName();
        this.tokenizationFirmCountry = securityToken.getTokenizationFirmCountry();
        this.kycProviderName = securityToken.getKycProviderName();
        this.kycProviderCountry = securityToken.getKycProviderCountry();
        this.stoPrice = securityToken.getStoPrice();
        this.amountRaised = securityToken.getAmountRaised();
        this.category = securityToken.getCategory();
        this.summary = securityToken.getSummary();
        this.description = securityToken.getDescription();
        this.restrictionCounty = securityToken.getRestrictionCounty();
        this.restrictionNationality = securityToken.getRestrictionNationality();
        this.prospectusContentType = securityToken.getProspectusContentType();
        this.status = securityToken.getStatus();
        this.lastSellingprice = securityToken.getLastSellingprice();
        this.lastBuyingPrice = securityToken.getLastBuyingPrice();
        this.smartcontractAddress = securityToken.getSmartcontractAddress();
        this.kycAddress = securityToken.getKycAddress();
        this.website = securityToken.getWebsite();
    }

    private Long id;

    private String idRed;

    private String name;

    private String symbol;

    private COUNTRY juridiction;

    private String issuerName;

    private COUNTRY issuerCounty;

    private String tokenizationFirmName;

    private COUNTRY tokenizationFirmCountry;

    private String kycProviderName;

    private COUNTRY kycProviderCountry;

    private Double stoPrice;

    private Double amountRaised;

    private CATEGORY category;

    private String summary;

    private String description;

    private String restrictionCounty;

    private String restrictionNationality;

    private String prospectusContentType;

    private STSTATUS status;

    private Double lastSellingprice;

    private Double lastBuyingPrice;

    private String smartcontractAddress;

    private String kycAddress;

    private String website;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdRed() {
        return idRed;
    }

    public void setIdRed(String idRed) {
        this.idRed = idRed;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public COUNTRY getJuridiction() {
        return juridiction;
    }

    public void setJuridiction(COUNTRY juridiction) {
        this.juridiction = juridiction;
    }

    public String getIssuerName() {
        return issuerName;
    }

    public void setIssuerName(String issuerName) {
        this.issuerName = issuerName;
    }

    public COUNTRY getIssuerCounty() {
        return issuerCounty;
    }

    public void setIssuerCounty(COUNTRY issuerCounty) {
        this.issuerCounty = issuerCounty;
    }

    public String getTokenizationFirmName() {
        return tokenizationFirmName;
    }

    public void setTokenizationFirmName(String tokenizationFirmName) {
        this.tokenizationFirmName = tokenizationFirmName;
    }

    public COUNTRY getTokenizationFirmCountry() {
        return tokenizationFirmCountry;
    }

    public void setTokenizationFirmCountry(COUNTRY tokenizationFirmCountry) {
        this.tokenizationFirmCountry = tokenizationFirmCountry;
    }

    public String getKycProviderName() {
        return kycProviderName;
    }

    public void setKycProviderName(String kycProviderName) {
        this.kycProviderName = kycProviderName;
    }

    public COUNTRY getKycProviderCountry() {
        return kycProviderCountry;
    }

    public void setKycProviderCountry(COUNTRY kycProviderCountry) {
        this.kycProviderCountry = kycProviderCountry;
    }

    public Double getStoPrice() {
        return stoPrice;
    }

    public void setStoPrice(Double stoPrice) {
        this.stoPrice = stoPrice;
    }

    public Double getAmountRaised() {
        return amountRaised;
    }

    public void setAmountRaised(Double amountRaised) {
        this.amountRaised = amountRaised;
    }

    public CATEGORY getCategory() {
        return category;
    }

    public void setCategory(CATEGORY category) {
        this.category = category;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRestrictionCounty() {
        return restrictionCounty;
    }

    public void setRestrictionCounty(String restrictionCounty) {
        this.restrictionCounty = restrictionCounty;
    }

    public String getRestrictionNationality() {
        return restrictionNationality;
    }

    public void setRestrictionNationality(String restrictionNationality) {
        this.restrictionNationality = restrictionNationality;
    }

    public String getProspectusContentType() {
        return prospectusContentType;
    }

    public void setProspectusContentType(String prospectusContentType) {
        this.prospectusContentType = prospectusContentType;
    }

    public STSTATUS getStatus() {
        return status;
    }

    public void setStatus(STSTATUS status) {
        this.status = status;
    }

    public Double getLastSellingprice() {
        return lastSellingprice;
    }

    public void setLastSellingprice(Double lastSellingprice) {
        this.lastSellingprice = lastSellingprice;
    }

    public Double getLastBuyingPrice() {
        return lastBuyingPrice;
    }

    public void setLastBuyingPrice(Double lastBuyingPrice) {
        this.lastBuyingPrice = lastBuyingPrice;
    }

    public String getSmartcontractAddress() {
        return smartcontractAddress;
    }

    public void setSmartcontractAddress(String smartcontractAddress) {
        this.smartcontractAddress = smartcontractAddress;
    }

    public String getKycAddress() {
        return kycAddress;
    }

    public void setKycAddress(String kycAddress) {
        this.kycAddress = kycAddress;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SecurityTokenDTO that = (SecurityTokenDTO) o;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
