package com.barataribeiro.medimanage.services.security;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.barataribeiro.medimanage.entities.models.User;

import java.time.Instant;
import java.util.Map;

public interface TokenService {
    Map.Entry<String, Instant> generateToken(User user, Boolean rememberMe);

    DecodedJWT validateToken(String token);
}