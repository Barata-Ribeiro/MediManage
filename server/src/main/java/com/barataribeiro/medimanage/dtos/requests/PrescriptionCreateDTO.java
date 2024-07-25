package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.NotBlank;

public record PrescriptionCreateDTO(@NotBlank String text) {
}
