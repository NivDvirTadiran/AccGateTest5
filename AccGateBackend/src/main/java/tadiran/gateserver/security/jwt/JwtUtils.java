package tadiran.gateserver.security.jwt;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import tadiran.gateserver.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import tadiran.gateserver.models.EWebApp;
import io.jsonwebtoken.*;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${tadiran.gate.jwtSecret}") //@Value("${tadiran.gate.jwtSecret}")
  private String jwtSecret;

  @Value("${tadiran.gate.jwtExpirationMin}") //@Value("${tadiran.gate.jwtExpirationMs}")
  private int jwtExpirationMin;

  public String generateJwtToken(Long tokenId, User user, EWebApp webApp) {
    return generateToken(tokenId, user, webApp);
  }

  public String generateToken(Long tokenId, User user, EWebApp webApp) {

    Instant issuedAt = Instant.now().truncatedTo(ChronoUnit.SECONDS);
    Instant expiration = issuedAt.plus(jwtExpirationMin, ChronoUnit.MINUTES);

    return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("id",user.getId())
            .claim("email",user.getEmail())
            .claim("roles",user.getRolesList())
            .claim("WebApp",webApp)
            .setIssuedAt(Date.from(issuedAt))
            .setExpiration(Date.from(expiration))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
  }

  public EWebApp getWebAppFromJwtToken(String token) {
    return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .get("WebApp",EWebApp.class);
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
      return true;
    } catch (SignatureException e) {
      logger.error("Invalid JWT signature: {}", e.getMessage());
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }
}
