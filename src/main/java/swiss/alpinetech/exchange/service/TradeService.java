package swiss.alpinetech.exchange.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.activemq.command.ActiveMQQueue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import swiss.alpinetech.exchange.domain.*;
import swiss.alpinetech.exchange.domain.enumeration.ACTIONTYPE;
import swiss.alpinetech.exchange.domain.enumeration.STATUS;

import java.util.*;

@Service
public class TradeService {

    private final Logger log = LoggerFactory.getLogger(TradeService.class);

    private final OrderBookService orderBookService;

    private final TransactionService transactionService;

    private final SecurityTokenService securityTokenService;

    private final OrderService orderService;

    private final SimpMessageSendingOperations messagingTemplate;

    private SecurityTokenOrderBook securityTokenOrderBook;

    private final ActiveMQQueue queue;

    private final JmsTemplate jmsTemplate;


    @Autowired
    TradeService(OrderService orderService,
                 TransactionService transactionService,
                 ActiveMQQueue queue,
                 JmsTemplate jmsTemplate,
                 SimpMessageSendingOperations messagingTemplate,
                 SecurityTokenService securityTokenService,
                 OrderBookService orderBookService) {
        this.orderService = orderService;
        this.transactionService = transactionService;
        this.queue = queue;
        this.jmsTemplate = jmsTemplate;
        this.messagingTemplate = messagingTemplate;
        this.securityTokenService = securityTokenService;
        this.orderBookService = orderBookService;
        this.securityTokenOrderBook = orderBookService.initSecurityTokenOrderBook();
    }

    @JmsListener(destination = "outbound.orderBook.topic")
    void getSecurityTokenOrderBookFromTopic(Map<String, Map<String, List<String>>> message) {
        log.debug("consume securityTokenOrderBook {} from topic", message);
        this.securityTokenOrderBook = orderBookService.readAndConvertFromTopic(message);
        log.debug("new securityTokenOrderBook {} from topic", securityTokenOrderBook.toString());
    };

    private void sendTradeListToQueue(List<Trade> tradeList) throws JsonProcessingException {
        log.debug("send Trade List {} to queue", tradeList);
        ObjectMapper mapper = new ObjectMapper();
        this.jmsTemplate.convertAndSend(this.queue, mapper.writeValueAsString(tradeList));
    }

