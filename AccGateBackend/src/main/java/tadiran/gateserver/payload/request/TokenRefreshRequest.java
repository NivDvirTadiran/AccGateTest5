package tadiran.gateserver.payload.request;
import javax.validation.constraints.NotBlank;
public class TokenRefreshRequest {
    @NotBlank
    private String refreshToken;
    private String accessToken;

    public String getAccessToken() {
        return accessToken;
    }
    public String getRefreshToken() {
        return refreshToken;
    }
    public void setRefreshToken(String refreshToken, String accessToken) {
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
    }
}
