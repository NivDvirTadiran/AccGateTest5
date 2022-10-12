package tadiran.gateserver.security.services;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import tadiran.gateserver.models.EWebApp;
import tadiran.gateserver.security.jwt.JwtUtils;
import tadiran.gateserver.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tadiran.gateserver.security.jwt.exception.TokenRefreshException;
import tadiran.gateserver.models.RefreshToken;
import tadiran.gateserver.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {
    @Value("${tadiran.gate.jwtRefreshExpirationMin}")
    private Long refreshTokenDurationMin;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    JwtUtils jwtUtils;

    String jwt;

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public String generateJwtToken(RefreshToken refreshToken) {
        return jwtUtils.generateJwtToken(refreshToken.getId(), refreshToken.getUser(), refreshToken.getWebApp());
    }

    public RefreshToken createRefreshToken(Long userId, EWebApp webApp) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setExpiryDate(Instant.now().plus(refreshTokenDurationMin, ChronoUnit.MINUTES));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setWebApp(webApp);
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken refreshRefreshToken(Long tokenId) {
        RefreshToken refreshToken = refreshTokenRepository.getById(tokenId);
        refreshToken.setExpiryDate(Instant.now().plus(refreshTokenDurationMin, ChronoUnit.MINUTES));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public RefreshToken setWebApp(RefreshToken refreshToken, EWebApp webApp ) {
        refreshToken.setWebApp(webApp);
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }
    /*@Transactional
    public int deleteByUserId(Long userId) {
        return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }*/
}
