package swiss.alpinetech.exchange.repository;

import swiss.alpinetech.exchange.domain.Authority;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {

    Optional<Authority> findByName(String name);
}
