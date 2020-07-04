package swiss.alpinetech.exchange.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.OrderBookWrapper;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.domain.SecurityTokenOrderBook;

import java.util.*;

@Service
public class OrderBookService {

    private final Logger log = LoggerFactory.getLogger(OrderBookService.class);

    private SecurityTokenOrderBook securityTokenOrderBook;


    OrderBookService() {}

    SecurityTokenOrderBook initSecurityTokenOrderBook() {
        log.debug("init securityTokenOrderBook {}", securityTokenOrderBook);
        if (this.securityTokenOrderBook != null) {
            return securityTokenOrderBook;
        }
        Map<SecurityToken, OrderBookWrapper> securityTokenOrderBookList = new HashMap<>();
        securityTokenOrderBook = new SecurityTokenOrderBook(securityTokenOrderBookList);
        return securityTokenOrderBook;
    };

//    @JmsListener(destination = "outbound.orderBook.topic")
//    SecurityTokenOrderBook getSecurityTokenOrderBookFromQueue(String securityTokenOrderBook) {
//        log.debug("consume securityTokenOrderBook {} from queue", securityTokenOrderBook);
//        this.securityTokenOrderBook = securityTokenOrderBook;
//        return securityTokenOrderBook;
//    };

    Set<Order> getSellOrdersBySecurityToken(SecurityToken securityToken, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("get SellOrders by securityToken {}", securityToken);
        if (securityTokenOrderBook.getSecurityTokenOrderBook().get(securityToken) != null) {
            return Optional.of(securityTokenOrderBook.getSecurityTokenOrderBook().get(securityToken).getSellOrders())
                .orElse(new HashSet<>());
        }
        return new HashSet<>();
    }

    Set<Order> getBuyOrdersBySecurityToken(SecurityToken securityToken, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("get BuyOrders by securityToken {}", securityToken);
        if (securityTokenOrderBook.getSecurityTokenOrderBook().get(securityToken) != null) {
            return Optional.of(securityTokenOrderBook.getSecurityTokenOrderBook().get(securityToken).getBuyOrders())
                .orElse(new HashSet<>());
        }
        return new HashSet<>();
    }

    public SecurityTokenOrderBook addToSecurityTokenSellOrders(SecurityToken securityToken, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("add sell order {} to securityToken {} order's book", order, securityToken);
        securityTokenOrderBook.addToSellOrders(securityToken, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook addToSecurityTokenBuyOrders(SecurityToken securityToken, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("add buy order {} to securityToken {} order's book", order, securityToken);
        securityTokenOrderBook.addToBuyOrders(securityToken, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook removeFromSecurityTokenSellOrders(SecurityToken securityToken, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("remove sell order {} from securityToken {} order's book", order, securityToken);
        securityTokenOrderBook.removeFromSellOrders(securityToken, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook removeFromSecurityTokenBuyOrders(SecurityToken securityToken, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        log.debug("remove buy order {} from securityToken {} order's book", order, securityToken);
        securityTokenOrderBook.removeFromBuyOrders(securityToken, order);
        return securityTokenOrderBook;
    }

}
