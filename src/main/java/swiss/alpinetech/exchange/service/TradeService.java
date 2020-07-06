package swiss.alpinetech.exchange.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import swiss.alpinetech.exchange.domain.*;
import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;

import java.util.*;

@Service
public class TradeService {

    private final Logger log = LoggerFactory.getLogger(TradeService.class);

    OrderBookService orderBookService = new OrderBookService();

    private final TransactionService transactionService;

    private final OrderService orderService;

    private final JmsTemplate jmsTemplate;

    SecurityTokenOrderBook securityTokenOrderBook = orderBookService.initSecurityTokenOrderBook();


    @Autowired
    TradeService(OrderService orderService, TransactionService transactionService, JmsTemplate jmsTemplate) {
        this.orderService = orderService;
        this.transactionService = transactionService;
        this.jmsTemplate = jmsTemplate;
    }

    @JmsListener(destination = "outbound.orderBook.topic")
    void getSecurityTokenOrderBookFromQueue(Map<String, Map<String, List<String>>> message) throws JsonProcessingException {
        log.debug("consume securityTokenOrderBook {} from queue", message);
        securityTokenOrderBook = orderBookService.readAndConvertFromQueue(message);
        log.debug("new securityTokenOrderBook {} from queue", securityTokenOrderBook.toString());
    };

    /**
     * process an order.
     *
     * @param order to process.
     * @return list of trades.
     */

    public List<Trade> Process(Order order) throws JsonProcessingException {
        log.debug("Security token order book :"+ securityTokenOrderBook.toString());
        List<Trade> resultListTrades;
        if (order.getType().equals(ACTIONTYPE.SELL)) {
            resultListTrades = this.processLimitSell(order);
            createTransaction(resultListTrades, order);
            orderService.UpdateOrderFillTokenAndFillAmount(resultListTrades, order.getId());
            return resultListTrades;
        }
        if (order.getType().equals(ACTIONTYPE.BUY)) {
            resultListTrades = this.processLimitBuy(order);
            createTransaction(resultListTrades, order);
            orderService.UpdateOrderFillTokenAndFillAmount(resultListTrades, order.getId());
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

    private List<Trade> processLimitBuy(Order order) throws JsonProcessingException {
        log.debug("process buy order {}", order);
        List<Trade> listTrades = new ArrayList<>();
        int n = orderBookService.getSellOrdersBySecurityToken(order.getSecurityToken().getId().toString(), securityTokenOrderBook).size();
        List<Order> sellOrdersList = new ArrayList<>(orderBookService.getSellOrdersBySecurityToken(order.getSecurityToken().getId().toString(), securityTokenOrderBook));
        if (n == 0) {
            securityTokenOrderBook = orderBookService.addToSecurityTokenBuyOrders(order.getSecurityToken().getId().toString(), order, securityTokenOrderBook);
            orderBookService.convertAndSendToQueue(securityTokenOrderBook, jmsTemplate);
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
                        securityTokenOrderBook = orderBookService.removeFromSecurityTokenSellOrders(sellOrder.getSecurityToken().getId().toString(), sellOrder, securityTokenOrderBook);
                        orderBookService.convertAndSendToQueue(securityTokenOrderBook, jmsTemplate);
                    }
                    return listTrades;
                }
                if (sellOrder.getTotalAmount() < order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), sellOrder.getIdOrder(), sellOrder.getTotalAmount(), sellOrder.getPrice()));
                    order.setTotalAmount(order.getTotalAmount() - sellOrder.getTotalAmount());
                    securityTokenOrderBook = orderBookService.removeFromSecurityTokenSellOrders(sellOrder.getSecurityToken().getId().toString(), sellOrder, securityTokenOrderBook);
                    continue;
                }
            }
        }
        securityTokenOrderBook = orderBookService.addToSecurityTokenBuyOrders(order.getSecurityToken().getId().toString(), order, securityTokenOrderBook);
        orderBookService.convertAndSendToQueue(securityTokenOrderBook, jmsTemplate);
        return listTrades;
    }


    private List<Trade> processLimitSell(Order order) throws JsonProcessingException {
        log.debug("process sell order {}", order);
        List<Trade> listTrades = new ArrayList<>();
        int n = orderBookService.getBuyOrdersBySecurityToken(order.getSecurityToken().getId().toString(), securityTokenOrderBook).size();
        List<Order> buyOrdersList = new ArrayList<>(orderBookService.getBuyOrdersBySecurityToken(order.getSecurityToken().getId().toString(), securityTokenOrderBook));
        if (n == 0) {
            securityTokenOrderBook = orderBookService.addToSecurityTokenSellOrders(order.getSecurityToken().getId().toString(), order, securityTokenOrderBook);
            orderBookService.convertAndSendToQueue(securityTokenOrderBook, jmsTemplate);
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
                        securityTokenOrderBook = orderBookService.removeFromSecurityTokenBuyOrders(buyOrder.getSecurityToken().getId().toString(), buyOrder, securityTokenOrderBook);
                        orderBookService.convertAndSendToQueue(securityTokenOrderBook, jmsTemplate);
                    }
                    return listTrades;
                }
                if (buyOrder.getTotalAmount() < order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), buyOrder.getIdOrder(), buyOrder.getTotalAmount(), buyOrder.getPrice()));
                    order.setTotalAmount(order.getTotalAmount() - buyOrder.getTotalAmount());
                    securityTokenOrderBook = orderBookService.removeFromSecurityTokenBuyOrders(buyOrder.getSecurityToken().getId().toString(), buyOrder, securityTokenOrderBook);
                    continue;
                }
            }

        }
        securityTokenOrderBook = orderBookService.addToSecurityTokenSellOrders(order.getSecurityToken().getId().toString(), order, securityTokenOrderBook);
        orderBookService.convertAndSendToQueue(securityTokenOrderBook, jmsTemplate);
        return listTrades;
    }
}
