package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.UserMapper;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.LoginRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterByAssistantRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterRequestDTO;
import com.barataribeiro.medimanage.dtos.responses.LoginResponseDTO;
import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.users.UserAlreadyExistsException;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.AuthService;
import com.barataribeiro.medimanage.services.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final Random random = new Random();

    @Override
    @Transactional
    public UserDTO register(@NotNull RegisterRequestDTO body) {
        if (userRepository.existsByUsernameOrEmail(body.username(), body.email())) {
            throw new UserAlreadyExistsException();
        }

        User registration = User.builder()
                .username(body.username())
                .email(body.email())
                .password(passwordEncoder.encode(body.password()))
                .accountType(AccountType.PATIENT)
                .build();

        return userMapper.toDTO(userRepository.save(registration));
    }

    @Override
    public Map<String, Object> registerByAssistant(@NotNull RegisterByAssistantRequestDTO body) {
        if (userRepository.existsByEmailOrFullName(body.email(), body.fullName())) {
            throw new UserAlreadyExistsException();
        }

        var generatedUsername = this.generateUniqueUsername();
        var generatedPassword = this.generatePassword();

        User registration = User.builder()
                .username(generatedUsername)
                .email(body.email())
                .password(passwordEncoder.encode(generatedPassword))
                .fullName(body.fullName())
                .phone(body.phone())
                .address(body.address())
                .birthDate(LocalDate.parse(body.birthDate()))
                .accountType(AccountType.PATIENT)
                .build();

        User savedUser = userRepository.save(registration);

        return Map.of("username", generatedUsername,
                      "password", generatedPassword,
                      "registeredAt", savedUser.getCreatedAt(),
                      "message", "Please, change your password after login.");
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO body) {
        return null;
    }

    private @NotNull String generateRandomString() {
        String alphaNumericStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyz0123456789";
        StringBuilder sb = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            int index = (alphaNumericStr.length() * random.nextInt() / Integer.MAX_VALUE);
            sb.append(alphaNumericStr.charAt(index));
        }

        return sb.toString();
    }

    private String generateUniqueUsername() {
        String username;
        do {
            username = generateRandomString();
        } while (userRepository.existsByUsername(username));
        return username;
    }

    private @NotNull String generatePassword() {
        return generateRandomString();
    }
}
