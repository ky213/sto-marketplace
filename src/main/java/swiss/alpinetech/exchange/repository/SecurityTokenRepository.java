package swiss.alpinetech.exchange.repository;

import swiss.alpinetech.exchange.domain.SecurityToken;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the SecurityToken entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SecurityTokenRepository extends JpaRepository<SecurityToken, Long> {
}
