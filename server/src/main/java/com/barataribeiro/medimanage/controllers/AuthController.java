package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.LoginRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterByAssistantRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterRequestDTO;
import com.barataribeiro.medimanage.dtos.responses.LoginResponseDTO;
import com.barataribeiro.medimanage.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RestResponseDTO> register(@RequestBody @Valid RegisterRequestDTO body) {
        UserDTO response = authService.register(body);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.CREATED,
                                                     HttpStatus.CREATED.value(),
                                                     "User registered successfully.",
                                                     response));
    }

    @PostMapping("/register-by-assistant")
    @Secured("ACCOUNT_TYPE_ASSISTANT")
    public ResponseEntity<RestResponseDTO> registerByAssistant(@RequestBody @Valid RegisterByAssistantRequestDTO body) {
        Map<String, Object> response = authService.registerByAssistant(body);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.CREATED,
                                                     HttpStatus.CREATED.value(),
                                                     "User registered successfully.",
                                                     response));
    }

    @PostMapping("/login")
    public ResponseEntity<RestResponseDTO> login(@RequestBody @Valid LoginRequestDTO body) {
        LoginResponseDTO response = authService.login(body);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Login successful.",
                                                     response));
    }
}
