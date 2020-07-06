package swiss.alpinetech.exchange.web.activemq;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import swiss.alpinetech.exchange.domain.*;
import swiss.alpinetech.exchange.service.TradeService;

import java.util.List;
import java.util.Map;

@Component
public class Listener {


    @Autowired
    private TradeService tradeService;

    private final Logger log = LoggerFactory.getLogger(Listener.class);

    @JmsListener(destination = "inbound.order.topic")
    @SendTo("outbound.order.topic")
    public List<Trade> receiveMessage(final Order order) throws JsonProcessingException {
        log.debug("process order {} in match engine", order);
        List<Trade> tradeList = this.tradeService.Process(order);
        log.debug("Send trade list {} to outbound.order.topic", tradeList.toString());
        return tradeList;
    }

    @JmsListener(destination = "inbound.orderBook.topic")
    @SendTo("outbound.orderBook.topic")
    @Transactional
    public Object receiveOrderBookMessage(final Map<String, Map<String, List<String>>> orderBook) {
        log.debug("store orderBook {} in queue", orderBook);
        log.debug("send orderBook {} to outbound.order.topic", orderBook.toString());
        return orderBook;
    }
}
