package swiss.alpinetech.exchange.web.rest;

import org.springframework.security.access.prepost.PreAuthorize;
import swiss.alpinetech.exchange.domain.BankInfo;
import swiss.alpinetech.exchange.security.AuthoritiesConstants;
import swiss.alpinetech.exchange.service.BankInfoService;
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
 * REST controller for managing {@link swiss.alpinetech.exchange.domain.BankInfo}.
 */
@RestController
@RequestMapping("/api")
public class BankInfoResource {

    private final Logger log = LoggerFactory.getLogger(BankInfoResource.class);

    private static final String ENTITY_NAME = "bankInfo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BankInfoService bankInfoService;

    public BankInfoResource(BankInfoService bankInfoService) {
        this.bankInfoService = bankInfoService;
    }

    /**
     * {@code POST  /bank-infos} : Create a new bankInfo.
     *
     * @param bankInfo the bankInfo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new bankInfo, or with status {@code 400 (Bad Request)} if the bankInfo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/bank-infos")
    public ResponseEntity<BankInfo> createBankInfo(@Valid @RequestBody BankInfo bankInfo) throws URISyntaxException {
        log.debug("REST request to save BankInfo : {}", bankInfo);
        if (bankInfo.getId() != null) {
            throw new BadRequestAlertException("A new bankInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BankInfo result = bankInfoService.save(bankInfo);
        return ResponseEntity.created(new URI("/api/bank-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /bank-infos} : Updates an existing bankInfo.
     *
     * @param bankInfo the bankInfo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated bankInfo,
     * or with status {@code 400 (Bad Request)} if the bankInfo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the bankInfo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/bank-infos")
    public ResponseEntity<BankInfo> updateBankInfo(@Valid @RequestBody BankInfo bankInfo) throws URISyntaxException {
        log.debug("REST request to update BankInfo : {}", bankInfo);
        if (bankInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        BankInfo result = bankInfoService.save(bankInfo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, bankInfo.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /bank-infos} : get all the bankInfos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of bankInfos in body.
     */
    @GetMapping("/bank-infos")
    public ResponseEntity<List<BankInfo>> getAllBankInfos(Pageable pageable) {
        log.debug("REST request to get a page of BankInfos");
        Page<BankInfo> page = bankInfoService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /bank-infos/:id} : get the "id" bankInfo.
     *
     * @param id the id of the bankInfo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bankInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bank-infos/{id}")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\", \""+AuthoritiesConstants.USER+"\")")
    public ResponseEntity<BankInfo> getBankInfo(@PathVariable Long id) {
        log.debug("REST request to get BankInfo : {}", id);
        Optional<BankInfo> bankInfo = bankInfoService.findOne(id);
        return ResponseUtil.wrapOrNotFound(bankInfo);
    }

    /**
     * {@code GET  /bank-infos/:id} : get the "id" bankInfo.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the bankInfo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/bank-infos/first-element")
    @PreAuthorize("hasAnyAuthority(\""+ AuthoritiesConstants.BANK+"\", \""+AuthoritiesConstants.ADMIN+"\", \""+AuthoritiesConstants.USER+"\")")
    public ResponseEntity<BankInfo> getFirstElementBankInfo() {
        log.debug("REST request to get first element of BankInfo list");
        Optional<BankInfo> bankInfo = bankInfoService.getFirstBankInfo();
        return ResponseUtil.wrapOrNotFound(bankInfo);
    }

    /**
     * {@code DELETE  /bank-infos/:id} : delete the "id" bankInfo.
     *
     * @param id the id of the bankInfo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/bank-infos/{id}")
    public ResponseEntity<Void> deleteBankInfo(@PathVariable Long id) {
        log.debug("REST request to delete BankInfo : {}", id);
        bankInfoService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/bank-infos?query=:query} : search for the bankInfo corresponding
     * to the query.
     *
     * @param query the query of the bankInfo search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/bank-infos")
    public ResponseEntity<List<BankInfo>> searchBankInfos(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of BankInfos for query {}", query);
        Page<BankInfo> page = bankInfoService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
