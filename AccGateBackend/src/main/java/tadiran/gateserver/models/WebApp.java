package tadiran.gateserver.models;

import javax.persistence.*;

@Entity
@Table(name = "webapp")
public class WebApp {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Enumerated(EnumType.STRING)
  @Column(length = 20)
  private EWebApp name;

  public WebApp() {

  }

  public WebApp(EWebApp name) {
    this.name = name;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public EWebApp getName() {
    return name;
  }

  public void setName(EWebApp name) {
    this.name = name;
  }
}
