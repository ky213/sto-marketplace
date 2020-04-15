package swiss.alpinetech.exchange.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link UserSettingSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class UserSettingSearchRepositoryMockConfiguration {

    @MockBean
    private UserSettingSearchRepository mockUserSettingSearchRepository;

}
