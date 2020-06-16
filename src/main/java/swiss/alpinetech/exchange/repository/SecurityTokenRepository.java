package swiss.alpinetech.exchange.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.SecurityToken;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the SecurityToken entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SecurityTokenRepository extends JpaRepository<SecurityToken, Long> {

    @Query("select securityToken from SecurityToken securityToken where securityToken.status = 'ACTIVE'")
    Page<SecurityToken> findAllByStatusACTIVE(Pageable pageable);
}