    @JmsListener(destination = "inbound.order.topic")
    public void receiveOrder(final Order order) throws JsonProcessingException {
        log.debug("process order {} in match engine", order);
        this.Process(order);
    }

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
            orderService.updateOrderFillTokenAndFillAmount(resultListTrades);
            sendTradeListToQueue(resultListTrades);
            securityTokenService.updateSecurityTokenPrice(order);
            this.messagingTemplate.convertAndSend("/topic/tracker", orderService.findOne(order.getId()).get());
            return resultListTrades;
        }
        if (order.getType().equals(ACTIONTYPE.BUY)) {
            resultListTrades = this.processLimitBuy(order);
            createTransaction(resultListTrades, order);
            orderService.updateOrderFillTokenAndFillAmount(resultListTrades);
            sendTradeListToQueue(resultListTrades);
            securityTokenService.updateSecurityTokenPrice(order);
            this.messagingTemplate.convertAndSend("/topic/tracker", orderService.findOne(order.getId()).get());
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
                    orderService.updateOrderStatus(buyOrder.getId(), STATUS.PENDING);
                });
            }
            if (order.getType().equals(ACTIONTYPE.BUY)) {
                resultListTrades.forEach(item -> {
                    Order sellOrder = orderService.findOneByIdOrder(item.getMakerOrderID()).get();
                    transactionService.createBuyTransaction(new Transaction(), order, sellOrder);
                    orderService.updateOrderStatus(sellOrder.getId(), STATUS.PENDING);
                });
            }
            orderService.updateOrderStatus(order.getId(), STATUS.PENDING);
        }
    }

    private List<Trade> processLimitBuy(Order order) {
        log.debug("process buy order {}", order);
        List<Trade> listTrades = new ArrayList<>();
        int n = orderBookService.getSellOrdersBySecurityToken(order.getSecurityToken().getId().toString(), securityTokenOrderBook).size();
        List<Order> sellOrdersList = new ArrayList<>(orderBookService.getSellOrdersBySecurityToken(order.getSecurityToken().getId().toString(), securityTokenOrderBook));
        if (n == 0) {
            securityTokenOrderBook = orderBookService.addToSecurityTokenBuyOrders(order.getSecurityToken().getId().toString(), order, securityTokenOrderBook);
            orderBookService.convertAndSendToTopic(securityTokenOrderBook);
            return listTrades;
        }
        if (sellOrdersList.get(n-1).getPrice() <= order.getPrice()) {
            for (int i = n-1; i >= 0; i--) {
                Order sellOrder = sellOrdersList.get(i);
                if (orderService.isSameUser(order, sellOrder)) {
                    continue;
                }
                if (sellOrder.getPrice() > order.getPrice()) {
                    break;
                }
                if (sellOrder.getTotalAmount() >= order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), sellOrder.getIdOrder(), order.getTotalAmount(), sellOrder.getPrice()));
                    sellOrder = orderService.updateOrderAmount(sellOrder.getId(), sellOrder.getTotalAmount() - order.getTotalAmount());
                    if (sellOrder.getTotalAmount() == 0) {
                        securityTokenOrderBook = orderBookService.removeFromSecurityTokenSellOrders(sellOrder.getSecurityToken().getId().toString(), sellOrder, securityTokenOrderBook);
                        orderBookService.convertAndSendToTopic(securityTokenOrderBook);
                    }
                    return listTrades;
                }
                if (sellOrder.getTotalAmount() < order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), sellOrder.getIdOrder(), sellOrder.getTotalAmount(), sellOrder.getPrice()));
                    order = orderService.updateOrderAmount(order.getId(), order.getTotalAmount() - sellOrder.getTotalAmount());
                    securityTokenOrderBook = orderBookService.removeFromSecurityTokenSellOrders(sellOrder.getSecurityToken().getId().toString(), sellOrder, securityTokenOrderBook);
                    continue;
                }
            }
        }
        securityTokenOrderBook = orderBookService.addToSecurityTokenBuyOrders(order.getSecurityToken().getId().toString(), order, securityTokenOrderBook);
        orderBookService.convertAndSendToTopic(securityTokenOrderBook);
        return listTrades;
    }


    private List<Trade> processLimitSell(Order order) {
        log.debug("process sell order {}", order);
        List<Trade> listTrades = new ArrayList<>();
        int n = orderBookService.getBuyOrdersBySecurityToken(order.getSecurityToken().getId().toString(), securityTokenOrderBook).size();
        List<Order> buyOrdersList = new ArrayList<>(orderBookService.getBuyOrdersBySecurityToken(order.getSecurityToken().getId().toString(), securityTokenOrderBook));
        if (n == 0) {
            securityTokenOrderBook = orderBookService.addToSecurityTokenSellOrders(order.getSecurityToken().getId().toString(), order, securityTokenOrderBook);
            orderBookService.convertAndSendToTopic(securityTokenOrderBook);
            return listTrades;
        }
        if (buyOrdersList.get(n-1).getPrice() >= order.getPrice()) {
            for (int i = n-1; i >= 0; i--) {
                Order buyOrder = buyOrdersList.get(i);
                if (orderService.isSameUser(order, buyOrder)) {
                    continue;
                }
                if (buyOrder.getPrice() < order.getPrice()) {
                    break;
                }
                if (buyOrder.getTotalAmount() >= order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), buyOrder.getIdOrder(), order.getTotalAmount(), buyOrder.getPrice()));
                    buyOrder = orderService.updateOrderAmount(buyOrder.getId(), buyOrder.getTotalAmount() - order.getTotalAmount());
                    if (buyOrder.getTotalAmount() == 0) {
                        securityTokenOrderBook = orderBookService.removeFromSecurityTokenBuyOrders(buyOrder.getSecurityToken().getId().toString(), buyOrder, securityTokenOrderBook);
                        orderBookService.convertAndSendToTopic(securityTokenOrderBook);
                    }
                    return listTrades;
                }
                if (buyOrder.getTotalAmount() < order.getTotalAmount()) {
                    listTrades.add(new Trade(order.getIdOrder(), buyOrder.getIdOrder(), buyOrder.getTotalAmount(), buyOrder.getPrice()));
                    order = orderService.updateOrderAmount(order.getId(), order.getTotalAmount() - buyOrder.getTotalAmount());
                    securityTokenOrderBook = orderBookService.removeFromSecurityTokenBuyOrders(buyOrder.getSecurityToken().getId().toString(), buyOrder, securityTokenOrderBook);
                    continue;
                }
            }

        }
        securityTokenOrderBook = orderBookService.addToSecurityTokenSellOrders(order.getSecurityToken().getId().toString(), order, securityTokenOrderBook);
        orderBookService.convertAndSendToTopic(securityTokenOrderBook);
        return listTrades;
    }
}
