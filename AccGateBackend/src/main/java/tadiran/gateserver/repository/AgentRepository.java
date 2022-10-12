package tadiran.gateserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tadiran.gateserver.models.Agent;

import java.util.Optional;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Integer> {
  Optional<Agent> findByaName(String username);

  Boolean existsByaName(String aName);

}
