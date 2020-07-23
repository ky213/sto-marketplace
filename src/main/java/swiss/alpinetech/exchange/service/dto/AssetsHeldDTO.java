package swiss.alpinetech.exchange.service.dto;


import java.io.Serializable;

public class AssetsHeldDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String symbol;

    private Double balance;

    private Double lastBuyingPrice;

    private Double totalAmount;

    public AssetsHeldDTO() {
    }

    public AssetsHeldDTO(String symbol, Double balance, Double lastBuyingPrice, Double totalAmount) {
        this.symbol = symbol;
        this.balance = balance;
        this.lastBuyingPrice = lastBuyingPrice;
        this.totalAmount = totalAmount;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public Double getLastBuyingPrice() {
        return lastBuyingPrice;
    }

    public void setLastBuyingPrice(Double lastBuyingPrice) {
        this.lastBuyingPrice = lastBuyingPrice;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
