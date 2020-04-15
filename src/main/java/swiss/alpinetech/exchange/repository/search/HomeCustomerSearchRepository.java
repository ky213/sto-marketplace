package swiss.alpinetech.exchange.repository.search;

import swiss.alpinetech.exchange.domain.HomeCustomer;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link HomeCustomer} entity.
 */
public interface HomeCustomerSearchRepository extends ElasticsearchRepository<HomeCustomer, Long> {
}
