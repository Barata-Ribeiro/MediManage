package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(@NotBlank
                                 @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
                                 @Pattern(regexp = "^[a-z]*$", message = "Username must contain only lowercase " +
                                         "letters.")
                                 String username,

                                 @NotBlank
                                 @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
                                         message = "You must provide a valid email address.")
                                 String email,

                                 @NotBlank
                                 @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters.")
                                 @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
                                         message = "Password must contain at least one digit, one lowercase letter, " +
                                                 "one uppercase letter, one special character and no whitespace.")
                                 String password) {}