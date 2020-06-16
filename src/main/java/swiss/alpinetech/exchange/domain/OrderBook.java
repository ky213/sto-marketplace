package swiss.alpinetech.exchange.domain;

import java.io.Serializable;
import java.util.Set;

public class OrderBook implements Serializable {

    private static final long serialVersionUID = 1L;

    private Set<Order> buyOrders;

    private Set<Order> sellOrders;

    public OrderBook(Set<Order> buyOrders, Set<Order> sellOrders) {
        this.buyOrders = buyOrders;
        this.sellOrders = sellOrders;
    }

    public OrderBook() { }

    public Set<Order> getBuyOrders() {
        return this.buyOrders;
    }

    public void setBuyOrders(Set<Order> buyOrders) {
        this.buyOrders = buyOrders;
    }

    public Set<Order> getSellOrders() {
        return this.sellOrders;
    }

    public void setSellOrders(Set<Order> sellOrders) {
        this.sellOrders = sellOrders;
    }

    public void addToSellOrders(Order order) {
        this.sellOrders.add(order);
    }

    public void addToBuyOrders(Order order) {
        this.buyOrders.add(order);
    }

    public void removeFromSellOrders(Order order) {
        this.sellOrders.remove(order);
    }

    public void removeFromBuyOrders(Order order) {
        this.buyOrders.remove(order);
    }
}
