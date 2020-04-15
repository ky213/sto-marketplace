package swiss.alpinetech.exchange.repository.search;

import swiss.alpinetech.exchange.domain.Transaction;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Transaction} entity.
 */
public interface TransactionSearchRepository extends ElasticsearchRepository<Transaction, Long> {
}
