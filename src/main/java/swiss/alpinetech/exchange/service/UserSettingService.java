package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.UserSetting;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link UserSetting}.
 */
public interface UserSettingService {

    /**
     * Save a userSetting.
     *
     * @param userSetting the entity to save.
     * @return the persisted entity.
     */
    UserSetting save(UserSetting userSetting);

    /**
     * Get all the userSettings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserSetting> findAll(Pageable pageable);

    /**
     * Get the "id" userSetting.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<UserSetting> findOne(Long id);

    /**
     * Delete the "id" userSetting.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the userSetting corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<UserSetting> search(String query, Pageable pageable);
}
