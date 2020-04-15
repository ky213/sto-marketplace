package swiss.alpinetech.exchange.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link WhiteListingSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class WhiteListingSearchRepositoryMockConfiguration {

    @MockBean
    private WhiteListingSearchRepository mockWhiteListingSearchRepository;

}
