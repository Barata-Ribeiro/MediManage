package com.barataribeiro.medimanage.dtos.responses;

import com.barataribeiro.medimanage.dtos.raw.UserContextDTO;
import jakarta.annotation.Nullable;

import java.io.Serializable;
import java.time.Instant;

public record LoginResponseDTO(UserContextDTO user,
                               String accessToken,
                               Instant accessTokenExpiresAt,
                               @Nullable String refreshToken,
                               @Nullable Instant refreshTokenExpiresAt) implements Serializable {}
