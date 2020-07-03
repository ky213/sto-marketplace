package swiss.alpinetech.exchange.domain;

import java.io.Serializable;
import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

public class OrderBookWrapper implements Serializable {

    private static final long serialVersionUID = 1L;

    private Set<Order> buyOrders = new TreeSet<>(Comparator.comparing(Order::getPrice));

    private Set<Order> sellOrders = new TreeSet<>(Comparator.comparing(Order::getPrice).reversed());

    public OrderBookWrapper(Set<Order> buyOrders, Set<Order> sellOrders) {
        this.buyOrders = buyOrders;
        this.sellOrders = sellOrders;
    }

    public OrderBookWrapper() { }

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
