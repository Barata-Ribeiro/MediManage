package com.barataribeiro.medimanage.dtos.responses;

import com.barataribeiro.medimanage.dtos.raw.UserDTO;

import java.time.Instant;

public record LoginResponseDTO(UserDTO user,
                               String token,
                               Instant tokenExpiresAt) {}
