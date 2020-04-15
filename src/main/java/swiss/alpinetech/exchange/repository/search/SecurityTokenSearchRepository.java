package swiss.alpinetech.exchange.repository.search;

import swiss.alpinetech.exchange.domain.SecurityToken;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link SecurityToken} entity.
 */
public interface SecurityTokenSearchRepository extends ElasticsearchRepository<SecurityToken, Long> {
}
