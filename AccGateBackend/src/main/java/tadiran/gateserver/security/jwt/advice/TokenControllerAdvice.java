package tadiran.gateserver.security.jwt.advice;

import java.util.Date;

import tadiran.gateserver.security.jwt.exception.LoginErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import tadiran.gateserver.security.jwt.exception.TokenRefreshException;
@RestControllerAdvice
public class TokenControllerAdvice {
    @ExceptionHandler(value = TokenRefreshException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public LoginErrorMessage handleTokenRefreshException(TokenRefreshException ex, WebRequest request) {
        return new LoginErrorMessage(
                HttpStatus.FORBIDDEN.value(),
                new Date(),
                ex.getMessage(),
                request.getDescription(false));
    }
}
