package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.UserContextDTO;
import com.barataribeiro.medimanage.dtos.requests.LoginRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterByAssistantDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterNewEmployeeDTO;
import com.barataribeiro.medimanage.dtos.requests.RegisterRequestDTO;
import com.barataribeiro.medimanage.dtos.responses.LoginResponseDTO;

import java.util.Map;

public interface AuthService {
    UserContextDTO register(RegisterRequestDTO body);

    Map<String, Object> registerByAssistant(RegisterByAssistantDTO body);

    Map<String, Object> registerNewEmployee(RegisterNewEmployeeDTO body);

    LoginResponseDTO login(LoginRequestDTO body);

    void logout(String blacklistToken);
}
