package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateAccountRequestDTO(
        String currentPassword,

        @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
                message = "You must provide a valid email address.")
        String email,

        @Size(min = 8, max = 100, message = "Full name must be between 8 and 100 " +
                "characters.")
        String fullName,

        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters.")
        @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$",
                message = "Password must contain at least one digit, one lowercase letter, " +
                        "one uppercase letter, one special character and no whitespace.")
        String newPassword,

        String phone,
        String address,
        String birthDate) {}
