package swiss.alpinetech.exchange.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import swiss.alpinetech.exchange.web.rest.TestUtil;

public class WhiteListingTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(WhiteListing.class);
        WhiteListing whiteListing1 = new WhiteListing();
        whiteListing1.setId(1L);
        WhiteListing whiteListing2 = new WhiteListing();
        whiteListing2.setId(whiteListing1.getId());
        assertThat(whiteListing1).isEqualTo(whiteListing2);
        whiteListing2.setId(2L);
        assertThat(whiteListing1).isNotEqualTo(whiteListing2);
        whiteListing1.setId(null);
        assertThat(whiteListing1).isNotEqualTo(whiteListing2);
    }
}
