package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.OrderBook;

import java.util.Comparator;
import java.util.Set;
import java.util.TreeSet;

public class OrderBookService {

    /**
     * init an order book.
     *
     * @return the order book.
     */
    OrderBook initOrderBook() {
        Set<Order> buyOrders = new TreeSet<>(Comparator.comparing(Order::getPrice));
        Set<Order> sellOrders = new TreeSet<>(Comparator.comparing(Order::getPrice).reversed());
        OrderBook orderBook = new OrderBook(buyOrders, sellOrders);
        return orderBook;
    };



    /**
     * Add a buy order.
     *
     * @param order the entity to add to buy orders.
     * @return the updated order book.
     */
    OrderBook addBuyOrder(Order order, OrderBook orderBook) {
        orderBook.addToBuyOrders(order);
        return orderBook;
    };

    /**
     * Add a sell order.
     *
     * @param order the entity to add to sell orders.
     * @return the updated order book.
     */
    OrderBook addSellOrder(Order order, OrderBook orderBook) {
        orderBook.addToSellOrders(order);
        return orderBook;
    };

    /**
     * Remove a buy order.
     *
     * @param order the entity to remove from buy orders.
     * @return the updated order book.
     */
    OrderBook removeBuyOrder(Order order, OrderBook orderBook) {
        orderBook.removeFromBuyOrders(order);
        return orderBook;
    };

    /**
     * Remove a sell order.
     *
     * @param order to remove from sell orders.
     * @return the updated order book.
     */
    OrderBook removeSellOrder(Order order, OrderBook orderBook) {
        orderBook.removeFromSellOrders(order);
        return orderBook;
    };

}
