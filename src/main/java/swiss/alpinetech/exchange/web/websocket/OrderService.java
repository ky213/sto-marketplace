package swiss.alpinetech.exchange.web.websocket;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import swiss.alpinetech.exchange.domain.Order;

@Controller
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(ActivityService.class);

    private final SimpMessageSendingOperations messagingTemplate;

    public OrderService(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/topic/order")
    @SendTo("/topic/order-tracker")
    public Order sendOrder(@Payload Order order) {
        log.debug("Sending order tracking data {}", order);
        return order;
    }
}
