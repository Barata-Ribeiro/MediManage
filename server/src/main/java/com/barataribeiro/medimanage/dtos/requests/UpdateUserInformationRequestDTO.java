package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UpdateUserInformationRequestDTO(
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters.")
        @Pattern(regexp = "^[a-z]*$", message = "Username must contain only lowercase " +
                "letters.")
        String username,

        @Email(regexp = "[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}",
                message = "You must provide a valid email address.")
        String email,

        @Size(min = 8, max = 100, message = "Full name must be between 8 and 100 " +
                "characters.")
        String fullName,
        String phone,
        String address,
        LocalDate birthDate,
        String accountType) {}
