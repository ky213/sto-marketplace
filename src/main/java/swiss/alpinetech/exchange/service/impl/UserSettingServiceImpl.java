package swiss.alpinetech.exchange.service.impl;

import swiss.alpinetech.exchange.service.UserSettingService;
import swiss.alpinetech.exchange.domain.UserSetting;
import swiss.alpinetech.exchange.repository.UserSettingRepository;
import swiss.alpinetech.exchange.repository.search.UserSettingSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link UserSetting}.
 */
@Service
@Transactional
public class UserSettingServiceImpl implements UserSettingService {

    private final Logger log = LoggerFactory.getLogger(UserSettingServiceImpl.class);

    private final UserSettingRepository userSettingRepository;

    private final UserSettingSearchRepository userSettingSearchRepository;

    public UserSettingServiceImpl(UserSettingRepository userSettingRepository, UserSettingSearchRepository userSettingSearchRepository) {
        this.userSettingRepository = userSettingRepository;
        this.userSettingSearchRepository = userSettingSearchRepository;
    }

    /**
     * Save a userSetting.
     *
     * @param userSetting the entity to save.
     * @return the persisted entity.
     */
    @Override
    public UserSetting save(UserSetting userSetting) {
        log.debug("Request to save UserSetting : {}", userSetting);
        UserSetting result = userSettingRepository.save(userSetting);
        userSettingSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the userSettings.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<UserSetting> findAll(Pageable pageable) {
        log.debug("Request to get all UserSettings");
        return userSettingRepository.findAll(pageable);
    }

    /**
     * Get one userSetting by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<UserSetting> findOne(Long id) {
        log.debug("Request to get UserSetting : {}", id);
        return userSettingRepository.findById(id);
    }

    /**
     * Delete the userSetting by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete UserSetting : {}", id);
        userSettingRepository.deleteById(id);
        userSettingSearchRepository.deleteById(id);
    }

    /**
     * Search for the userSetting corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<UserSetting> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of UserSettings for query {}", query);
        return userSettingSearchRepository.search(queryStringQuery(query), pageable);    }
}
