package tadiran.gateserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tadiran.gateserver.models.Sup;

import java.util.Optional;

@Repository
public interface SupRepository extends JpaRepository<Sup, String> {
  Optional<Sup> findBySupName(String username);

  Boolean existsBySupName(String username);
}
