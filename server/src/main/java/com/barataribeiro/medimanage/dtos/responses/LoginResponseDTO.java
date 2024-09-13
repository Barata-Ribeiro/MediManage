package com.barataribeiro.medimanage.dtos.responses;

import com.barataribeiro.medimanage.dtos.raw.UserContextDTO;

import java.time.Instant;

public record LoginResponseDTO(UserContextDTO user,
                               String token,
                               Instant tokenExpiresAt) {}
