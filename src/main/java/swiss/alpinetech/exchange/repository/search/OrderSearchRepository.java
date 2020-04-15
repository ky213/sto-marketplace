package swiss.alpinetech.exchange.repository.search;

import swiss.alpinetech.exchange.domain.Order;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Order} entity.
 */
public interface OrderSearchRepository extends ElasticsearchRepository<Order, Long> {
}
