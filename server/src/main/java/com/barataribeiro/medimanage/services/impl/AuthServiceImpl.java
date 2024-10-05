package com.barataribeiro.medimanage.services.impl;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.barataribeiro.medimanage.builders.UserMapper;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.LoginRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterByAssistantDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterNewEmployeeDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterRequestDTO;
import com.barataribeiro.medimanage.dtos.responses.LoginResponseDTO;
import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.enums.UserRoles;
import com.barataribeiro.medimanage.entities.models.BlacklistedToken;
import com.barataribeiro.medimanage.entities.models.Notification;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.IllegalRequestException;
import com.barataribeiro.medimanage.exceptions.users.InvalidUserCredentialsException;
import com.barataribeiro.medimanage.exceptions.users.UserAlreadyExistsException;
import com.barataribeiro.medimanage.exceptions.users.UserIsBannedException;
import com.barataribeiro.medimanage.repositories.BlacklistedTokenRepository;
import com.barataribeiro.medimanage.repositories.NotificationRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.AuthService;
import com.barataribeiro.medimanage.services.security.TokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final SecureRandom random = new SecureRandom();
    private final NotificationRepository notificationRepository;
    private final BlacklistedTokenRepository blacklistedTokenRepository;

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

        log.atInfo().log("New user registered with username: {}", registration.getUsername());

        Notification notification = Notification.builder()
                .title("Welcome! Account created.")
                .message("Your account has been created successfully. \n Please, follow the rules and enjoy our " +
                         "services.")
                .user(registration)
                .build();

        notificationRepository.save(notification);

        return userMapper.toDTO(userRepository.saveAndFlush(registration));
    }

    @Override
    @Transactional
    public Map<String, Object> registerByAssistant(@NotNull RegisterByAssistantDTO body) {
        if (userRepository.existsByEmailOrFullName(body.email(), body.fullName())) {
            throw new UserAlreadyExistsException();
        }

        String generatedUsername = this.generateUniqueUsername();
        String generatedPassword = this.generatePassword();

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

        log.atInfo().log("The assistant registered a new user through the assistant panel. User full name: {}",
                         savedUser.getFullName());

        Notification notification = Notification.builder()
                .title("Account created!")
                .message("Your account has been created successfully. \n\n" +
                         "Username: " + generatedUsername + "\n" +
                         "Password: " + generatedPassword + "\n" +
                         "Please, change your credentials as soon as possible.")
                .user(savedUser)
                .build();

        notificationRepository.save(notification);

        return Map.of("username", generatedUsername,
                      "password", generatedPassword,
                      "registeredAt", Instant.now().toString(),
                      "message", "Please, change your password after login.");
    }

    @Override
    @Transactional
    public Map<String, Object> registerNewEmployee(@NotNull RegisterNewEmployeeDTO body) {
        if (userRepository.existsByEmailOrFullName(body.email(), body.fullName())) {
            throw new UserAlreadyExistsException();
        }

        String generatedUsername = this.generateUniqueUsername();
        String generatedPassword = this.generatePassword();
        AccountType accountType = AccountType.valueOf(body.accountType());
        UserRoles role = accountType.equals(AccountType.ADMINISTRATOR) ? UserRoles.ADMIN : UserRoles.USER;

        User registration = User.builder()
                .username(generatedUsername)
                .email(body.email())
                .password(passwordEncoder.encode(generatedPassword))
                .fullName(body.fullName())
                .phone(body.phone())
                .address(body.address())
                .birthDate(LocalDate.parse(body.birthDate()))
                .userRoles(role)
                .accountType(accountType)
                .build();

        if (accountType.equals(AccountType.DOCTOR)) {
            registration.setRegistrationNumber(body.registrationNumber());
            registration.setRegistrationOrigin(body.registrationOrigin());
            registration.setSpecialization(body.specialization());
        }

        User savedUser = userRepository.save(registration);

        log.atInfo().log(
                "The administrator registered a new employee through the administrator panel. Employee full name: {}",
                savedUser.getFullName());

        Notification notification = Notification.builder()
                .title("Account created!")
                .message("Your account has been created successfully. \n\n" +
                         "Username: " + generatedUsername + "\n" +
                         "Password: " + generatedPassword + "\n" +
                         "Please, change your credentials as soon as possible.")
                .user(savedUser)
                .build();

        notificationRepository.save(notification);

        return Map.of("username", generatedUsername,
                      "password", generatedPassword,
                      "registeredAt", Instant.now().toString(),
                      "message", "Please, change your password after login.");
    }

    @Override
    @Transactional(readOnly = true)
    public LoginResponseDTO login(@NotNull LoginRequestDTO body) {
        log.atInfo().log("User with email or username '{}' is trying to log in.", body.emailOrUsername());

        User user = userRepository.findByUsernameOrEmail(body.emailOrUsername())
                .orElseThrow(() -> new InvalidUserCredentialsException("The credential '" + body.emailOrUsername() +
                                                                       "' is invalid."));

        boolean passwordMatches = passwordEncoder.matches(body.password(), user.getPassword());
        boolean userBannedOrNone =
                user.getUserRoles().equals(UserRoles.BANNED) || user.getUserRoles().equals(UserRoles.NONE);

        if (!passwordMatches) {
            throw new InvalidUserCredentialsException("The provided password is incorrect.");
        }

        if (userBannedOrNone) {
            throw new UserIsBannedException();
        }

        Map.Entry<String, Instant> tokenAndExpiration = tokenService.generateToken(user, body.rememberMe());

        log.atInfo().log("User with username '{}' logged in successfully.", user.getUsername());

        return new LoginResponseDTO(userMapper.toContextDTO(user),
                                    tokenAndExpiration.getKey(),
                                    tokenAndExpiration.getValue());
    }

    @Override
    public void logout(String blacklistToken) {
        DecodedJWT decodedJWT = tokenService.validateToken(blacklistToken);

        if (decodedJWT == null) {
            throw new IllegalRequestException("Invalid token.");
        }

        String jti = decodedJWT.getId();
        String username = decodedJWT.getSubject();
        Instant expirationDate = decodedJWT.getExpiresAt().toInstant();

        BlacklistedToken token = BlacklistedToken.builder()
                .id(jti)
                .token(blacklistToken)
                .ownerUsername(username)
                .expirationDate(expirationDate)
                .build();

        blacklistedTokenRepository.save(token);

        log.atInfo().log("User with username '{}' logged out successfully.", username);
    }

    private @NotNull String generateRandomString() {
        String alphaNumericStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyz0123456789";
        StringBuilder sb = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(alphaNumericStr.length());
            sb.append(alphaNumericStr.charAt(index));
        }

        return sb.toString();
    }

    private String generateUniqueUsername() {
        int maxAttempts = 100;
        int attempts = 0;
        String username;

        do {
            if (attempts >= maxAttempts) {
                throw new IllegalRequestException("Exceeded maximum attempts to generate a unique username");
            }

            username = generateRandomString();
            attempts++;
        } while (userRepository.existsByUsername(username));

        return username;
    }

    private @NotNull String generatePassword() {
        return generateRandomString();
    }
}
