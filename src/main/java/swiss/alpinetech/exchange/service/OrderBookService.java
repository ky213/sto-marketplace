package swiss.alpinetech.exchange.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.OrderBookWrapper;
import swiss.alpinetech.exchange.domain.SecurityTokenOrderBook;
import swiss.alpinetech.exchange.service.dto.OrderDTO;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderBookService {

    private final Logger log = LoggerFactory.getLogger(OrderBookService.class);

    private SecurityTokenOrderBook securityTokenOrderBook;

    private final JmsTemplate jmsTemplate;

    @Autowired
    OrderBookService(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }

    public SecurityTokenOrderBook initSecurityTokenOrderBook() {
        log.debug("init securityTokenOrderBook {}", securityTokenOrderBook);
        if (this.securityTokenOrderBook != null) {
            return securityTokenOrderBook;
        }
        Map<String, OrderBookWrapper> securityTokenOrderBookList = new HashMap<>();
        securityTokenOrderBook = new SecurityTokenOrderBook(securityTokenOrderBookList);
        return securityTokenOrderBook;
    };

    @JmsListener(destination = "outbound.orderBook.topic")
    void getSecurityTokenOrderBookFromTopic(Map<String, Map<String, List<String>>> message) {
        log.debug("consume securityTokenOrderBook {} from security token service", message);
        this.securityTokenOrderBook = readAndConvertFromTopic(message);
        log.debug("new securityTokenOrderBook {} from topic", securityTokenOrderBook.toString());
    };

    public Set<Order> getSellOrdersBySecurityToken(String securityTokenId, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("get SellOrders by securityToken Id {}", securityTokenId);
        if (securityTokenOrderBook.getSecurityTokenOrderBook().get(securityTokenId) != null) {
            return Optional.of(securityTokenOrderBook.getSecurityTokenOrderBook().get(securityTokenId).getSellOrders())
                .orElse(new HashSet<>());
        }
        return new HashSet<>();
    }

    public Set<Order> getBuyOrdersBySecurityToken(String securityTokenId, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("get BuyOrders by securityToken Id {}", securityTokenId);
        if (securityTokenOrderBook.getSecurityTokenOrderBook().get(securityTokenId) != null) {
            return Optional.of(securityTokenOrderBook.getSecurityTokenOrderBook().get(securityTokenId).getBuyOrders())
                .orElse(new HashSet<>());
        }
        return new HashSet<>();
    }

    public SecurityTokenOrderBook addToSecurityTokenSellOrders(String securityTokenId, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("add sell order {} to securityToken Id {} order's book", order, securityTokenId);
        securityTokenOrderBook.addToSellOrders(securityTokenId, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook addToSecurityTokenBuyOrders(String securityTokenId, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("add buy order {} to securityToken Id {} order's book", order, securityTokenId);
        securityTokenOrderBook.addToBuyOrders(securityTokenId, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook removeFromSecurityTokenSellOrders(String securityTokenId, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("remove sell order {} from securityToken Id {} order's book", order, securityTokenId);
        securityTokenOrderBook.removeFromSellOrders(securityTokenId, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook removeFromSecurityTokenBuyOrders(String securityTokenId, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("remove buy order {} from securityToken Id {} order's book", order, securityTokenId);
        securityTokenOrderBook.removeFromBuyOrders(securityTokenId, order);
        return securityTokenOrderBook;
    }

    public Double getLowestSellingPrice(String securityTokenId) {
        log.debug("get lowest selling price from order book by security token {}", securityTokenId);
        Set<Order> sellOrders = getSellOrdersBySecurityToken(securityTokenId, this.securityTokenOrderBook);
        if (!sellOrders.isEmpty()) {
            return sellOrders.stream().min(Comparator.comparing(Order::getPrice)).get().getPrice();
        }
        return null;
    }

    public Double getHighestBuyingPrice(String securityTokenId) {
        log.debug("get highest buying price from order book by security token {}", securityTokenId);
        Set<Order> buyOrders = getBuyOrdersBySecurityToken(securityTokenId, this.securityTokenOrderBook);
        if (!buyOrders.isEmpty()) {
            return buyOrders.stream().max(Comparator.comparing(Order::getPrice)).get().getPrice();
        }
        return null;
    }

    public Order getLowestSellOrder(String securityTokenId) {
        log.debug("get lowest Sell Order by securityToken Id {} from order book", securityTokenId);
        if (securityTokenOrderBook.getSecurityTokenOrderBook().get(securityTokenId) != null) {
            return Optional.of(
                securityTokenOrderBook.getSecurityTokenOrderBook().get(securityTokenId).getSellOrders().stream().min(Comparator.comparing(Order::getPrice)).get()
            )
                .orElse(null);
        }
        return null;
    }

    public Order getHighestBuyOrder(String securityTokenId) {
        log.debug("get highest Buy Order by securityToken Id {} from order book", securityTokenId);
        if (securityTokenOrderBook.getSecurityTokenOrderBook().get(securityTokenId) != null) {
            return Optional.of(
                securityTokenOrderBook.getSecurityTokenOrderBook().get(securityTokenId).getSellOrders().stream().max(Comparator.comparing(Order::getPrice)).get()
            )
                .orElse(null);
        }
        return null;
    }

    public void convertAndSendToTopic(SecurityTokenOrderBook securityTokenOrderBook) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, OrderBookWrapper> orderBook = securityTokenOrderBook.getSecurityTokenOrderBook();
        Map<String, Map<String, List<String>>> result = new HashMap<>();
        for (Map.Entry<String, OrderBookWrapper> entry : orderBook.entrySet()) {
            String parentKey = entry.getKey();
            OrderBookWrapper parentValue = entry.getValue();
            List<String> parentBuyOrderList = new ArrayList<>(parentValue.getBuyOrders())
                .stream()
                .map(item -> {
                    try {
                        return mapper.writeValueAsString(new OrderDTO(item));
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                    return null;
                })
                .collect(Collectors.toList());
            List<String> parentSellOrderList = new ArrayList<>(parentValue.getSellOrders())
                .stream()
                .map(item -> {
                    try {
                        return mapper.writeValueAsString(new OrderDTO(item));
                    } catch (JsonProcessingException e) {
                        e.printStackTrace();
                    }
                    return null;
                })
                .collect(Collectors.toList());
            Map<String, List<String>> childMap = new HashMap<>();
            childMap.put("BuyOrders", parentBuyOrderList);
            childMap.put("SellOrders", parentSellOrderList);
            result.put(parentKey, childMap);
        }
        jmsTemplate.convertAndSend("outbound.orderBook.topic", result);
    }

    public SecurityTokenOrderBook readAndConvertFromTopic(Map<String, Map<String, List<String>>> map) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, OrderBookWrapper> orderBook = new HashMap<>();
        for (Map.Entry<String, Map<String, List<String>>> parentEntry : map.entrySet()) {
            OrderBookWrapper orderBookWrapper = new OrderBookWrapper();
            for (Map.Entry<String, List<String>> childEntry : parentEntry.getValue().entrySet()) {
                if (childEntry.getKey().equals("BuyOrders")) {
                    for (String item : childEntry.getValue()) {
                        Order buyOrder = null;
                        try {
                            buyOrder = mapper.readValue(item, Order.class);
                        } catch (JsonProcessingException e) {
                            e.printStackTrace();
                        }
                        orderBookWrapper.addToBuyOrders(buyOrder);
                    }
                }
                if (childEntry.getKey().equals("SellOrders")) {
                    for (String item : childEntry.getValue()) {
                        Order sellOrder = null;
                        try {
                            sellOrder = mapper.readValue(item, Order.class);
                        } catch (JsonProcessingException e) {
                            e.printStackTrace();
                        }
                        orderBookWrapper.addToSellOrders(sellOrder);
                    }
                }
            }
            orderBook.put(parentEntry.getKey(), orderBookWrapper);
        }
        return new SecurityTokenOrderBook(orderBook);
    }

}
