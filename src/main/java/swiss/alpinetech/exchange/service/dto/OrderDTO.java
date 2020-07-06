package swiss.alpinetech.exchange.service.dto;

import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;
import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;
import swiss.alpinetech.exchange.domain.enumeration.ORDERTYPE;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;

import java.io.Serializable;
import java.util.Objects;

public class OrderDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public OrderDTO() {}

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.idOrder = order.getIdOrder();
        this.refOrder = order.getRefOrder();
        this.securityTokenName = order.getSecurityTokenName();
        this.symbol = order.getSymbol();
        this.type = order.getType();
        this.limitOrMarket = order.getLimitOrMarket();
        this.volume = order.getVolume();
        this.price = order.getPrice();
        this.totalAmount = order.getTotalAmount();
        this.categoryToken = order.getCategoryToken();
        this.status = order.getStatus();
        this.updateBy = order.getUpdateBy();
        this.active = order.isActive();
        this.fillToken = order.getFillToken();
        this.fillAmount = order.getFillAmount();
        this.securityToken = new SecurityTokenDTO(order.getSecurityToken());
    }

    private Long id;

    private String idOrder;

    private Long refOrder;

    private String securityTokenName;

    private String symbol;

    private ACTIONTYPE type;

    private ORDERTYPE limitOrMarket;

    private Double volume;

    private Double price;

    private Double totalAmount;

    private CATEGORY categoryToken;

    private STATUS status;

    private String updateBy;

    private Boolean active;

    private Double fillToken;

    private Double fillAmount;

    private SecurityTokenDTO securityToken;

    public SecurityTokenDTO getSecurityToken() {
        return securityToken;
    }

    public void setSecurityToken(SecurityTokenDTO securityToken) {
        this.securityToken = securityToken;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdOrder() {
        return idOrder;
    }

    public void setIdOrder(String idOrder) {
        this.idOrder = idOrder;
    }

    public String getSecurityTokenName() {
        return securityTokenName;
    }

    public void setSecurityTokenName(String securityTokenName) {
        this.securityTokenName = securityTokenName;
    }

    public Long getRefOrder() {
        return refOrder;
    }

    public void setRefOrder(Long refOrder) {
        this.refOrder = refOrder;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getUpdateBy() {
        return updateBy;
    }

    public void setUpdateBy(String updateBy) {
        this.updateBy = updateBy;
    }

    public ACTIONTYPE getType() {
        return type;
    }

    public void setType(ACTIONTYPE type) {
        this.type = type;
    }

    public ORDERTYPE getLimitOrMarket() {
        return limitOrMarket;
    }

    public void setLimitOrMarket(ORDERTYPE limitOrMarket) {
        this.limitOrMarket = limitOrMarket;
    }

    public Double getVolume() {
        return volume;
    }

    public void setVolume(Double volume) {
        this.volume = volume;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public CATEGORY getCategoryToken() {
        return categoryToken;
    }

    public void setCategoryToken(CATEGORY categoryToken) {
        this.categoryToken = categoryToken;
    }

    public STATUS getStatus() {
        return status;
    }

    public void setStatus(STATUS status) {
        this.status = status;
    }

    public Boolean isActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Double getFillToken() {
        return fillToken;
    }

    public void setFillToken(Double fillToken) {
        this.fillToken = fillToken;
    }

    public Double getFillAmount() {
        return fillAmount;
    }

    public void setFillAmount(Double fillAmount) {
        this.fillAmount = fillAmount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderDTO orderDTO = (OrderDTO) o;
        return id.equals(orderDTO.id) &&
            Objects.equals(idOrder, orderDTO.idOrder);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, idOrder);
    }

    @Override
    public String toString() {
        return "OrderDTO{" +
            "id=" + id +
            ", idOrder='" + idOrder + '\'' +
            ", refOrder=" + refOrder +
            ", securityTokenName='" + securityTokenName + '\'' +
            ", symbol='" + symbol + '\'' +
            ", type=" + type +
            ", limitOrMarket=" + limitOrMarket +
            ", volume=" + volume +
            ", price=" + price +
            ", totalAmount=" + totalAmount +
            ", categoryToken=" + categoryToken +
            ", status=" + status +
            ", updateBy='" + updateBy + '\'' +
            ", active=" + active +
            ", fillToken=" + fillToken +
            ", fillAmount=" + fillAmount +
            '}';
    }
}
