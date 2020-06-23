package swiss.alpinetech.exchange.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.OrderBook;
import swiss.alpinetech.exchange.domain.Trade;
import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;

import java.util.*;

public class TradeService {

    private final Logger log = LoggerFactory.getLogger(TradeService.class);

    OrderBookService orderBookService = new OrderBookService();

    OrderBook orderBook = orderBookService.initOrderBook();

    /**
     * process an order.
     *
     * @param order to process.
     * @return list of trades.
     */
    public List<Trade> process(Order order) {
        if (order.getType().equals(ACTIONTYPE.SELL)) {
            return this.processLimitSell(order);
        }
        if (order.getType().equals(ACTIONTYPE.BUY)) {
            return this.processLimitBuy(order);
        }
        return null;
    }

    private List<Trade> processLimitBuy(Order order) {
        List<Trade> listTrades = new ArrayList<>();
        int n = orderBook.getSellOrders().size();
        List<Order> sellOrdersList = new ArrayList<>(orderBook.getSellOrders());
        if (n == 0) {
            orderBook = orderBookService.addBuyOrder(order, orderBook);
            return listTrades;
        }
        if (sellOrdersList.get(n-1).getPrice() <= order.getPrice()) {
            for (int i = n-1; i >= 0; i--) {
                Order sellOrder = sellOrdersList.get(i);
                if (sellOrder.getPrice() > order.getPrice()) {
                    break;
                }
                if (sellOrder.getTotalAmount() >= order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), sellOrder.getIdOrder(), order.getTotalAmount(), sellOrder.getPrice()));
                    sellOrder.setTotalAmount(sellOrder.getTotalAmount() - order.getTotalAmount());
                    if (sellOrder.getTotalAmount() == 0) {
                        orderBook = orderBookService.removeSellOrder(sellOrder, orderBook);
                    }
                    return listTrades;
                }
                if (sellOrder.getTotalAmount() < order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), sellOrder.getIdOrder(), sellOrder.getTotalAmount(), sellOrder.getPrice()));
                    order.setTotalAmount(order.getTotalAmount() - sellOrder.getTotalAmount());
                    orderBook = orderBookService.removeSellOrder(sellOrder, orderBook);
                    continue;
                }
            }
        }
        orderBook = orderBookService.addBuyOrder(order, orderBook);
        return listTrades;
    }


    private List<Trade> processLimitSell(Order order) {
        List<Trade> listTrades = new ArrayList<>();
        int n = orderBook.getBuyOrders().size();
        List<Order> buyOrdersList = new ArrayList<>(orderBook.getBuyOrders());
        if (n == 0) {
            orderBook = orderBookService.addSellOrder(order, orderBook);
            return listTrades;
        }
        if (buyOrdersList.get(n-1).getPrice() >= order.getPrice()) {
            for (int i = n-1; i >= 0; i--) {
                Order buyOrder = buyOrdersList.get(i);
                if (buyOrder.getPrice() < order.getPrice()) {
                    break;
                }
                if (buyOrder.getTotalAmount() >= order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), buyOrder.getIdOrder(), order.getTotalAmount(), buyOrder.getPrice()));
                    buyOrder.setTotalAmount(buyOrder.getTotalAmount() - order.getTotalAmount());
                    if (buyOrder.getTotalAmount() == 0) {
                        orderBook = orderBookService.removeBuyOrder(buyOrder, orderBook);
                    }
                    return listTrades;
                }
                if (buyOrder.getTotalAmount() < order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), buyOrder.getIdOrder(), buyOrder.getTotalAmount(), buyOrder.getPrice()));
                    order.setTotalAmount(order.getTotalAmount() - buyOrder.getTotalAmount());
                    orderBook = orderBookService.removeBuyOrder(buyOrder, orderBook);
                    continue;
                }
            }

        }
        orderBook = orderBookService.addSellOrder(order, orderBook);
        return listTrades;
    }
}
