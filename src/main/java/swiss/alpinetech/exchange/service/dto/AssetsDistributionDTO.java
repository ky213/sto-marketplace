package swiss.alpinetech.exchange.service.dto;

import swiss.alpinetech.exchange.domain.enumeration.CATEGORY;

import java.io.Serializable;

public class AssetsDistributionDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private CATEGORY category;

    private Double totalAmount;

    private Double percentage;

    public AssetsDistributionDTO() {}

    public AssetsDistributionDTO(CATEGORY category, Double totalAmount, Double percentage) {
        this.category = category;
        this.totalAmount = totalAmount;
        this.percentage = percentage;
    }

    public CATEGORY getCategory() {
        return category;
    }

    public void setCategory(CATEGORY category) {
        this.category = category;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    @Override
    public String toString() {
        return "AssetsDistributionDTO{" +
            "category=" + category +
            ", totalAmount=" + totalAmount +
            ", percentage=" + percentage +
            '}';
    }
}
