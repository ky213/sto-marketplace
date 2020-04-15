package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.domain.UserSetting;
import swiss.alpinetech.exchange.service.UserSettingService;
import swiss.alpinetech.exchange.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link swiss.alpinetech.exchange.domain.UserSetting}.
 */
@RestController
@RequestMapping("/api")
public class UserSettingResource {

    private final Logger log = LoggerFactory.getLogger(UserSettingResource.class);

    private static final String ENTITY_NAME = "userSetting";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserSettingService userSettingService;

    public UserSettingResource(UserSettingService userSettingService) {
        this.userSettingService = userSettingService;
    }

    /**
     * {@code POST  /user-settings} : Create a new userSetting.
     *
     * @param userSetting the userSetting to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userSetting, or with status {@code 400 (Bad Request)} if the userSetting has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-settings")
    public ResponseEntity<UserSetting> createUserSetting(@Valid @RequestBody UserSetting userSetting) throws URISyntaxException {
        log.debug("REST request to save UserSetting : {}", userSetting);
        if (userSetting.getId() != null) {
            throw new BadRequestAlertException("A new userSetting cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserSetting result = userSettingService.save(userSetting);
        return ResponseEntity.created(new URI("/api/user-settings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-settings} : Updates an existing userSetting.
     *
     * @param userSetting the userSetting to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userSetting,
     * or with status {@code 400 (Bad Request)} if the userSetting is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userSetting couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-settings")
    public ResponseEntity<UserSetting> updateUserSetting(@Valid @RequestBody UserSetting userSetting) throws URISyntaxException {
        log.debug("REST request to update UserSetting : {}", userSetting);
        if (userSetting.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserSetting result = userSettingService.save(userSetting);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userSetting.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /user-settings} : get all the userSettings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userSettings in body.
     */
    @GetMapping("/user-settings")
    public ResponseEntity<List<UserSetting>> getAllUserSettings(Pageable pageable) {
        log.debug("REST request to get a page of UserSettings");
        Page<UserSetting> page = userSettingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-settings/:id} : get the "id" userSetting.
     *
     * @param id the id of the userSetting to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userSetting, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-settings/{id}")
    public ResponseEntity<UserSetting> getUserSetting(@PathVariable Long id) {
        log.debug("REST request to get UserSetting : {}", id);
        Optional<UserSetting> userSetting = userSettingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userSetting);
    }

    /**
     * {@code DELETE  /user-settings/:id} : delete the "id" userSetting.
     *
     * @param id the id of the userSetting to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-settings/{id}")
    public ResponseEntity<Void> deleteUserSetting(@PathVariable Long id) {
        log.debug("REST request to delete UserSetting : {}", id);
        userSettingService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/user-settings?query=:query} : search for the userSetting corresponding
     * to the query.
     *
     * @param query the query of the userSetting search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/user-settings")
    public ResponseEntity<List<UserSetting>> searchUserSettings(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of UserSettings for query {}", query);
        Page<UserSetting> page = userSettingService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
