package swiss.alpinetech.exchange.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import swiss.alpinetech.exchange.web.rest.TestUtil;

public class HomeBankTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HomeBank.class);
        HomeBank homeBank1 = new HomeBank();
        homeBank1.setId(1L);
        HomeBank homeBank2 = new HomeBank();
        homeBank2.setId(homeBank1.getId());
        assertThat(homeBank1).isEqualTo(homeBank2);
        homeBank2.setId(2L);
        assertThat(homeBank1).isNotEqualTo(homeBank2);
        homeBank1.setId(null);
        assertThat(homeBank1).isNotEqualTo(homeBank2);
    }
}
