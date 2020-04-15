package swiss.alpinetech.exchange.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import swiss.alpinetech.exchange.web.rest.TestUtil;

public class BankInfoTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(BankInfo.class);
        BankInfo bankInfo1 = new BankInfo();
        bankInfo1.setId(1L);
        BankInfo bankInfo2 = new BankInfo();
        bankInfo2.setId(bankInfo1.getId());
        assertThat(bankInfo1).isEqualTo(bankInfo2);
        bankInfo2.setId(2L);
        assertThat(bankInfo1).isNotEqualTo(bankInfo2);
        bankInfo1.setId(null);
        assertThat(bankInfo1).isNotEqualTo(bankInfo2);
    }
}
