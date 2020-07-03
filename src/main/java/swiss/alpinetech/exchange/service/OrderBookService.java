package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.OrderBookWrapper;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.domain.SecurityTokenOrderBook;

import java.util.*;

public class OrderBookService {

    SecurityTokenOrderBook initSecurityTokenOrderBook() {
        Map<SecurityToken, OrderBookWrapper> securityTokenBuyOrders = new HashMap<>();
        Map<SecurityToken, OrderBookWrapper> securityTokenSellOrders = new HashMap<>();
        SecurityTokenOrderBook securityTokenOrderBook = new SecurityTokenOrderBook(securityTokenBuyOrders, securityTokenSellOrders);
        return securityTokenOrderBook;
    };

    Set<Order> getSellOrdersBySecurityToken(SecurityToken securityToken, SecurityTokenOrderBook securityTokenOrderBook) {
        return securityTokenOrderBook.getSecurityTokenSellOrders().get(securityToken).getSellOrders();
    }

    Set<Order> getBuyOrdersBySecurityToken(SecurityToken securityToken, SecurityTokenOrderBook securityTokenOrderBook) {
        return securityTokenOrderBook.getSecurityTokenBuyOrders().get(securityToken).getBuyOrders();
    }

    public SecurityTokenOrderBook addToSecurityTokenSellOrders(SecurityToken securityToken, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        securityTokenOrderBook.addToSellOrders(securityToken, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook addToSecurityTokenBuyOrders(SecurityToken securityToken, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        securityTokenOrderBook.addToBuyOrders(securityToken, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook removeFromSecurityTokenSellOrders(SecurityToken securityToken, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        securityTokenOrderBook.removeFromSellOrders(securityToken, order);
        return securityTokenOrderBook;
    }

    public SecurityTokenOrderBook removeFromSecurityTokenBuyOrders(SecurityToken securityToken, Order order, SecurityTokenOrderBook securityTokenOrderBook) {
        securityTokenOrderBook.removeFromBuyOrders(securityToken, order);
        return securityTokenOrderBook;
    }

}
