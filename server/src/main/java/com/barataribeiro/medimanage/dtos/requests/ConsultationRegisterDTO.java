package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.NotBlank;

public record ConsultationRegisterDTO(@NotBlank String patientFullName,
                                      @NotBlank String doctorFullName,
                                      @NotBlank String scheduledTo) {}
