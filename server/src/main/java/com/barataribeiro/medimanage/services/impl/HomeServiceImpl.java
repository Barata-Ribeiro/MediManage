package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.repositories.ConsultationRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HomeServiceImpl implements HomeService {
    private final UserRepository userRepository;
    private final ConsultationRepository consultationRepository;

    @Override
    public Map<String, Object> getAdministratorInfo() {
        Map<String, Long> users = userRepository.countGroupedUsers();

        return Map.of(
                "totalUsers", users.get("totalUsers").toString(),
                "patients", users.get("patients").toString(),
                "assistants", users.get("assistants").toString(),
                "doctors", users.get("doctors").toString()
        );
    }

    @Override
    public Map<String, Object> getPatientInfo() {
        return Map.of();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAssistantInfo() {
        return Map.of("allConsultations", consultationRepository.countGroupedConsultationsByStatus(),
                "todayConsultations", consultationRepository.countGroupedConsultationsByStatusToday());
    }

    @Override
    public Map<String, Object> getDoctorInfo() {
        return Map.of();
    }
}
