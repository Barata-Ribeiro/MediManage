package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterByAssistantDTO(@NotBlank
                                     @Size(min = 8, max = 100, message = "Full name must be between 8 and 100 " +
                                             "characters.")
                                     String fullName,

                                     @NotBlank
                                     @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
                                             message = "You must provide a valid email address.")
                                     String email,

                                     @NotBlank
                                     String phone,

                                     @NotBlank
                                     String address,

                                     @NotBlank
                                     String birthDate) {}
