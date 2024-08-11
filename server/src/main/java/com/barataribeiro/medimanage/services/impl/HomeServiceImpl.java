package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HomeServiceImpl implements HomeService {
    private final UserRepository userRepository;

    @Override
    public Map<String, String> getAdministratorInfo() {
        Map<String, Long> users = userRepository.countGroupedUsers();

        return Map.of();
    }

    @Override
    public Map<String, String> getPatientInfo() {
        return Map.of();
    }

    @Override
    public Map<String, String> getAssistantInfo() {
        return Map.of();
    }

    @Override
    public Map<String, String> getDoctorInfo() {
        return Map.of();
    }
}
