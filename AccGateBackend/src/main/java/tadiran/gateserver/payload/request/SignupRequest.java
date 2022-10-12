package tadiran.gateserver.payload.request;

import tadiran.gateserver.annotation.ValidPassword;

import java.util.ArrayList;
import java.util.List;


import javax.validation.constraints.*;

public class SignupRequest {
  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  List<String> roles = new ArrayList<String>();

  @ValidPassword
  @NotBlank(message = "New password is mandatory")
  private String password;


  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public List<String> getRoles() {
    return this.roles;
  }

  public void setRoles(ArrayList<String> roles) {
    this.roles = roles;
  }


}
