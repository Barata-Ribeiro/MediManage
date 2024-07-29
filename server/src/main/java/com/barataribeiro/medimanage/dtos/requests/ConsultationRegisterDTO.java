package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ConsultationRegisterDTO(@NotBlank String patientFullName,
                                      @NotBlank String doctorFullName,

                                      @NotBlank
                                      @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$",
                                              message = "Date must be in the format yyyy-MM-dd.")
                                      String scheduledTo) {}
