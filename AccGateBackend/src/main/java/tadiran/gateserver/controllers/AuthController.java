package tadiran.gateserver.controllers;


import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import tadiran.gateserver.models.*;
import tadiran.gateserver.payload.request.*;
import tadiran.gateserver.payload.response.ApiResponse;
import tadiran.gateserver.payload.response.TokenRefreshResponse;
import tadiran.gateserver.repository.AgentRepository;
import tadiran.gateserver.repository.SupRepository;
import tadiran.gateserver.security.jwt.exception.TokenRefreshException;
import tadiran.gateserver.security.services.RefreshTokenService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import tadiran.gateserver.payload.response.JwtResponse;
import tadiran.gateserver.payload.response.MessageResponse;
import tadiran.gateserver.repository.RoleRepository;
import tadiran.gateserver.repository.UserRepository;
import tadiran.gateserver.security.jwt.JwtUtils;
import tadiran.gateserver.security.services.UserDetailsImpl;
import tadiran.gateserver.security.services.UserDetailsServiceImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
  private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  AgentRepository agentRepository;

  @Autowired
  SupRepository supRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @Autowired
  RefreshTokenService refreshTokenService;

  @Autowired
  UserDetailsServiceImpl userDetailsService;


  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    if (!userRepository.existsByUsername(loginRequest.getUsername())) {
      logger.info("signin: user  not exist");
      if (userDetailsService.isSupCredentials(loginRequest) ||
          userDetailsService.isAgentCredentials(loginRequest)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: A registry process should be made!"));
      }
    }

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();


    User user = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + userDetails.getUsername()));

    Set<Role> roles = user.getRoles();
    List<String> rolesList = new ArrayList<String>();
    roles.forEach((role) -> rolesList.add(role.getERole().name()));
    logger.info("getRolesList: " + rolesList);

      /*List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());*/


    RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId(), EWebApp.WA_GATE);
    String jwt = refreshTokenService.generateJwtToken(refreshToken);

    return ResponseEntity.ok(new JwtResponse(jwt,
                          refreshToken.getToken(),
                          user.getId(),
                          user.getUsername(),
                          user.getEmail(),
                          EWebApp.WA_GATE,
                          user.getRolesList()));
  }

  //@CrossOrigin(origins = "*", maxAge = 3600)
  //@PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/signupadmin")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    List<String> strRoles = signUpRequest.getRoles();
    //Role role = new Role();
    Set<Role> roles = new HashSet<Role>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByeRole(ERole.User)
          .orElseThrow(() -> new RuntimeException("Error(null): Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
        case "admin":
          /*List<String> rolesListBefore = new ArrayList<String>();
          roles.forEach((role2) -> rolesListBefore.add(role2.getName().name()));
          logger.info("getRolesList1: " + rolesListBefore);
          addAdminRole(roles);
          List<String> rolesListAfter = new ArrayList<String>();
          roles.forEach((role2) -> rolesListAfter.add(role2.getName().name()));
          logger.info("getRolesList2: " + rolesListAfter);
          if (isActionPermitted(signUpRequest.getAccessToken(), ERole.Admin)) {
            new RuntimeException("Access Denied: User unauthorized!");
          }
          */  Role adminRole = roleRepository.findByeRole(ERole.Admin)
                  .orElseThrow(() -> new RuntimeException("Error(admin): Role is not found."));

            roles.add(adminRole);

            break;
          case "mod":
            Role modRole = roleRepository.findByeRole(ERole.SupervisorMonitor)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modRole);


            break;
          case "user":
            Role userRole = roleRepository.findByeRole(ERole.User)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);

            break;
          default:
            throw new RuntimeException("Error: Role unknown: " + role);
        }
      });
    }

    //user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));

  }

  @PostMapping("/replace-pass-form")
  public ResponseEntity<?> replacePassForm(@Valid @RequestBody ReplacePassFormRequest replacePassFormRequest) {
    if (!userRepository.existsByUsername(replacePassFormRequest.getUsername())) {
      if (userDetailsService.isSupCredentials(replacePassFormRequest.getUsername(), replacePassFormRequest.getPassword()) ||
              userDetailsService.isAgentCredentials(replacePassFormRequest.getUsername(), replacePassFormRequest.getPassword())) {
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: A registry process should be made!"));
      }
    }
/*
    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
            replacePassFormRequest.getUsername(),
            replacePassFormRequest.getOldPassword())).orElseThrow(() -> new UsernameNotFoundException("User Not Found with Agent name: "))
    */
    try {
      Authentication authentication = authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(replacePassFormRequest.getUsername(), replacePassFormRequest.getOldPassword()));
    } catch (BadCredentialsException e) {
      //return new ResponseEntity<>(

          final Map<String, Object> body = new HashMap<>();
          body.put("oldPassword", HttpServletResponse.SC_UNAUTHORIZED);
      return new ResponseEntity<>(new ApiResponse(body, "VALIDATION_FAILED"), HttpStatus.OK);
    } catch (AuthenticationException e) {
      e.printStackTrace();
    }

    User user = userRepository.findByUsername(replacePassFormRequest.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + replacePassFormRequest.getUsername()));

    user.setPassword(encoder.encode(replacePassFormRequest.getPassword()));
    userRepository.save(user);

    if (!encoder.matches(user.getPassword(),replacePassFormRequest.getOldPassword())) {
      user.setPassLastModifiedOn(LocalDate.now());
      userRepository.save(user);
    }

    return ResponseEntity.ok(new MessageResponse("Password replaced successfully!"));
  }

  @PostMapping("/register-form")
  public ResponseEntity<?> registerForm(@Valid @RequestBody RegisterFormRequest registerFormRequest) {

    if (userRepository.existsByUsername(registerFormRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(registerFormRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }


    if (!userDetailsService.isSupCredentials(registerFormRequest) &&
        !userDetailsService.isAgentCredentials(registerFormRequest)) {
            return ResponseEntity
                  .badRequest()
                  .body(new MessageResponse("Error: A registry process un valid!"));
    }

    // Create new user's account
    User user = new User(registerFormRequest.getUsername(),
            registerFormRequest.getEmail(),
            encoder.encode(registerFormRequest.getPassword()));

    if (registerFormRequest.getPhone() != null) {
      user.setPhone(registerFormRequest.getPhone());
    }

    if (userDetailsService.isSupCredentials(registerFormRequest)) {
      // Link the user to the initial Supervisor registry request
      user.setSup(userDetailsService.getRequestCorrelatedSupId(registerFormRequest));
      userRepository.save(user);
    }
    else if (userDetailsService.isAgentCredentials(registerFormRequest)) {
      // Link the user to the initial Agent registry request
      user.setAgent(userDetailsService.getRequestCorrelatedAgentId(registerFormRequest));
      userRepository.save(user);
    }

    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }

  //@CrossOrigin(origins = "*", maxAge = 3600)
  //@PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/signup")
  public ResponseEntity<?> registerOnlyUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(),
            signUpRequest.getEmail(),
            encoder.encode(signUpRequest.getPassword()));

    List<String> strRoles = signUpRequest.getRoles();
    //Role role = new Role();
    Set<Role> roles = new HashSet<Role>();

    if (strRoles == null) {
      Role userRole = roleRepository.findByeRole(ERole.User)
              .orElseThrow(() -> new RuntimeException("Error(null): Role is not found."));
      roles.add(userRole);
    } else {
      strRoles.forEach(role -> {
        switch (role) {
          case "admin":
          /*List<String> rolesListBefore = new ArrayList<String>();
          roles.forEach((role2) -> rolesListBefore.add(role2.getName().name()));
          logger.info("getRolesList1: " + rolesListBefore);
          addAdminRole(roles);
          List<String> rolesListAfter = new ArrayList<String>();
          roles.forEach((role2) -> rolesListAfter.add(role2.getName().name()));
          logger.info("getRolesList2: " + rolesListAfter);
          if (isActionPermitted(signUpRequest.getAccessToken(), ERole.Admin)) {
            new RuntimeException("Access Denied: User unauthorized!");
          }
          */  Role adminRole = roleRepository.findByeRole(ERole.Admin)
                  .orElseThrow(() -> new RuntimeException("Error(admin): Role is not found."));

            roles.add(adminRole);

            break;
          case "mod":
            Role modRole = roleRepository.findByeRole(ERole.SupervisorMonitor)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(modRole);


            break;
          case "user":
            Role userRole = roleRepository.findByeRole(ERole.User)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);

            break;
          default:
            throw new RuntimeException("Error: Role unknown: " + role);
        }
      });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));

  }

  //@CrossOrigin(origins = "*", maxAge = 3600)
  //@PreAuthorize("hasRole('ADMIN')")
  public void addAdminRole(Set<Role> roles) {
    logger.info("eRole.name()1: ");
    Role adminRole = roleRepository.findByeRole(ERole.Admin)
          .orElseThrow(() -> new RuntimeException("Error(admin): Role is not found."));
    roles.add(adminRole);
  }


  public boolean isActionPermitted(String requestAccessToken, ERole eRole) throws RuntimeException{
    logger.info("eRole.name()1: " + eRole.name());
    logger.info("requestAccessToken: " + requestAccessToken);
    return userRepository.findByUsername(jwtUtils.getUserNameFromJwtToken(requestAccessToken))
            .map(user -> user.verifyERoleExist(eRole))
            .orElseThrow(() ->
              new NullPointerException("Access Denied: User unauthorized!"));

    //return isPermitted;
  }

  @PostMapping("/refreshtoken")
  public ResponseEntity<?> refreshtoken(@Valid @RequestBody TokenRefreshRequest request ) {

    //logger.info("/refreshtoken requested by url source: ", authException.getMessage());
    String requestRefreshToken = request.getRefreshToken();
    String requestAccessToken = request.getAccessToken();
    //EWebApp webAppCurrent = jwtUtils.getWebAppFromJwtToken(requestAccessToken);
    return refreshTokenService.findByToken(requestRefreshToken)
            .map(refreshTokenService::verifyExpiration)
            .map(RefreshToken::getId)
            /*.map(refreshTokenService::refreshRefreshToken)
            .map(newRefreshToken -> {
              newRefreshToken = refreshTokenService.setWebApp(newRefreshToken);
              String token = refreshTokenService.generateJwtToken(newRefreshToken);
              return ResponseEntity.ok(new TokenRefreshResponse(token, newRefreshToken.getToken()));
            })*/

            .map(tokenId -> {
              //String token = jwtUtils.generateToken(tokenId );
              RefreshToken newRefreshToken = (refreshTokenService.refreshRefreshToken(tokenId));
              newRefreshToken = refreshTokenService.setWebApp(newRefreshToken, EWebApp.WA_GATE /*webAppCurrent*/);
              String token = refreshTokenService.generateJwtToken(newRefreshToken);
              return ResponseEntity.ok(new TokenRefreshResponse(token, newRefreshToken.getToken()));
            })
            .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                    "Refresh token is not in database!"));
  }

  @PostMapping("/webapptab")
  public ResponseEntity<?> authenticateWebAppTab(@Valid @RequestBody WebAppTabRequest request ) {

    String requestRefreshToken = request.getRefreshToken();
    return refreshTokenService.findByToken(requestRefreshToken)
            .map(refreshTokenService::verifyExpiration)
            .map(RefreshToken::getUser)
            .map(user -> {

              RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getId(), EWebApp.WA_GATE);
              String newAccessToken = refreshTokenService.generateJwtToken(newRefreshToken);

              return ResponseEntity.ok(new JwtResponse(newAccessToken,
                      newRefreshToken.getToken(),
                      user.getId(),
                      user.getUsername(),
                      user.getEmail(),
                      EWebApp.WA_GATE,
                      user.getRolesList()));
            })
            .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                    "Refresh token is not in database!"));

  }
}
