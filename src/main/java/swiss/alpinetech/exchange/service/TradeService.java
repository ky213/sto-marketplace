package swiss.alpinetech.exchange.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.SecurityTokenOrderBook;
import swiss.alpinetech.exchange.domain.Trade;
import swiss.alpinetech.exchange.domain.Transaction;
import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;

import java.util.*;

public class TradeService {

    private final Logger log = LoggerFactory.getLogger(TradeService.class);

    OrderBookService orderBookService = new OrderBookService();

    @Autowired
    TransactionService transactionService;

    @Autowired
    OrderService orderService;

    SecurityTokenOrderBook securityTokenOrderBook = orderBookService.initSecurityTokenOrderBook();

    /**
     * process an order.
     *
     * @param order to process.
     * @return list of trades.
     */

    public List<Trade> Process(Order order) {
        List<Trade> resultListTrades;
        if (order.getType().equals(ACTIONTYPE.SELL)) {
            resultListTrades = this.processLimitSell(order);
            createTransaction(resultListTrades, order);
            orderService.UpdateOrderFillTokenAndFillAmount(resultListTrades, order);
            return resultListTrades;
        }
        if (order.getType().equals(ACTIONTYPE.BUY)) {
            resultListTrades = this.processLimitBuy(order);
            createTransaction(resultListTrades, order);
            orderService.UpdateOrderFillTokenAndFillAmount(resultListTrades, order);
            return resultListTrades;
        }
        return null;
    }

    private void createTransaction(List<Trade> resultListTrades, Order order) {
        if (!resultListTrades.isEmpty()) {
            if (order.getType().equals(ACTIONTYPE.SELL)) {
                resultListTrades.forEach(item -> {
                    Order buyOrder = orderService.findOneByIdOrder(item.getMakerOrderID()).get();
                    transactionService.createSellTransaction(new Transaction(), buyOrder ,order);
                    buyOrder.setStatus(STATUS.PENDING);
                    orderService.save(buyOrder);
                });
            }
            if (order.getType().equals(ACTIONTYPE.BUY)) {
                resultListTrades.forEach(item -> {
                    Order sellOrder = orderService.findOneByIdOrder(item.getMakerOrderID()).get();
                    transactionService.createBuyTransaction(new Transaction(), order, sellOrder);
                    sellOrder.setStatus(STATUS.PENDING);
                    orderService.save(sellOrder);
                });
            }
            order.setStatus(STATUS.PENDING);
            orderService.save(order);
        }
    }

    private List<Trade> processLimitBuy(Order order) {
        List<Trade> listTrades = new ArrayList<>();
        int n = orderBookService.getSellOrdersBySecurityToken(order.getSecurityToken(), securityTokenOrderBook).size();
        List<Order> sellOrdersList = new ArrayList<>(orderBookService.getSellOrdersBySecurityToken(order.getSecurityToken(), securityTokenOrderBook));
        if (n == 0) {
            securityTokenOrderBook = orderBookService.addToSecurityTokenBuyOrders(order.getSecurityToken(), order, securityTokenOrderBook);
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
                        securityTokenOrderBook = orderBookService.removeFromSecurityTokenSellOrders(sellOrder.getSecurityToken(), sellOrder, securityTokenOrderBook);
                    }
                    return listTrades;
                }
                if (sellOrder.getTotalAmount() < order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), sellOrder.getIdOrder(), sellOrder.getTotalAmount(), sellOrder.getPrice()));
                    order.setTotalAmount(order.getTotalAmount() - sellOrder.getTotalAmount());
                    securityTokenOrderBook = orderBookService.removeFromSecurityTokenSellOrders(sellOrder.getSecurityToken(), sellOrder, securityTokenOrderBook);
                    continue;
                }
            }
        }
        securityTokenOrderBook = orderBookService.addToSecurityTokenBuyOrders(order.getSecurityToken(), order, securityTokenOrderBook);
        return listTrades;
    }


    private List<Trade> processLimitSell(Order order) {
        List<Trade> listTrades = new ArrayList<>();
        int n = orderBookService.getBuyOrdersBySecurityToken(order.getSecurityToken(), securityTokenOrderBook).size();
        List<Order> buyOrdersList = new ArrayList<>(orderBookService.getBuyOrdersBySecurityToken(order.getSecurityToken(), securityTokenOrderBook));
        if (n == 0) {
            securityTokenOrderBook = orderBookService.addToSecurityTokenSellOrders(order.getSecurityToken(), order, securityTokenOrderBook);
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
                        securityTokenOrderBook = orderBookService.removeFromSecurityTokenBuyOrders(buyOrder.getSecurityToken(), buyOrder, securityTokenOrderBook);
                    }
                    return listTrades;
                }
                if (buyOrder.getTotalAmount() < order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), buyOrder.getIdOrder(), buyOrder.getTotalAmount(), buyOrder.getPrice()));
                    order.setTotalAmount(order.getTotalAmount() - buyOrder.getTotalAmount());
                    securityTokenOrderBook = orderBookService.removeFromSecurityTokenBuyOrders(buyOrder.getSecurityToken(), buyOrder, securityTokenOrderBook);
                    continue;
                }
            }

        }
        securityTokenOrderBook = orderBookService.addToSecurityTokenSellOrders(order.getSecurityToken(), order, securityTokenOrderBook);
        return listTrades;
    }
}
