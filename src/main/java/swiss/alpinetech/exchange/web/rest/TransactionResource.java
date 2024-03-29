package swiss.alpinetech.exchange.web.rest;

import swiss.alpinetech.exchange.domain.Transaction;
import swiss.alpinetech.exchange.service.TransactionService;
import swiss.alpinetech.exchange.service.dto.TransactionPriceDTO;
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
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link swiss.alpinetech.exchange.domain.Transaction}.
 */
@RestController
@RequestMapping("/api")
public class TransactionResource {

    private final Logger log = LoggerFactory.getLogger(TransactionResource.class);

    private static final String ENTITY_NAME = "transaction";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TransactionService transactionService;

    public TransactionResource(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * {@code POST  /transactions} : Create a new transaction.
     *
     * @param transaction the transaction to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new transaction, or with status {@code 400 (Bad Request)} if the transaction has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) throws URISyntaxException {
        log.debug("REST request to save Transaction : {}", transaction);
        if (transaction.getId() != null) {
            throw new BadRequestAlertException("A new transaction cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Transaction result = transactionService.save(transaction);
        return ResponseEntity.created(new URI("/api/transactions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /transactions} : Updates an existing transaction.
     *
     * @param transaction the transaction to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated transaction,
     * or with status {@code 400 (Bad Request)} if the transaction is not valid,
     * or with status {@code 500 (Internal Server Error)} if the transaction couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/transactions")
    public ResponseEntity<Transaction> updateTransaction(@Valid @RequestBody Transaction transaction) throws URISyntaxException {
        log.debug("REST request to update Transaction : {}", transaction);
        if (transaction.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Transaction result = transactionService.save(transaction);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, transaction.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /transactions} : get all the transactions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of transactions in body.
     */
    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions(Pageable pageable) {
        log.debug("REST request to get a page of Transactions");
        Page<Transaction> page = transactionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /transactions} : get all the transactions.
     *
     * @param securityTokenName the security token name.
     * @param startDate the start created date.
     * @param endDate the end created date.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of TransactionPriceDTO in body.
     */
    @GetMapping("/transactions-prices")
    public ResponseEntity<List<TransactionPriceDTO>> getBySecurityTokenBetweenDate(@RequestParam String securityTokenName, @RequestParam String startDate, @RequestParam String endDate) {
        log.debug("REST request to get all Transactions by security token name and between two created dates");
        ZonedDateTime beginDateParam = ZonedDateTime.parse(startDate);
        ZonedDateTime endDateParam = ZonedDateTime.parse(endDate);
        List<TransactionPriceDTO> transactionPriceDTOS = transactionService.findBySecurityTokenBetweenDate(securityTokenName, beginDateParam, endDateParam);
        return ResponseEntity.ok().body(transactionPriceDTOS);
    }

    /**
     * {@code GET  /transactions-success} : get number of all success transactions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the number of all success transactions.
     */
    @GetMapping("/transactions-success")
    public ResponseEntity<Integer> getNumberOfSuccess() {
        log.debug("REST request to get number of all success transactions");
        Integer number = transactionService.countAllSuccess();
        return ResponseEntity.ok().body(number);
    }

    /**
     * {@code GET  /transactions-success} : get number of all success transactions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the number of all success transactions.
     */
    @GetMapping("/transactions/total-revenue")
    public ResponseEntity<Long> getTotalRevenue() {
        log.debug("REST request to get total revenue");
        Long number = transactionService.getSumFee();
        return ResponseEntity.ok().body(number);
    }

    /**
     * {@code GET  /transactions/:id} : get the "id" transaction.
     *
     * @param id the id of the transaction to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the transaction, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/transactions/{id}")
    public ResponseEntity<Transaction> getTransaction(@PathVariable Long id) throws Exception {
        log.debug("REST request to get Transaction : {}", id);
        Optional<Transaction> transaction = transactionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(transaction);
    }

    /**
     * {@code DELETE  /transactions/:id} : delete the "id" transaction.
     *
     * @param id the id of the transaction to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        log.debug("REST request to delete Transaction : {}", id);
        transactionService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/transactions?query=:query} : search for the transaction corresponding
     * to the query.
     *
     * @param query the query of the transaction search.
     * @param pageable the pagination information.
     * @return the result of the search.
     */
    @GetMapping("/_search/transactions")
    public ResponseEntity<List<Transaction>> searchTransactions(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of Transactions for query {}", query);
        Page<Transaction> page = transactionService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
