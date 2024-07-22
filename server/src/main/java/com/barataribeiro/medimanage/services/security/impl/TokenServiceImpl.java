package com.barataribeiro.medimanage.services.security.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.MediManageException;
import com.barataribeiro.medimanage.services.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.AbstractMap;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TokenServiceImpl implements TokenService {
    Logger logger = LoggerFactory.getLogger(TokenServiceImpl.class);

    @Value("${api.security.token.secret}")
    private String secretKey;

    @Override
    public Map.Entry<String, Instant> generateToken(@NotNull User user, Boolean rememberMe) {
        Instant expirationDate;
        String token;

        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);
            expirationDate = this.generateExpirationDateInDays(rememberMe != null && rememberMe ? 365 : 1);

            token = JWT.create()
                    .withIssuer("auth0")
                    .withSubject(user.getUsername())
                    .withExpiresAt(expirationDate)
                    .sign(algorithm);

            return new AbstractMap.SimpleEntry<>(token, expirationDate);
        } catch (IllegalArgumentException | JWTCreationException exception) {
            logger.error(exception.getMessage());
            throw new MediManageException();
        }
    }

    @Override
    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secretKey);

            return JWT.require(algorithm)
                    .withIssuer("auth0")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            logger.error(exception.getMessage());
            return null;
        }
    }

    private Instant generateExpirationDateInDays(Integer days) {
        return LocalDateTime.now(ZoneOffset.UTC).plusDays(days).toInstant(ZoneOffset.UTC);
    }
}
