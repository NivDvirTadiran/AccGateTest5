package tadiran.gateserver.payload.request;
import tadiran.gateserver.models.EWebApp;

import javax.validation.constraints.NotBlank;

public class WebAppTabRequest {
    @NotBlank
    private String refreshToken;
    private String accessToken;
    private EWebApp webApp;

    public String getAccessToken() {
        return accessToken;
    }
    public String getRefreshToken() {
        return refreshToken;
    }
    public void setRefreshToken(String refreshToken, String accessToken, String webApp) {
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
        if (webApp.equals("GCCS")) {
            this.webApp = EWebApp.WA_GCCS;
        }
        else {
            this.webApp = EWebApp.WA_AGENT;
        }
    }
}
