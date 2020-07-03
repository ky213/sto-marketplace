package swiss.alpinetech.exchange.web.activemq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Component;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.Trade;
import swiss.alpinetech.exchange.service.TradeService;

import javax.jms.JMSException;
import java.util.List;

@Component
public class Listener {


    private TradeService tradeService = new TradeService();

    private final Logger log = LoggerFactory.getLogger(Listener.class);

    @JmsListener(destination = "inbound.order.topic")
    @SendTo("outbound.order.topic")
    public List<Trade> receiveMessage(final Order order) throws JMSException {
        log.debug("process order {} in match engine", order);
        List<Trade> tradeList = this.tradeService.Process(order);
        log.debug("Send trade list {} to outbound.order.topic", tradeList.toString());
        return tradeList;
    }
}
