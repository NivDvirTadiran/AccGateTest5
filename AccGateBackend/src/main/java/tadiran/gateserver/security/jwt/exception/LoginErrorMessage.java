package tadiran.gateserver.security.jwt.exception;

import java.util.Date;
public class LoginErrorMessage {
    private int statusCode;
    private Date timestamp;
    private String message;
    private String description;
    public LoginErrorMessage(int statusCode, Date timestamp, String message, String description) {
        this.statusCode = statusCode;
        this.timestamp = timestamp;
        this.message = message;
        this.description = description;
    }
    public int getStatusCode() {
        return statusCode;
    }
    public Date getTimestamp() {
        return timestamp;
    }
    public String getMessage() {
        return message;
    }
    public String getDescription() {
        return description;
    }
}
