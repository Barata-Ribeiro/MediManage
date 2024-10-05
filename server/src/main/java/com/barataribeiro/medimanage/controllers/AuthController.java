package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.LoginRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterByAssistantDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterNewEmployeeDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterRequestDTO;
import com.barataribeiro.medimanage.dtos.responses.LoginResponseDTO;
import com.barataribeiro.medimanage.dtos.responses.RestResponseDTO;
import com.barataribeiro.medimanage.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthController {
    private final AuthService authService;

    @Operation(summary = "Register a new user")
    @PostMapping("/register")
    public ResponseEntity<RestResponseDTO<UserDTO>> register(@RequestBody @Valid RegisterRequestDTO body) {
        UserDTO response = authService.register(body);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       ApplicationConstants.USER_REGISTERED_SUCCESSFULLY,
                                                       response));
    }

    @Operation(summary = "An assistant registers a new user")
    @PostMapping("/register-by-assistant")
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> registerByAssistant(
            @RequestBody @Valid RegisterByAssistantDTO body) {

        Map<String, Object> response = authService.registerByAssistant(body);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       ApplicationConstants.USER_REGISTERED_SUCCESSFULLY,
                                                       response));
    }

    @Operation(summary = "An administrator registers a new employee")
    @PostMapping("/register-new-employee")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<Map<String, Object>>> registerNewEmployee(
            @RequestBody @Valid RegisterNewEmployeeDTO body) {

        Map<String, Object> response = authService.registerNewEmployee(body);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.CREATED,
                                                       HttpStatus.CREATED.value(),
                                                       ApplicationConstants.USER_REGISTERED_SUCCESSFULLY,
                                                       response));
    }

    @Operation(summary = "Sign in to the application")
    @PostMapping("/login")
    public ResponseEntity<RestResponseDTO<LoginResponseDTO>> login(@RequestBody @Valid LoginRequestDTO body) {
        LoginResponseDTO response = authService.login(body);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Login successful.",
                                                       response));
    }

    @Operation(summary = "Sign out of the application")
    @DeleteMapping("/logout")
    public ResponseEntity<RestResponseDTO<Void>> logout(@RequestHeader("X-Blacklist-Token") String blacklistToken) {
        authService.logout(blacklistToken);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Logout successful.",
                                                       null));
    }
}
