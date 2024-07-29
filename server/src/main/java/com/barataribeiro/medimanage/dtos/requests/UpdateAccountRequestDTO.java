package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateAccountRequestDTO(
        @NotBlank(message = "Current password is required to update account.")
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

        @Pattern(regexp = "^(\\+\\d{1,3}( )?)?((\\(\\d{3}\\))|\\d{3})[- .]?\\d{3}[- .]?\\d{4}$",
                message = "You must provide a valid phone number.")
        String phone,
        String address,

        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$",
                message = "Date must be in the format yyyy-MM-dd.")
        String birthDate) {}
