package tadiran.gateserver.models;

import javax.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private ERole eRole;

  public Role() {

  }

  public Role(ERole eRole) {
    this.eRole = eRole;
    this.id = eRole.ordinal();
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public ERole getERole() {
    return eRole;
  }

  public void setERole(ERole name) {
    this.eRole = name;
  }
}
