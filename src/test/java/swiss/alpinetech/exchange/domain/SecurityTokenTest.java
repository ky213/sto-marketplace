package swiss.alpinetech.exchange.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import swiss.alpinetech.exchange.web.rest.TestUtil;

public class SecurityTokenTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SecurityToken.class);
        SecurityToken securityToken1 = new SecurityToken();
        securityToken1.setId(1L);
        SecurityToken securityToken2 = new SecurityToken();
        securityToken2.setId(securityToken1.getId());
        assertThat(securityToken1).isEqualTo(securityToken2);
        securityToken2.setId(2L);
        assertThat(securityToken1).isNotEqualTo(securityToken2);
        securityToken1.setId(null);
        assertThat(securityToken1).isNotEqualTo(securityToken2);
    }
}
