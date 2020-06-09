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

import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;

import swiss.alpinetech.exchange.domain.enumeration.ORDERTYPE;

import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;

import swiss.alpinetech.exchange.domain.enumeration.STATUS;

/**
 * Order\n@author Charles
 */
@ApiModel(description = "Order\n@author Charles")
@Entity
@Table(name = "jhi_order")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "order")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "id_order", nullable = false)
    private String idOrder;

    @Column(name = "ref_order", nullable = false)
    private Long refOrder;

    @Column(name = "securitytoken_name", nullable = false)
    private String securityTokenName;

    @Column(name = "create_date", nullable = false)
    private ZonedDateTime createDate;

    @Column(name = "update_date")
    private ZonedDateTime updateDate;

    @Column(name = "close_date")
    private ZonedDateTime closeDate;

    @NotNull
    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private ACTIONTYPE type;

    @Enumerated(EnumType.STRING)
    @Column(name = "limit_or_market")
    private ORDERTYPE limitOrMarket;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "volume", nullable = false)
    private Double volume;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "price", nullable = false)
    private Double price;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_token")
    private CATEGORY categoryToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private STATUS status;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "securitytoken_id", referencedColumnName = "id", updatable = false)
    @JsonIgnoreProperties("orders")
    private SecurityToken securityToken;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", updatable = false)
    @JsonIgnoreProperties("orders")
    private User user;

    @ManyToOne
    @JsonIgnoreProperties("orders")
    private Transaction transaction;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdOrder() {
        return idOrder;
    }

    public Order idOrder(String idOrder) {
        this.idOrder = idOrder;
        return this;
    }

    public void setIdOrder(String idOrder) {
        this.idOrder = idOrder;
    }

    public String getSecurityTokenName() {
        return securityTokenName;
    }

    public Order securityTokenName(String securityTokenName) {
        this.securityTokenName = securityTokenName;
        return this;
    }

    public void setSecurityTokenName(String securityTokenName) {
        this.securityTokenName = securityTokenName;
    }

    public Long getRefOrder() {
        return refOrder;
    }

    public Order refOrder(Long refOrder) {
        this.refOrder = refOrder;
        return this;
    }

    public void setRefOrder(Long refOrder) {
        this.refOrder = refOrder;
    }

    public ZonedDateTime getCreateDate() {
        return createDate;
    }

    public Order createDate(ZonedDateTime createDate) {
        this.createDate = createDate;
        return this;
    }

    public void setCreateDate(ZonedDateTime createDate) {
        this.createDate = createDate;
    }

    public ZonedDateTime getUpdateDate() {
        return updateDate;
    }

    public Order updateDate(ZonedDateTime updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(ZonedDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public ZonedDateTime getCloseDate() {
        return closeDate;
    }

    public Order closeDate(ZonedDateTime closeDate) {
        this.closeDate = closeDate;
        return this;
    }

    public void setCloseDate(ZonedDateTime closeDate) {
        this.closeDate = closeDate;
    }

    public String getSymbol() {
        return symbol;
    }

    public Order symbol(String symbol) {
        this.symbol = symbol;
        return this;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public ACTIONTYPE getType() {
        return type;
    }

    public Order type(ACTIONTYPE type) {
        this.type = type;
        return this;
    }

    public void setType(ACTIONTYPE type) {
        this.type = type;
    }

    public ORDERTYPE getLimitOrMarket() {
        return limitOrMarket;
    }

    public Order limitOrMarket(ORDERTYPE limitOrMarket) {
        this.limitOrMarket = limitOrMarket;
        return this;
    }

    public void setLimitOrMarket(ORDERTYPE limitOrMarket) {
        this.limitOrMarket = limitOrMarket;
    }

    public Double getVolume() {
        return volume;
    }

    public Order volume(Double volume) {
        this.volume = volume;
        return this;
    }

    public void setVolume(Double volume) {
        this.volume = volume;
    }

    public Double getPrice() {
        return price;
    }

    public Order price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public Order totalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
        return this;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public CATEGORY getCategoryToken() {
        return categoryToken;
    }

    public Order categoryToken(CATEGORY categoryToken) {
        this.categoryToken = categoryToken;
        return this;
    }

    public void setCategoryToken(CATEGORY categoryToken) {
        this.categoryToken = categoryToken;
    }

    public STATUS getStatus() {
        return status;
    }

    public Order status(STATUS status) {
        this.status = status;
        return this;
    }

    public void setStatus(STATUS status) {
        this.status = status;
    }

    public Boolean isActive() {
        return active;
    }

    public Order active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public SecurityToken getSecurityToken() { return securityToken; }

    public Order securityToken(SecurityToken securityToken) {
        this.securityToken = securityToken;
        return this;
    }

    public void setSecurityToken(SecurityToken securityToken) {
        this.securityToken = securityToken;
    }

    public User getUser() {
        return user;
    }

    public Order user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public Order transaction(Transaction transaction) {
        this.transaction = transaction;
        return this;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Order)) {
            return false;
        }
        return id != null && id.equals(((Order) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Order{" +
            "id=" + getId() +
            ", idOrder='" + getIdOrder() + "'" +
            ", refOrder=" + getRefOrder() +
            ", securityTokenName=" + getSecurityTokenName() +
            ", createDate='" + getCreateDate() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", closeDate='" + getCloseDate() + "'" +
            ", symbol='" + getSymbol() + "'" +
            ", type='" + getType() + "'" +
            ", limitOrMarket='" + getLimitOrMarket() + "'" +
            ", volume=" + getVolume() +
            ", price=" + getPrice() +
            ", totalAmount=" + getTotalAmount() +
            ", categoryToken='" + getCategoryToken() + "'" +
            ", status='" + getStatus() + "'" +
            ", active='" + isActive() + "'" +
            "}";
    }
}
