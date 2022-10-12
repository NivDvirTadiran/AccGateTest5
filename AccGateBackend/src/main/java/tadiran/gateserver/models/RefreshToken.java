package tadiran.gateserver.models;

import java.time.Instant;
import javax.persistence.*;

@Entity(name = "refreshtoken")
public class RefreshToken {
    /*@GeneratedValue(generator = "user_id_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(
            name = "user_id_seq",
            sequenceName = "user_id_seq",
            allocationSize = 50
    )*/

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    @JoinColumn(name = "userid", referencedColumnName = "id")
    private User user;
    @Column(nullable = false, unique = true)
    private String token;
    @Column(nullable = false)
    private Instant expiryDate;

    //@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  name = "refreshtoken_webapp",
            joinColumns = @JoinColumn(name = "refreshtokenid"),
            inverseJoinColumns = @JoinColumn(name = "webappid"))
    private EWebApp webApp = EWebApp.WA_GATE;

    public RefreshToken() {
    }

    public RefreshToken(User user, String token, Instant expiryDate, EWebApp webApp) {
        this.user = user;
        this.token = token;
        this.expiryDate = expiryDate;
        this.webApp = webApp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Instant getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }

    public EWebApp getWebApp() {
        return webApp;
    }

    public void setWebApp(EWebApp webApp) {
        this.webApp = webApp;
    }
    //getters and setters
}
