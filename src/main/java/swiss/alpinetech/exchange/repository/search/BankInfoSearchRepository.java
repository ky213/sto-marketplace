package swiss.alpinetech.exchange.repository.search;

import swiss.alpinetech.exchange.domain.BankInfo;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link BankInfo} entity.
 */
public interface BankInfoSearchRepository extends ElasticsearchRepository<BankInfo, Long> {
}
