package swiss.alpinetech.exchange.domain;

import java.io.Serializable;

public class Trade implements Serializable {

    private static final long serialVersionUID = 1L;

    private String TakerOrderID;
    private String MakerOrderID;
    private Double Amount;
    private Double Price;

    public Trade(String takerOrderID, String makerOrderID, Double amount, Double price) {
        TakerOrderID = takerOrderID;
        MakerOrderID = makerOrderID;
        Amount = amount;
        Price = price;
    }

    public Trade() { }

    public String getMakerOrderID() {
        return MakerOrderID;
    }

    public void setMakerOrderID(String makerOrderID) {
        MakerOrderID = makerOrderID;
    }

    public Double getAmount() {
        return Amount;
    }

    public void setAmount(Double amount) {
        Amount = amount;
    }

    public Double getPrice() {
        return Price;
    }

    public void setPrice(Double price) {
        Price = price;
    }

    public String getTakerOrderID() {
        return TakerOrderID;
    }

    public void setTakerOrderID(String takerOrderID) {
        TakerOrderID = takerOrderID;
    }
}
