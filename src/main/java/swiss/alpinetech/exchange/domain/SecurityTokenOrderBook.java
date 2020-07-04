package swiss.alpinetech.exchange.domain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.Serializable;
import java.util.Map;
import java.util.Objects;

public class SecurityTokenOrderBook implements Serializable {

    private static final long serialVersionUID = -295422703255886286L;

    private Map<SecurityToken, OrderBookWrapper> securityTokenOrderBook;

    private final Logger log = LoggerFactory.getLogger(SecurityTokenOrderBook.class);

    public SecurityTokenOrderBook(Map<SecurityToken, OrderBookWrapper> securityTokenOrderBook) {
        this.securityTokenOrderBook = securityTokenOrderBook;
    }

    public SecurityTokenOrderBook() {
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public Map<SecurityToken, OrderBookWrapper> getSecurityTokenOrderBook() {
        return securityTokenOrderBook;
    }

    public void setSecurityTokenOrderBook(Map<SecurityToken, OrderBookWrapper> securityTokenOrderBook) {
        this.securityTokenOrderBook = securityTokenOrderBook;
    }

    public void addToSellOrders(SecurityToken securityToken, Order order) {
        this.securityTokenOrderBook.computeIfAbsent(securityToken, k -> new OrderBookWrapper());
        this.securityTokenOrderBook.compute(securityToken, (k, v) -> {
            v.addToSellOrders(order);
            return v;
        });
    }

    public void addToBuyOrders(SecurityToken securityToken, Order order) {
        this.securityTokenOrderBook.computeIfAbsent(securityToken, k -> new OrderBookWrapper());
        this.securityTokenOrderBook.compute(securityToken, (k, v) -> {
            v.addToBuyOrders(order);
            return v;
        });
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SecurityTokenOrderBook that = (SecurityTokenOrderBook) o;
        return Objects.equals(securityTokenOrderBook, that.securityTokenOrderBook) &&
            Objects.equals(log, that.log);
    }

    @Override
    public int hashCode() {
        return Objects.hash(securityTokenOrderBook, log);
    }

    public void removeFromSellOrders(SecurityToken securityToken, Order order) {
        this.securityTokenOrderBook.computeIfPresent(securityToken, (k, v) -> {
            v.removeFromSellOrders(order);
            return v;
        });
    }

    public void removeFromBuyOrders(SecurityToken securityToken, Order order) {
        this.securityTokenOrderBook.computeIfPresent(securityToken, (k, v) -> {
            v.removeFromBuyOrders(order);
            return v;
        });
    }

    @Override
    public String toString() {
        return "SecurityTokenOrderBook{" +
            "securityTokenOrderBook=" + securityTokenOrderBook.toString() +
            '}';
    }
}
