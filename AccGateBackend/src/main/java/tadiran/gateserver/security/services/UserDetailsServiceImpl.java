package tadiran.gateserver.security.services;

import tadiran.gateserver.models.Agent;
import tadiran.gateserver.models.Sup;
import tadiran.gateserver.models.User;
import tadiran.gateserver.payload.request.LoginRequest;
import tadiran.gateserver.payload.request.RegisterFormRequest;
import tadiran.gateserver.payload.request.SignupRequest;
import tadiran.gateserver.repository.AgentRepository;
import tadiran.gateserver.repository.SupRepository;
import tadiran.gateserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class UserDetailsServiceImpl implements UserDetailsService {
  @Autowired
  UserRepository userRepository;

  @Autowired
  AgentRepository agentRepository;

  @Autowired
  SupRepository supRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

    return UserDetailsImpl.build(user);
  }

  public boolean isAgentCredentials(LoginRequest loginRequest) throws UsernameNotFoundException {
    return isAgentCredentials(loginRequest.getUsername(), loginRequest.getPassword());
  }

  public boolean isAgentCredentials(RegisterFormRequest registerFormRequest) throws UsernameNotFoundException {
    return isAgentCredentials(registerFormRequest.getUsername(), registerFormRequest.getPassword());
  }

  public boolean isAgentCredentials(String username, String password) throws UsernameNotFoundException {
    if (agentRepository.findByaName(username).isPresent()) {
      Agent agent = agentRepository.findByaName(username).get();
      assert agent.getAPassword() != null : "Agent "+username+" password not exist!";
      return agent.getAPassword().equals(password);
    }
    return false;
  }

  public boolean isSupCredentials(LoginRequest loginRequest) throws UsernameNotFoundException {
    return isSupCredentials(loginRequest.getUsername(), loginRequest.getPassword());
  }

  public boolean isSupCredentials(RegisterFormRequest registerFormRequest) throws UsernameNotFoundException {
    return isSupCredentials(registerFormRequest.getUsername(), registerFormRequest.getPassword());
  }

  public boolean isSupCredentials(String username, String password) throws UsernameNotFoundException {
    if (supRepository.findBySupName(username).isPresent()) {
      Sup sup = supRepository.findBySupName(username).get();
      assert sup.getSupPassword() != null : "Supervisor "+username+" password not exist!";
      return sup.getSupPassword().equals(password);
    }
    return false;
  }

  public Sup getRequestCorrelatedSupId(RegisterFormRequest registerFormRequest) throws UsernameNotFoundException {
    return getRequestCorrelatedSupId(registerFormRequest.getUsername(), registerFormRequest.getPassword());
  }

  public Sup getRequestCorrelatedSupId(String username, String password) throws UsernameNotFoundException {
    if (isSupCredentials(username, password)) {
      assert supRepository.findBySupName(username).isPresent() : "Supervisor " + username + " Object cant be load!";
      return supRepository.findBySupName(username).get();
    }
    return null;
  }

  public Agent getRequestCorrelatedAgentId(RegisterFormRequest registerFormRequest) throws UsernameNotFoundException {
    return getRequestCorrelatedAgentId(registerFormRequest.getUsername(), registerFormRequest.getPassword());
  }

  public Agent getRequestCorrelatedAgentId(String username, String password) throws UsernameNotFoundException {
    if (isAgentCredentials(username, password)) {
      assert agentRepository.findByaName(username).isPresent() : "Agent " + username + " Object cant be load!";
      return agentRepository.findByaName(username).get();
    }
    return null;
  }
}
