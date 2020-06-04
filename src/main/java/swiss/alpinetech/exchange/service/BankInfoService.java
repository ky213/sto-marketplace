package swiss.alpinetech.exchange.service;

import swiss.alpinetech.exchange.domain.BankInfo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link BankInfo}.
 */
public interface BankInfoService {

    /**
     * Save a bankInfo.
     *
     * @param bankInfo the entity to save.
     * @return the persisted entity.
     */
    BankInfo save(BankInfo bankInfo);

    /**
     * Get all the bankInfos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BankInfo> findAll(Pageable pageable);

    /**
     * Get the "id" bankInfo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<BankInfo> findOne(Long id);

    /**
     * Delete the "id" bankInfo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the bankInfo corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<BankInfo> search(String query, Pageable pageable);

    /**
     *
     * @return the first entity of list of all bank info.
     */
    Optional<BankInfo> getFirstBankInfo();
}
