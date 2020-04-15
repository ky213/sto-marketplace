package swiss.alpinetech.exchange.repository.search;

import swiss.alpinetech.exchange.domain.UserSetting;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link UserSetting} entity.
 */
public interface UserSettingSearchRepository extends ElasticsearchRepository<UserSetting, Long> {
}
