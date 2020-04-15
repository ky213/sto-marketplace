package swiss.alpinetech.exchange.domain;

import io.swagger.annotations.ApiModel;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.util.Objects;
import java.time.ZonedDateTime;

import swiss.alpinetech.exchange.domain.enumeration.ORDERTYPE;

import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;

import swiss.alpinetech.exchange.domain.enumeration.STATUS;

/**
 * Home page Dashborad.\n@author Charles
 */
@ApiModel(description = "Home page Dashborad.\n@author Charles")
@Entity
@Table(name = "transaction")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "transaction")
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "id_tx", nullable = false)
    private String idTx;

    @NotNull
    @Column(name = "create_date", nullable = false)
    private ZonedDateTime createDate;

    @Column(name = "update_date")
    private ZonedDateTime updateDate;

    @Column(name = "close_date")
    private ZonedDateTime closeDate;

    @NotNull
    @Column(name = "security_token_name", nullable = false)
    private String securityTokenName;

    @NotNull
    @Column(name = "symbol", nullable = false)
    private String symbol;

    @Enumerated(EnumType.STRING)
    @Column(name = "limit_or_market")
    private ORDERTYPE limitOrMarket;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "volume", nullable = false)
    private Double volume;

    @DecimalMin(value = "0")
    @Column(name = "price")
    private Double price;

    @DecimalMin(value = "0")
    @Column(name = "total_amount")
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_token")
    private CATEGORY categoryToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private STATUS status;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "fee_transaction")
    private Long feeTransaction;

    @Column(name = "num_blockchain_tx")
    private String numBlockchainTx;

    @Column(name = "num_bank_tx")
    private String numBankTx;

    @Column(name = "conf_blk_date")
    private ZonedDateTime confBlkDate;

    @Column(name = "conf_bank_date")
    private ZonedDateTime confBankDate;

    @Column(name = "seller_blk_address")
    private String sellerBlkAddress;

    @Column(name = "buyer_blk_address")
    private String buyerBlkAddress;

    @Column(name = "buyer_iban")
    private String buyerIban;

    @Column(name = "seller_iban")
    private String sellerIban;

    @Column(name = "buyerid")
    private Long buyerid;

    @Column(name = "sellerid")
    private Long sellerid;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdTx() {
        return idTx;
    }

    public Transaction idTx(String idTx) {
        this.idTx = idTx;
        return this;
    }

    public void setIdTx(String idTx) {
        this.idTx = idTx;
    }

    public ZonedDateTime getCreateDate() {
        return createDate;
    }

    public Transaction createDate(ZonedDateTime createDate) {
        this.createDate = createDate;
        return this;
    }

    public void setCreateDate(ZonedDateTime createDate) {
        this.createDate = createDate;
    }

    public ZonedDateTime getUpdateDate() {
        return updateDate;
    }

    public Transaction updateDate(ZonedDateTime updateDate) {
        this.updateDate = updateDate;
        return this;
    }

    public void setUpdateDate(ZonedDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public ZonedDateTime getCloseDate() {
        return closeDate;
    }

    public Transaction closeDate(ZonedDateTime closeDate) {
        this.closeDate = closeDate;
        return this;
    }

    public void setCloseDate(ZonedDateTime closeDate) {
        this.closeDate = closeDate;
    }

    public String getSecurityTokenName() {
        return securityTokenName;
    }

    public Transaction securityTokenName(String securityTokenName) {
        this.securityTokenName = securityTokenName;
        return this;
    }

    public void setSecurityTokenName(String securityTokenName) {
        this.securityTokenName = securityTokenName;
    }

    public String getSymbol() {
        return symbol;
    }

    public Transaction symbol(String symbol) {
        this.symbol = symbol;
        return this;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public ORDERTYPE getLimitOrMarket() {
        return limitOrMarket;
    }

    public Transaction limitOrMarket(ORDERTYPE limitOrMarket) {
        this.limitOrMarket = limitOrMarket;
        return this;
    }

    public void setLimitOrMarket(ORDERTYPE limitOrMarket) {
        this.limitOrMarket = limitOrMarket;
    }

    public Double getVolume() {
        return volume;
    }

    public Transaction volume(Double volume) {
        this.volume = volume;
        return this;
    }

    public void setVolume(Double volume) {
        this.volume = volume;
    }

    public Double getPrice() {
        return price;
    }

    public Transaction price(Double price) {
        this.price = price;
        return this;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public Transaction totalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
        return this;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public CATEGORY getCategoryToken() {
        return categoryToken;
    }

    public Transaction categoryToken(CATEGORY categoryToken) {
        this.categoryToken = categoryToken;
        return this;
    }

    public void setCategoryToken(CATEGORY categoryToken) {
        this.categoryToken = categoryToken;
    }

    public STATUS getStatus() {
        return status;
    }

    public Transaction status(STATUS status) {
        this.status = status;
        return this;
    }

    public void setStatus(STATUS status) {
        this.status = status;
    }

    public Boolean isActive() {
        return active;
    }

    public Transaction active(Boolean active) {
        this.active = active;
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Long getFeeTransaction() {
        return feeTransaction;
    }

    public Transaction feeTransaction(Long feeTransaction) {
        this.feeTransaction = feeTransaction;
        return this;
    }

    public void setFeeTransaction(Long feeTransaction) {
        this.feeTransaction = feeTransaction;
    }

    public String getNumBlockchainTx() {
        return numBlockchainTx;
    }

    public Transaction numBlockchainTx(String numBlockchainTx) {
        this.numBlockchainTx = numBlockchainTx;
        return this;
    }

    public void setNumBlockchainTx(String numBlockchainTx) {
        this.numBlockchainTx = numBlockchainTx;
    }

    public String getNumBankTx() {
        return numBankTx;
    }

    public Transaction numBankTx(String numBankTx) {
        this.numBankTx = numBankTx;
        return this;
    }

    public void setNumBankTx(String numBankTx) {
        this.numBankTx = numBankTx;
    }

    public ZonedDateTime getConfBlkDate() {
        return confBlkDate;
    }

    public Transaction confBlkDate(ZonedDateTime confBlkDate) {
        this.confBlkDate = confBlkDate;
        return this;
    }

    public void setConfBlkDate(ZonedDateTime confBlkDate) {
        this.confBlkDate = confBlkDate;
    }

    public ZonedDateTime getConfBankDate() {
        return confBankDate;
    }

    public Transaction confBankDate(ZonedDateTime confBankDate) {
        this.confBankDate = confBankDate;
        return this;
    }

    public void setConfBankDate(ZonedDateTime confBankDate) {
        this.confBankDate = confBankDate;
    }

    public String getSellerBlkAddress() {
        return sellerBlkAddress;
    }

    public Transaction sellerBlkAddress(String sellerBlkAddress) {
        this.sellerBlkAddress = sellerBlkAddress;
        return this;
    }

    public void setSellerBlkAddress(String sellerBlkAddress) {
        this.sellerBlkAddress = sellerBlkAddress;
    }

    public String getBuyerBlkAddress() {
        return buyerBlkAddress;
    }

    public Transaction buyerBlkAddress(String buyerBlkAddress) {
        this.buyerBlkAddress = buyerBlkAddress;
        return this;
    }

    public void setBuyerBlkAddress(String buyerBlkAddress) {
        this.buyerBlkAddress = buyerBlkAddress;
    }

    public String getBuyerIban() {
        return buyerIban;
    }

    public Transaction buyerIban(String buyerIban) {
        this.buyerIban = buyerIban;
        return this;
    }

    public void setBuyerIban(String buyerIban) {
        this.buyerIban = buyerIban;
    }

    public String getSellerIban() {
        return sellerIban;
    }

    public Transaction sellerIban(String sellerIban) {
        this.sellerIban = sellerIban;
        return this;
    }

    public void setSellerIban(String sellerIban) {
        this.sellerIban = sellerIban;
    }

    public Long getBuyerid() {
        return buyerid;
    }

    public Transaction buyerid(Long buyerid) {
        this.buyerid = buyerid;
        return this;
    }

    public void setBuyerid(Long buyerid) {
        this.buyerid = buyerid;
    }

    public Long getSellerid() {
        return sellerid;
    }

    public Transaction sellerid(Long sellerid) {
        this.sellerid = sellerid;
        return this;
    }

    public void setSellerid(Long sellerid) {
        this.sellerid = sellerid;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transaction)) {
            return false;
        }
        return id != null && id.equals(((Transaction) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Transaction{" +
            "id=" + getId() +
            ", idTx='" + getIdTx() + "'" +
            ", createDate='" + getCreateDate() + "'" +
            ", updateDate='" + getUpdateDate() + "'" +
            ", closeDate='" + getCloseDate() + "'" +
            ", securityTokenName='" + getSecurityTokenName() + "'" +
            ", symbol='" + getSymbol() + "'" +
            ", limitOrMarket='" + getLimitOrMarket() + "'" +
            ", volume=" + getVolume() +
            ", price=" + getPrice() +
            ", totalAmount=" + getTotalAmount() +
            ", categoryToken='" + getCategoryToken() + "'" +
            ", status='" + getStatus() + "'" +
            ", active='" + isActive() + "'" +
            ", feeTransaction=" + getFeeTransaction() +
            ", numBlockchainTx='" + getNumBlockchainTx() + "'" +
            ", numBankTx='" + getNumBankTx() + "'" +
            ", confBlkDate='" + getConfBlkDate() + "'" +
            ", confBankDate='" + getConfBankDate() + "'" +
            ", sellerBlkAddress='" + getSellerBlkAddress() + "'" +
            ", buyerBlkAddress='" + getBuyerBlkAddress() + "'" +
            ", buyerIban='" + getBuyerIban() + "'" +
            ", sellerIban='" + getSellerIban() + "'" +
            ", buyerid=" + getBuyerid() +
            ", sellerid=" + getSellerid() +
            "}";
    }
}
