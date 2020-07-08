package swiss.alpinetech.exchange.service.dto;

import swiss.alpinetech.exchange.domain.Transaction;

import java.io.Serializable;
import java.time.ZonedDateTime;

public class TransactionPriceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    public TransactionPriceDTO() {}

    public TransactionPriceDTO(Transaction transaction) {
        this.price = transaction.getPrice();
        this.createDate = transaction.getCreateDate();
    }

    private Double price;

    private ZonedDateTime createDate;

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public ZonedDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(ZonedDateTime createDate) {
        this.createDate = createDate;
    }

    @Override
    public String toString() {
        return "TransactionPriceDTO{" +
            "price=" + price +
            ", createDate=" + createDate +
            '}';
    }
}
