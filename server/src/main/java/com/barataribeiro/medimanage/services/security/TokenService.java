package com.barataribeiro.medimanage.services.security;

import com.barataribeiro.medimanage.entities.models.User;

import java.time.Instant;
import java.util.Map;

public interface TokenService {
    Map.Entry<String, Instant> generateToken(User user, Boolean rememberMe);

    String validateToken(String token);
}