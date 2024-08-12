package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.entities.models.Consultation;
import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import com.barataribeiro.medimanage.entities.models.Prescription;
import com.barataribeiro.medimanage.repositories.ConsultationRepository;
import com.barataribeiro.medimanage.repositories.MedicalRecordRepository;
import com.barataribeiro.medimanage.repositories.PrescriptionRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.HomeService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HomeServiceImpl implements HomeService {
    private final UserRepository userRepository;
    private final ConsultationRepository consultationRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdministratorInfo(@NotNull Principal principal) {
        return Map.of("allUsers", userRepository.countGroupedUsers(),
                "consultationsByStatus", consultationRepository.countGroupedConsultationsByStatus(),
                "totalPrescriptions", prescriptionRepository.count());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPatientInfo(@NotNull Principal principal) {
        Prescription latestPrescription = prescriptionRepository
                .findFirstByPatient_UsernameOrderByCreatedAtAsc(principal.getName()).orElse(null);
        Consultation nextConsultation = consultationRepository
                .findNextScheduledConsultation(principal.getName()).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByPatient_Username(principal.getName()).orElse(null);

        return Map.of("latestPrescription", latestPrescription != null ? latestPrescription : new Object(),
                "nextConsultation", nextConsultation != null ? nextConsultation : new Object(),
                "medicalRecord", medicalRecord != null ? medicalRecord : new Object());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAssistantInfo(@NotNull Principal principal) {
        return Map.of("consultationsByStatus", consultationRepository.countGroupedConsultationsByStatus(),
                "todayConsultations", consultationRepository.countGroupedConsultationsByStatusToday());
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDoctorInfo(@NotNull Principal principal) {
        return Map.of();
    }
}
