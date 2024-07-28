package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterNewEmployee(@NotBlank
                                  @Size(min = 8, max = 100, message = "Full name must be between 8 and 100 " +
                                          "characters.")
                                  String fullName,

                                  @NotBlank
                                  @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
                                          message = "You must provide a valid email address.")
                                  String email,

                                  @NotBlank
                                  @Pattern(regexp = "^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- " +
                                          ".]?\\d{4}$",
                                          message = "You must provide a valid phone number.")
                                  String phone,

                                  @NotBlank
                                  String address,

                                  @NotBlank
                                  String birthDate,

                                  // Alter Pattern's regex based on ORIGIN of registration number
                                  @Pattern(regexp = "^\\d{6}-\\d{2}/[A-Z]{2}$", message = "You must provide a valid " +
                                          "registration number.")
                                  String registrationNumber,
                                  String registrationOrigin,
                                  String specialization,

                                  @NotBlank
                                  @Pattern(regexp = "PATIENT|ASSISTANT|DOCTOR|ADMINISTRATOR", message = "Account type" +
                                          " must be one of: PATIENT, ASSISTANT, DOCTOR, ADMINISTRATOR.")
                                  String accountType) {}
