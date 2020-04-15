package swiss.alpinetech.exchange.domain;

import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;

import swiss.alpinetech.exchange.domain.enumeration.COUNTRY;

/**
 * Home page Bank Info.\n@author Charles
 */
@ApiModel(description = "Home page Bank Info.\n@author Charles")
@Entity
@Table(name = "bank_info")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "bankinfo")
public class BankInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Lob
    @Column(name = "logo")
    private byte[] logo;

    @Column(name = "logo_content_type")
    private String logoContentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "country")
    private COUNTRY country;

    @Size(min = 10, max = 12)
    @Column(name = "bic_number", length = 12)
    private String bicNumber;

    @Size(min = 14, max = 35)
    @Column(name = "omnibus_account", length = 35)
    private String omnibusAccount;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "fixed_fee", nullable = false)
    private Double fixedFee;

    @NotNull
    @DecimalMin(value = "0")
    @DecimalMax(value = "100")
    @Column(name = "percent_fee", nullable = false)
    private Float percentFee;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBankName() {
        return bankName;
    }

    public BankInfo bankName(String bankName) {
        this.bankName = bankName;
        return this;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public byte[] getLogo() {
        return logo;
    }

    public BankInfo logo(byte[] logo) {
        this.logo = logo;
        return this;
    }

    public void setLogo(byte[] logo) {
        this.logo = logo;
    }

    public String getLogoContentType() {
        return logoContentType;
    }

    public BankInfo logoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
        return this;
    }

    public void setLogoContentType(String logoContentType) {
        this.logoContentType = logoContentType;
    }

    public COUNTRY getCountry() {
        return country;
    }

    public BankInfo country(COUNTRY country) {
        this.country = country;
        return this;
    }

    public void setCountry(COUNTRY country) {
        this.country = country;
    }

    public String getBicNumber() {
        return bicNumber;
    }

    public BankInfo bicNumber(String bicNumber) {
        this.bicNumber = bicNumber;
        return this;
    }

    public void setBicNumber(String bicNumber) {
        this.bicNumber = bicNumber;
    }

    public String getOmnibusAccount() {
        return omnibusAccount;
    }

    public BankInfo omnibusAccount(String omnibusAccount) {
        this.omnibusAccount = omnibusAccount;
        return this;
    }

    public void setOmnibusAccount(String omnibusAccount) {
        this.omnibusAccount = omnibusAccount;
    }

    public Double getFixedFee() {
        return fixedFee;
    }

    public BankInfo fixedFee(Double fixedFee) {
        this.fixedFee = fixedFee;
        return this;
    }

    public void setFixedFee(Double fixedFee) {
        this.fixedFee = fixedFee;
    }

    public Float getPercentFee() {
        return percentFee;
    }

    public BankInfo percentFee(Float percentFee) {
        this.percentFee = percentFee;
        return this;
    }

    public void setPercentFee(Float percentFee) {
        this.percentFee = percentFee;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof BankInfo)) {
            return false;
        }
        return id != null && id.equals(((BankInfo) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "BankInfo{" +
            "id=" + getId() +
            ", bankName='" + getBankName() + "'" +
            ", logo='" + getLogo() + "'" +
            ", logoContentType='" + getLogoContentType() + "'" +
            ", country='" + getCountry() + "'" +
            ", bicNumber='" + getBicNumber() + "'" +
            ", omnibusAccount='" + getOmnibusAccount() + "'" +
            ", fixedFee=" + getFixedFee() +
            ", percentFee=" + getPercentFee() +
            "}";
    }
}
