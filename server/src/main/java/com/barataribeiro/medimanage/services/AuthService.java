package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.LoginRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterByAssistantRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterRequestDTO;
import com.barataribeiro.medimanage.dtos.responses.LoginResponseDTO;

import java.util.Map;

public interface AuthService {
    UserDTO register(RegisterRequestDTO body);

    Map<String, Object> registerByAssistant(RegisterByAssistantRequestDTO body);

    LoginResponseDTO login(LoginRequestDTO body);
}
