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
 * Home page Bank.\n@author Charles
 */
@ApiModel(description = "Home page Bank.\n@author Charles")
@Entity
@Table(name = "home_bank")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "homebank")
public class HomeBank implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "date_event", nullable = false)
    private ZonedDateTime dateEvent;

    @NotNull
    @Column(name = "custody_balance", nullable = false)
    private Double custodyBalance;

    @NotNull
    @Column(name = "total_user", nullable = false)
    private Integer totalUser;

    @Column(name = "volume_order")
    private Double volumeOrder;

    @Column(name = "total_revenu")
    private Double totalRevenu;

    @Column(name = "equity_allocation")
    private Float equityAllocation;

    @Column(name = "funds_allocation")
    private Float fundsAllocation;

    @Column(name = "real_estate_allocation")
    private Float realEstateAllocation;

    @Column(name = "derivative_allocation")
    private Float derivativeAllocation;

    @ManyToOne
    @JsonIgnoreProperties("homeBanks")
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

    public HomeBank dateEvent(ZonedDateTime dateEvent) {
        this.dateEvent = dateEvent;
        return this;
    }

    public void setDateEvent(ZonedDateTime dateEvent) {
        this.dateEvent = dateEvent;
    }

    public Double getCustodyBalance() {
        return custodyBalance;
    }

    public HomeBank custodyBalance(Double custodyBalance) {
        this.custodyBalance = custodyBalance;
        return this;
    }

    public void setCustodyBalance(Double custodyBalance) {
        this.custodyBalance = custodyBalance;
    }

    public Integer getTotalUser() {
        return totalUser;
    }

    public HomeBank totalUser(Integer totalUser) {
        this.totalUser = totalUser;
        return this;
    }

    public void setTotalUser(Integer totalUser) {
        this.totalUser = totalUser;
    }

    public Double getVolumeOrder() {
        return volumeOrder;
    }

    public HomeBank volumeOrder(Double volumeOrder) {
        this.volumeOrder = volumeOrder;
        return this;
    }

    public void setVolumeOrder(Double volumeOrder) {
        this.volumeOrder = volumeOrder;
    }

    public Double getTotalRevenu() {
        return totalRevenu;
    }

    public HomeBank totalRevenu(Double totalRevenu) {
        this.totalRevenu = totalRevenu;
        return this;
    }

    public void setTotalRevenu(Double totalRevenu) {
        this.totalRevenu = totalRevenu;
    }

    public Float getEquityAllocation() {
        return equityAllocation;
    }

    public HomeBank equityAllocation(Float equityAllocation) {
        this.equityAllocation = equityAllocation;
        return this;
    }

    public void setEquityAllocation(Float equityAllocation) {
        this.equityAllocation = equityAllocation;
    }

    public Float getFundsAllocation() {
        return fundsAllocation;
    }

    public HomeBank fundsAllocation(Float fundsAllocation) {
        this.fundsAllocation = fundsAllocation;
        return this;
    }

    public void setFundsAllocation(Float fundsAllocation) {
        this.fundsAllocation = fundsAllocation;
    }

    public Float getRealEstateAllocation() {
        return realEstateAllocation;
    }

    public HomeBank realEstateAllocation(Float realEstateAllocation) {
        this.realEstateAllocation = realEstateAllocation;
        return this;
    }

    public void setRealEstateAllocation(Float realEstateAllocation) {
        this.realEstateAllocation = realEstateAllocation;
    }

    public Float getDerivativeAllocation() {
        return derivativeAllocation;
    }

    public HomeBank derivativeAllocation(Float derivativeAllocation) {
        this.derivativeAllocation = derivativeAllocation;
        return this;
    }

    public void setDerivativeAllocation(Float derivativeAllocation) {
        this.derivativeAllocation = derivativeAllocation;
    }

    public User getUser() {
        return user;
    }

    public HomeBank user(User user) {
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
        if (!(o instanceof HomeBank)) {
            return false;
        }
        return id != null && id.equals(((HomeBank) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "HomeBank{" +
            "id=" + getId() +
            ", dateEvent='" + getDateEvent() + "'" +
            ", custodyBalance=" + getCustodyBalance() +
            ", totalUser=" + getTotalUser() +
            ", volumeOrder=" + getVolumeOrder() +
            ", totalRevenu=" + getTotalRevenu() +
            ", equityAllocation=" + getEquityAllocation() +
            ", fundsAllocation=" + getFundsAllocation() +
            ", realEstateAllocation=" + getRealEstateAllocation() +
            ", derivativeAllocation=" + getDerivativeAllocation() +
            "}";
    }
}
