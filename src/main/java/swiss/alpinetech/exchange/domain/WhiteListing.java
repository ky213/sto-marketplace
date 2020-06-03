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

import swiss.alpinetech.exchange.domain.enumeration.STATUS;

/**
 * Home page Whitelisting.\n@author Charles
 */
@ApiModel(description = "Home page Whitelisting.\n@author Charles")
@Entity
@Table(name = "white_listing")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "whitelisting")
public class WhiteListing implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_event", nullable = false)
    private ZonedDateTime dateEvent;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private STATUS status;

    @NotNull
    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "eth_address")
    private String ethAddress;

    @Column(name = "date_synch_blk")
    private ZonedDateTime dateSynchBlk;

    @Column(name = "st_name", nullable = false)
    private String stName;

    @NotNull
    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "balance")
    private Double balance;

    @ManyToOne
    @JsonIgnoreProperties("whiteListings")
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("whiteListings")
    private SecurityToken securitytoken;

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

    public WhiteListing dateEvent(ZonedDateTime dateEvent) {
        this.dateEvent = dateEvent;
        return this;
    }

    public void setDateEvent(ZonedDateTime dateEvent) {
        this.dateEvent = dateEvent;
    }

    public STATUS getStatus() {
        return status;
    }

    public WhiteListing status(STATUS status) {
        this.status = status;
        return this;
    }

    public void setStatus(STATUS status) {
        this.status = status;
    }

    public Boolean isActive() {
        return active;
    }

    public WhiteListing active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getEthAddress() {
        return ethAddress;
    }

    public WhiteListing ethAddress(String ethAddress) {
        this.ethAddress = ethAddress;
        return this;
    }

    public void setEthAddress(String ethAddress) {
        this.ethAddress = ethAddress;
    }

    public ZonedDateTime getDateSynchBlk() {
        return dateSynchBlk;
    }

    public WhiteListing dateSynchBlk(ZonedDateTime dateSynchBlk) {
        this.dateSynchBlk = dateSynchBlk;
        return this;
    }

    public void setDateSynchBlk(ZonedDateTime dateSynchBlk) {
        this.dateSynchBlk = dateSynchBlk;
    }

    public String getStName() {
        return stName;
    }

    public WhiteListing stName(String stName) {
        this.stName = stName;
        return this;
    }

    public void setStName(String stName) {
        this.stName = stName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public WhiteListing customerName(String customerName) {
        this.customerName = customerName;
        return this;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getBalance() {
        return balance;
    }

    public WhiteListing balance(Double balance) {
        this.balance = balance;
        return this;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public User getUser() {
        return user;
    }

    public WhiteListing user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SecurityToken getSecuritytoken() {
        return securitytoken;
    }

    public WhiteListing securitytoken(SecurityToken securityToken) {
        this.securitytoken = securityToken;
        return this;
    }

    public void setSecuritytoken(SecurityToken securityToken) {
        this.securitytoken = securityToken;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WhiteListing)) {
            return false;
        }
        return id != null && id.equals(((WhiteListing) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "WhiteListing{" +
            "id=" + getId() +
            ", dateEvent='" + getDateEvent() + "'" +
            ", status='" + getStatus() + "'" +
            ", active='" + isActive() + "'" +
            ", ethAddress='" + getEthAddress() + "'" +
            ", dateSynchBlk='" + getDateSynchBlk() + "'" +
            ", stName='" + getStName() + "'" +
            ", customerName='" + getCustomerName() + "'" +
            ", balance=" + getBalance() +
            "}";
    }
}
