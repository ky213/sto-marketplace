package swiss.alpinetech.exchange.web.rest;

import org.springframework.security.access.prepost.PreAuthorize;
import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.WhiteListing;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.WhiteListingService;
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
 * REST controller for managing {@link swiss.alpinetech.exchange.domain.WhiteListing}.
 */
@RestController
@RequestMapping("/api")
public class WhiteListingResource {

    private final Logger log = LoggerFactory.getLogger(WhiteListingResource.class);

    private static final String ENTITY_NAME = "whiteListing";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WhiteListingService whiteListingService;

    public WhiteListingResource(WhiteListingService whiteListingService) {
        this.whiteListingService = whiteListingService;
    }

    /**
     * {@code POST  /white-listings} : Create a new whiteListing.
     *
     * @param whiteListing the whiteListing to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new whiteListing, or with status {@code 400 (Bad Request)} if the whiteListing has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/white-listings")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<WhiteListing> createWhiteListing(@Valid @RequestBody WhiteListing whiteListing) throws URISyntaxException {
        log.debug("REST request to save WhiteListing : {}", whiteListing);
        if (whiteListing.getId() != null) {
            throw new BadRequestAlertException("A new whiteListing cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WhiteListing result = whiteListingService.save(whiteListing);
        return ResponseEntity.created(new URI("/api/white-listings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code POST  /white-listings} : Create a new whiteListing.
     *
     * @param whiteListing the whiteListing to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new whiteListing, or with status {@code 400 (Bad Request)} if the whiteListing has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/create-whitelistings")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<WhiteListing> customCreateWhiteListing(@Valid @RequestBody WhiteListing whiteListing) throws URISyntaxException {
        log.debug("REST request to create WhiteListing : {}", whiteListing);
        if (whiteListing.getId() != null) {
            throw new BadRequestAlertException("A new whiteListing cannot already have an ID", ENTITY_NAME, "idexists");
        }
        WhiteListing result = whiteListingService.create(whiteListing);
        return ResponseEntity.created(new URI("/api/white-listings/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /white-listings} : Updates an existing whiteListing.
     *
     * @param whiteListing the whiteListing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated whiteListing,
     * or with status {@code 400 (Bad Request)} if the whiteListing is not valid,
     * or with status {@code 500 (Internal Server Error)} if the whiteListing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/white-listings")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<WhiteListing> updateWhiteListing(@Valid @RequestBody WhiteListing whiteListing) throws URISyntaxException {
        log.debug("REST request to update WhiteListing : {}", whiteListing);
        if (whiteListing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WhiteListing result = whiteListingService.save(whiteListing);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, whiteListing.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /white-listings} : Updates an existing whiteListing.
     *
     * @param whiteListing the whiteListing to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated whiteListing,
     * or with status {@code 400 (Bad Request)} if the whiteListing is not valid,
     * or with status {@code 500 (Internal Server Error)} if the whiteListing couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/update-white-listings")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<WhiteListing> updateWhiteListings(@Valid @RequestBody WhiteListing whiteListing) throws URISyntaxException {
        log.debug("REST request to update WhiteListing : {}", whiteListing);
        if (whiteListing.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        WhiteListing result = whiteListingService.update(whiteListing);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, whiteListing.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /white-listings} : get all the whiteListings.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of whiteListings in body.
     */
    @GetMapping("/white-listings")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\")")
    public ResponseEntity<List<WhiteListing>> getAllWhiteListings(Pageable pageable) {
        log.debug("REST request to get a page of WhiteListings");
        Page<WhiteListing> page = whiteListingService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /user-orders} : get user orders.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the user orders, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-white-listings")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.USER+"\")")
    public ResponseEntity<List<WhiteListing>> getUserWhiteListings(Pageable pageable) {
        log.debug("REST request to get User WhiteListings");
        Page<WhiteListing> page = whiteListingService.findUserwhiteListings(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /white-listings/:id} : get the "id" whiteListing.
     *
     * @param id the id of the whiteListing to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the whiteListing, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/white-listings/{id}")
    public ResponseEntity<WhiteListing> getWhiteListing(@PathVariable Long id) {
        log.debug("REST request to get WhiteListing : {}", id);
        Optional<WhiteListing> whiteListing = whiteListingService.findOne(id);
        return ResponseUtil.wrapOrNotFound(whiteListing);
    }

    /**
     * {@code DELETE  /white-listings/:id} : delete the "id" whiteListing.
     *
     * @param id the id of the whiteListing to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/white-listings/{id}")
    public ResponseEntity<Void> deleteWhiteListing(@PathVariable Long id) {
        log.debug("REST request to delete WhiteListing : {}", id);
        whiteListingService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/white-listings?query=:query} : search for the whiteListing corresponding
     * to the query.
     *
     * @param query the query of the whiteListing search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/white-listings")
    public ResponseEntity<List<WhiteListing>> searchWhiteListings(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of WhiteListings for query {}", query);
        Page<WhiteListing> page = whiteListingService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code SEARCH  /_search/white-listings?query=:query} : search for the whiteListing corresponding
     * to the query.
     *
     * @param query the query of the whiteListing search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/user-white-listings")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.USER+"\")")
    public ResponseEntity<List<WhiteListing>> searchUserWhiteListings(@RequestParam String query, @RequestParam Long userId, Pageable pageable) {
        log.debug("REST request to search for a page of user {} WhiteListings for query {}", userId, query);
        Page<WhiteListing> page = whiteListingService.searchUserWhiteListings(query, userId, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
