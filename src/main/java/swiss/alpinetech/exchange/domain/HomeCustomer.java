package swiss.alpinetech.exchange.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

/**
 * Home page Customer.\n@author Charles
 */
@ApiModel(description = "Home page Customer.\n@author Charles")
@Entity
@Table(name = "home_customer")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "homecustomer")
public class HomeCustomer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date_event", nullable = false)
    private ZonedDateTime dateEvent;

    @NotNull
    @Column(name = "token_balance", nullable = false)
    private Double tokenBalance;

    @Column(name = "bigest_token_name")
    private String bigestTokenName;

    @Column(name = "bigest_token_value")
    private Double bigestTokenValue;

    @Column(name = "second_token_name")
    private String secondTokenName;

    @Column(name = "second_token_value")
    private Double secondTokenValue;

    @NotNull
    @Column(name = "bank_balance", nullable = false)
    private Double bankBalance;

    @Column(name = "equity_allocation")
    private Float equityAllocation;

    @Column(name = "funds_allocation")
    private Float fundsAllocation;

    @Column(name = "real_estate_allocation")
    private Float realEstateAllocation;

    @Column(name = "derivative_allocation")
    private Float derivativeAllocation;

    @ManyToOne
    @JsonIgnoreProperties("homeCustomers")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDateEvent() {
        return dateEvent;
    }

    public HomeCustomer dateEvent(ZonedDateTime dateEvent) {
        this.dateEvent = dateEvent;
        return this;
    }

    public void setDateEvent(ZonedDateTime dateEvent) {
        this.dateEvent = dateEvent;
    }

    public Double getTokenBalance() {
        return tokenBalance;
    }

    public HomeCustomer tokenBalance(Double tokenBalance) {
        this.tokenBalance = tokenBalance;
        return this;
    }

    public void setTokenBalance(Double tokenBalance) {
        this.tokenBalance = tokenBalance;
    }

    public String getBigestTokenName() {
        return bigestTokenName;
    }

    public HomeCustomer bigestTokenName(String bigestTokenName) {
        this.bigestTokenName = bigestTokenName;
        return this;
    }

    public void setBigestTokenName(String bigestTokenName) {
        this.bigestTokenName = bigestTokenName;
    }

    public Double getBigestTokenValue() {
        return bigestTokenValue;
    }

    public HomeCustomer bigestTokenValue(Double bigestTokenValue) {
        this.bigestTokenValue = bigestTokenValue;
        return this;
    }

    public void setBigestTokenValue(Double bigestTokenValue) {
        this.bigestTokenValue = bigestTokenValue;
    }

    public String getSecondTokenName() {
        return secondTokenName;
    }

    public HomeCustomer secondTokenName(String secondTokenName) {
        this.secondTokenName = secondTokenName;
        return this;
    }

    public void setSecondTokenName(String secondTokenName) {
        this.secondTokenName = secondTokenName;
    }

    public Double getSecondTokenValue() {
        return secondTokenValue;
    }

    public HomeCustomer secondTokenValue(Double secondTokenValue) {
        this.secondTokenValue = secondTokenValue;
        return this;
    }

    public void setSecondTokenValue(Double secondTokenValue) {
        this.secondTokenValue = secondTokenValue;
    }

    public Double getBankBalance() {
        return bankBalance;
    }

    public HomeCustomer bankBalance(Double bankBalance) {
        this.bankBalance = bankBalance;
        return this;
    }

    public void setBankBalance(Double bankBalance) {
        this.bankBalance = bankBalance;
    }

    public Float getEquityAllocation() {
        return equityAllocation;
    }

    public HomeCustomer equityAllocation(Float equityAllocation) {
        this.equityAllocation = equityAllocation;
        return this;
    }

    public void setEquityAllocation(Float equityAllocation) {
        this.equityAllocation = equityAllocation;
    }

    public Float getFundsAllocation() {
        return fundsAllocation;
    }

    public HomeCustomer fundsAllocation(Float fundsAllocation) {
        this.fundsAllocation = fundsAllocation;
        return this;
    }

    public void setFundsAllocation(Float fundsAllocation) {
        this.fundsAllocation = fundsAllocation;
    }

    public Float getRealEstateAllocation() {
        return realEstateAllocation;
    }

    public HomeCustomer realEstateAllocation(Float realEstateAllocation) {
        this.realEstateAllocation = realEstateAllocation;
        return this;
    }

    public void setRealEstateAllocation(Float realEstateAllocation) {
        this.realEstateAllocation = realEstateAllocation;
    }

    public Float getDerivativeAllocation() {
        return derivativeAllocation;
    }

    public HomeCustomer derivativeAllocation(Float derivativeAllocation) {
        this.derivativeAllocation = derivativeAllocation;
        return this;
    }

    public void setDerivativeAllocation(Float derivativeAllocation) {
        this.derivativeAllocation = derivativeAllocation;
    }

    public User getUser() {
        return user;
    }

    public HomeCustomer user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HomeCustomer)) {
            return false;
        }
        return id != null && id.equals(((HomeCustomer) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "HomeCustomer{" +
            "id=" + getId() +
            ", dateEvent='" + getDateEvent() + "'" +
            ", tokenBalance=" + getTokenBalance() +
            ", bigestTokenName='" + getBigestTokenName() + "'" +
            ", bigestTokenValue=" + getBigestTokenValue() +
            ", secondTokenName='" + getSecondTokenName() + "'" +
            ", secondTokenValue=" + getSecondTokenValue() +
            ", bankBalance=" + getBankBalance() +
            ", equityAllocation=" + getEquityAllocation() +
            ", fundsAllocation=" + getFundsAllocation() +
            ", realEstateAllocation=" + getRealEstateAllocation() +
            ", derivativeAllocation=" + getDerivativeAllocation() +
            "}";
    }
}
