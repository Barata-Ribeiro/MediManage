package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(@NotBlank String emailOrUsername, @NotBlank String password, boolean rememberMe) {}
