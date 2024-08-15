package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PrescriptionCreateDTO(@NotBlank
                                    @Size(min = 5, message = "The prescription must have at least 5 characters")
                                    String text) {}
