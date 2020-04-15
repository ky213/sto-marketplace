package swiss.alpinetech.exchange.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import swiss.alpinetech.exchange.web.rest.TestUtil;

public class HomeCustomerTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HomeCustomer.class);
        HomeCustomer homeCustomer1 = new HomeCustomer();
        homeCustomer1.setId(1L);
        HomeCustomer homeCustomer2 = new HomeCustomer();
        homeCustomer2.setId(homeCustomer1.getId());
        assertThat(homeCustomer1).isEqualTo(homeCustomer2);
        homeCustomer2.setId(2L);
        assertThat(homeCustomer1).isNotEqualTo(homeCustomer2);
        homeCustomer1.setId(null);
        assertThat(homeCustomer1).isNotEqualTo(homeCustomer2);
    }
}
