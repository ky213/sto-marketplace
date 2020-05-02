package swiss.alpinetech.exchange.web.rest;

import org.springframework.security.access.prepost.PreAuthorize;
import swiss.alpinetech.exchange.domain.SecurityToken;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.SecurityTokenService;
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
 * REST controller for managing {@link swiss.alpinetech.exchange.domain.SecurityToken}.
 */
@RestController
@RequestMapping("/api")
public class SecurityTokenResource {

    private final Logger log = LoggerFactory.getLogger(SecurityTokenResource.class);

    private static final String ENTITY_NAME = "securityToken";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SecurityTokenService securityTokenService;

    public SecurityTokenResource(SecurityTokenService securityTokenService) {
        this.securityTokenService = securityTokenService;
    }

    /**
     * {@code POST  /security-tokens} : Create a new securityToken.
     *
     * @param securityToken the securityToken to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new securityToken, or with status {@code 400 (Bad Request)} if the securityToken has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/security-tokens")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<SecurityToken> createSecurityToken(@Valid @RequestBody SecurityToken securityToken) throws URISyntaxException {
        log.debug("REST request to save SecurityToken : {}", securityToken);
        if (securityToken.getId() != null) {
            throw new BadRequestAlertException("A new securityToken cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SecurityToken result = securityTokenService.save(securityToken);
        return ResponseEntity.created(new URI("/api/security-tokens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /security-tokens} : Updates an existing securityToken.
     *
     * @param securityToken the securityToken to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated securityToken,
     * or with status {@code 400 (Bad Request)} if the securityToken is not valid,
     * or with status {@code 500 (Internal Server Error)} if the securityToken couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/security-tokens")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<SecurityToken> updateSecurityToken(@Valid @RequestBody SecurityToken securityToken) throws URISyntaxException {
        log.debug("REST request to update SecurityToken : {}", securityToken);
        if (securityToken.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        SecurityToken result = securityTokenService.save(securityToken);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, securityToken.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /security-tokens} : get all the securityTokens.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of securityTokens in body.
     */
    @GetMapping("/security-tokens")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<SecurityToken>> getAllSecurityTokens(Pageable pageable) {
        log.debug("REST request to get a page of SecurityTokens");
        Page<SecurityToken> page = securityTokenService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /security-tokens/:id} : get the "id" securityToken.
     *
     * @param id the id of the securityToken to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the securityToken, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/security-tokens/{id}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<SecurityToken> getSecurityToken(@PathVariable Long id) {
        log.debug("REST request to get SecurityToken : {}", id);
        Optional<SecurityToken> securityToken = securityTokenService.findOne(id);
        return ResponseUtil.wrapOrNotFound(securityToken);
    }

    /**
     * {@code DELETE  /security-tokens/:id} : delete the "id" securityToken.
     *
     * @param id the id of the securityToken to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/security-tokens/{id}")
    public ResponseEntity<Void> deleteSecurityToken(@PathVariable Long id) {
        log.debug("REST request to delete SecurityToken : {}", id);
        securityTokenService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/security-tokens?query=:query} : search for the securityToken corresponding
     * to the query.
     *
     * @param query the query of the securityToken search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/security-tokens")
    public ResponseEntity<List<SecurityToken>> searchSecurityTokens(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of SecurityTokens for query {}", query);
        Page<SecurityToken> page = securityTokenService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
