package swiss.alpinetech.exchange.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link SecurityTokenSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class SecurityTokenSearchRepositoryMockConfiguration {

    @MockBean
    private SecurityTokenSearchRepository mockSecurityTokenSearchRepository;

}
