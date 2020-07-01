package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.Order;
import swiss.alpinetech.exchange.domain.Transaction;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Transaction}.
 */
public interface TransactionService {

    /**
     * Save a transaction.
     *
     * @param transaction the entity to save.
     * @return the persisted entity.
     */
    Transaction save(Transaction transaction);

    /**
     * Create a transaction.
     *
     * @param transaction the entity to create.
     * @return the persisted entity.
     */
    Transaction createBuyTransaction(Transaction transaction, Order buyOrder, Order sellOrder);

    /**
     * Create a transaction.
     *
     * @param transaction the entity to create.
     * @return the persisted entity.
     */
    Transaction createSellTransaction(Transaction transaction, Order buyOrder, Order sellOrder);

    /**
     * Get all the transactions.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Transaction> findAll(Pageable pageable);

    /**
     * Get the "id" transaction.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Transaction> findOne(Long id) throws Exception;

    /**
     * Delete the "id" transaction.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the transaction corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Transaction> search(String query, Pageable pageable);
}
