package swiss.alpinetech.exchange.repository.search;

import swiss.alpinetech.exchange.domain.HomeBank;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link HomeBank} entity.
 */
public interface HomeBankSearchRepository extends ElasticsearchRepository<HomeBank, Long> {
}
