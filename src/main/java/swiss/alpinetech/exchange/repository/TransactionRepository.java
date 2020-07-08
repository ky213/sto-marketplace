package swiss.alpinetech.exchange.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import swiss.alpinetech.exchange.domain.Transaction;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;

/**
 * Spring Data  repository for the Transaction entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("select transaction from Transaction transaction where transaction.buyerid = ?1 or transaction.sellerid = ?1")
    Page<Transaction> findAllByUser(Long userId, Pageable pageable);

    List<Transaction> findBySecurityTokenNameAndCreateDateBetween(String securityTokenName, ZonedDateTime startDate, ZonedDateTime endDate);
}
