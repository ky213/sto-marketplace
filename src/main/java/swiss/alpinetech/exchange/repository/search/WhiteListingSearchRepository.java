package swiss.alpinetech.exchange.repository.search;

import swiss.alpinetech.exchange.domain.WhiteListing;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link WhiteListing} entity.
 */
public interface WhiteListingSearchRepository extends ElasticsearchRepository<WhiteListing, Long> {
}
