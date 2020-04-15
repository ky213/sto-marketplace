package swiss.alpinetech.exchange.repository;

import swiss.alpinetech.exchange.domain.BankInfo;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the BankInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface BankInfoRepository extends JpaRepository<BankInfo, Long> {
}
