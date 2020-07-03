package swiss.alpinetech.exchange.domain;

import java.io.Serializable;
import java.util.Map;

public class SecurityTokenOrderBook implements Serializable {

    private static final long serialVersionUID = 1L;

    private Map<SecurityToken, OrderBookWrapper> securityTokenBuyOrders;

    private Map<SecurityToken, OrderBookWrapper> securityTokenSellOrders;

    public SecurityTokenOrderBook(Map<SecurityToken, OrderBookWrapper> securityTokenBuyOrders, Map<SecurityToken, OrderBookWrapper> securityTokenSellOrders) {
        this.securityTokenBuyOrders = securityTokenBuyOrders;
        this.securityTokenSellOrders = securityTokenSellOrders;
    }

    public SecurityTokenOrderBook() {
    }

    public Map<SecurityToken, OrderBookWrapper> getSecurityTokenBuyOrders() {
        return securityTokenBuyOrders;
    }

    public void setSecurityTokenBuyOrders(Map<SecurityToken, OrderBookWrapper> securityTokenBuyOrders) {
        this.securityTokenBuyOrders = securityTokenBuyOrders;
    }

    public Map<SecurityToken, OrderBookWrapper> getSecurityTokenSellOrders() {
        return securityTokenSellOrders;
    }

    public void setSecurityTokenSellOrders(Map<SecurityToken, OrderBookWrapper> securityTokenSellOrders) {
        this.securityTokenSellOrders = securityTokenSellOrders;
    }

    public void addToSellOrders(SecurityToken securityToken, Order order) {
        this.securityTokenSellOrders.computeIfPresent(securityToken, (k, v) -> {
            v.addToSellOrders(order);
            return v;
        });
    }

    public void addToBuyOrders(SecurityToken securityToken, Order order) {
        this.securityTokenBuyOrders.computeIfPresent(securityToken, (k, v) -> {
            v.addToBuyOrders(order);
            return v;
        });
    }

    public void removeFromSellOrders(SecurityToken securityToken, Order order) {
        this.securityTokenSellOrders.computeIfPresent(securityToken, (k, v) -> {
            v.removeFromSellOrders(order);
            return v;
        });
    }

    public void removeFromBuyOrders(SecurityToken securityToken, Order order) {
        this.securityTokenBuyOrders.computeIfPresent(securityToken, (k, v) -> {
            v.removeFromBuyOrders(order);
            return v;
        });
    }
}
