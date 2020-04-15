package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.domain.HomeCustomer;
import swiss.alpinetech.exchange.service.HomeCustomerService;
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
 * REST controller for managing {@link swiss.alpinetech.exchange.domain.HomeCustomer}.
 */
@RestController
@RequestMapping("/api")
public class HomeCustomerResource {

    private final Logger log = LoggerFactory.getLogger(HomeCustomerResource.class);

    private static final String ENTITY_NAME = "homeCustomer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HomeCustomerService homeCustomerService;

    public HomeCustomerResource(HomeCustomerService homeCustomerService) {
        this.homeCustomerService = homeCustomerService;
    }

    /**
     * {@code POST  /home-customers} : Create a new homeCustomer.
     *
     * @param homeCustomer the homeCustomer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new homeCustomer, or with status {@code 400 (Bad Request)} if the homeCustomer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/home-customers")
    public ResponseEntity<HomeCustomer> createHomeCustomer(@Valid @RequestBody HomeCustomer homeCustomer) throws URISyntaxException {
        log.debug("REST request to save HomeCustomer : {}", homeCustomer);
        if (homeCustomer.getId() != null) {
            throw new BadRequestAlertException("A new homeCustomer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HomeCustomer result = homeCustomerService.save(homeCustomer);
        return ResponseEntity.created(new URI("/api/home-customers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /home-customers} : Updates an existing homeCustomer.
     *
     * @param homeCustomer the homeCustomer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated homeCustomer,
     * or with status {@code 400 (Bad Request)} if the homeCustomer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the homeCustomer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/home-customers")
    public ResponseEntity<HomeCustomer> updateHomeCustomer(@Valid @RequestBody HomeCustomer homeCustomer) throws URISyntaxException {
        log.debug("REST request to update HomeCustomer : {}", homeCustomer);
        if (homeCustomer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        HomeCustomer result = homeCustomerService.save(homeCustomer);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, homeCustomer.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /home-customers} : get all the homeCustomers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of homeCustomers in body.
     */
    @GetMapping("/home-customers")
    public ResponseEntity<List<HomeCustomer>> getAllHomeCustomers(Pageable pageable) {
        log.debug("REST request to get a page of HomeCustomers");
        Page<HomeCustomer> page = homeCustomerService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /home-customers/:id} : get the "id" homeCustomer.
     *
     * @param id the id of the homeCustomer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the homeCustomer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/home-customers/{id}")
    public ResponseEntity<HomeCustomer> getHomeCustomer(@PathVariable Long id) {
        log.debug("REST request to get HomeCustomer : {}", id);
        Optional<HomeCustomer> homeCustomer = homeCustomerService.findOne(id);
        return ResponseUtil.wrapOrNotFound(homeCustomer);
    }

    /**
     * {@code DELETE  /home-customers/:id} : delete the "id" homeCustomer.
     *
     * @param id the id of the homeCustomer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/home-customers/{id}")
    public ResponseEntity<Void> deleteHomeCustomer(@PathVariable Long id) {
        log.debug("REST request to delete HomeCustomer : {}", id);
        homeCustomerService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/home-customers?query=:query} : search for the homeCustomer corresponding
     * to the query.
     *
     * @param query the query of the homeCustomer search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/home-customers")
    public ResponseEntity<List<HomeCustomer>> searchHomeCustomers(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of HomeCustomers for query {}", query);
        Page<HomeCustomer> page = homeCustomerService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
