package swiss.alpinetech.exchange.repository;

import swiss.alpinetech.exchange.domain.UserSetting;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the UserSetting entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserSettingRepository extends JpaRepository<UserSetting, Long> {
}
