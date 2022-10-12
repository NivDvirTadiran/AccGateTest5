package tadiran.gateserver.repository;

import java.util.Optional;

import tadiran.gateserver.models.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import tadiran.gateserver.models.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByeRole(ERole eRole);
}
