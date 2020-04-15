package swiss.alpinetech.exchange.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link HomeBankSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class HomeBankSearchRepositoryMockConfiguration {

    @MockBean
    private HomeBankSearchRepository mockHomeBankSearchRepository;

}
