package com.barataribeiro.medimanage.dtos.raw;

import org.springframework.http.HttpStatus;

public record RestResponseDTO(HttpStatus status,
                              int code,
                              String message,
                              Object data) {}