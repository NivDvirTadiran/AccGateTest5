package tadiran.gateserver.security.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tadiran.gateserver.models.Agent;
import tadiran.gateserver.models.User;
import tadiran.gateserver.repository.AgentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentDetailsServiceImpl implements UserDetailsService {
  @Autowired
  AgentRepository agentRepository;


  public static UserDetailsImpl build(Agent agent) {

    return new UserDetailsImpl(
            null,
            agent.getAName(),
            null,
            agent.getAPassword(),
            null,
            null);
  }

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String aName) throws UsernameNotFoundException {
    Agent agent = agentRepository.findByaName(aName)
            .orElseThrow(() -> new UsernameNotFoundException("User Not Found with Agent name: " + aName));

    return build(agent);
  }


}

