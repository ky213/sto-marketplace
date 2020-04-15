package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.domain.HomeBank;
import swiss.alpinetech.exchange.service.HomeBankService;
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
 * REST controller for managing {@link swiss.alpinetech.exchange.domain.HomeBank}.
 */
@RestController
@RequestMapping("/api")
public class HomeBankResource {

    private final Logger log = LoggerFactory.getLogger(HomeBankResource.class);

    private static final String ENTITY_NAME = "homeBank";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HomeBankService homeBankService;

    public HomeBankResource(HomeBankService homeBankService) {
        this.homeBankService = homeBankService;
    }

    /**
     * {@code POST  /home-banks} : Create a new homeBank.
     *
     * @param homeBank the homeBank to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new homeBank, or with status {@code 400 (Bad Request)} if the homeBank has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/home-banks")
    public ResponseEntity<HomeBank> createHomeBank(@Valid @RequestBody HomeBank homeBank) throws URISyntaxException {
        log.debug("REST request to save HomeBank : {}", homeBank);
        if (homeBank.getId() != null) {
            throw new BadRequestAlertException("A new homeBank cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HomeBank result = homeBankService.save(homeBank);
        return ResponseEntity.created(new URI("/api/home-banks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /home-banks} : Updates an existing homeBank.
     *
     * @param homeBank the homeBank to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated homeBank,
     * or with status {@code 400 (Bad Request)} if the homeBank is not valid,
     * or with status {@code 500 (Internal Server Error)} if the homeBank couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/home-banks")
    public ResponseEntity<HomeBank> updateHomeBank(@Valid @RequestBody HomeBank homeBank) throws URISyntaxException {
        log.debug("REST request to update HomeBank : {}", homeBank);
        if (homeBank.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        HomeBank result = homeBankService.save(homeBank);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, homeBank.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /home-banks} : get all the homeBanks.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of homeBanks in body.
     */
    @GetMapping("/home-banks")
    public ResponseEntity<List<HomeBank>> getAllHomeBanks(Pageable pageable) {
        log.debug("REST request to get a page of HomeBanks");
        Page<HomeBank> page = homeBankService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /home-banks/:id} : get the "id" homeBank.
     *
     * @param id the id of the homeBank to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the homeBank, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/home-banks/{id}")
    public ResponseEntity<HomeBank> getHomeBank(@PathVariable Long id) {
        log.debug("REST request to get HomeBank : {}", id);
        Optional<HomeBank> homeBank = homeBankService.findOne(id);
        return ResponseUtil.wrapOrNotFound(homeBank);
    }

    /**
     * {@code DELETE  /home-banks/:id} : delete the "id" homeBank.
     *
     * @param id the id of the homeBank to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/home-banks/{id}")
    public ResponseEntity<Void> deleteHomeBank(@PathVariable Long id) {
        log.debug("REST request to delete HomeBank : {}", id);
        homeBankService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/home-banks?query=:query} : search for the homeBank corresponding
     * to the query.
     *
     * @param query the query of the homeBank search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/home-banks")
    public ResponseEntity<List<HomeBank>> searchHomeBanks(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of HomeBanks for query {}", query);
        Page<HomeBank> page = homeBankService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
