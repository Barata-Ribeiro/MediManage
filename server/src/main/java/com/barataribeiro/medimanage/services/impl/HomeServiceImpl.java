package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.entities.models.Consultation;
import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import com.barataribeiro.medimanage.entities.models.Notice;
import com.barataribeiro.medimanage.entities.models.Prescription;
import com.barataribeiro.medimanage.repositories.*;
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
    private final NoticeRepository noticeRepository;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdministratorInfo(@NotNull Principal principal) {
        return Map.of(
                ApplicationConstants.ALL_USERS, userRepository.countGroupedUsers(),

                ApplicationConstants.CONSULTATIONS_BY_STATUS,
                consultationRepository.countGroupedConsultationsByStatus(),

                ApplicationConstants.TOTAL_PRESCRIPTIONS, prescriptionRepository.count()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPatientInfo(@NotNull Principal principal) {
        Prescription latestPrescription = prescriptionRepository
                .findFirstByPatient_UsernameOrderByCreatedAtAsc(principal.getName()).orElse(null);
        Consultation nextConsultation = consultationRepository
                .findNextScheduledConsultation(principal.getName()).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByPatient_Username(principal.getName()).orElse(null);

        return Map.of(
                ApplicationConstants.LATEST_PRESCRIPTION, latestPrescription != null ? latestPrescription : Map.of(),
                ApplicationConstants.NEXT_CONSULTATION, nextConsultation != null ? nextConsultation : Map.of(),
                ApplicationConstants.MEDICAL_RECORD, medicalRecord != null ? medicalRecord : Map.of()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAssistantInfo(@NotNull Principal principal) {
        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);
        return Map.of(
                ApplicationConstants.CONSULTATIONS_BY_STATUS,
                consultationRepository.countGroupedConsultationsByStatus(),

                ApplicationConstants.TODAY_CONSULTATIONS,
                consultationRepository.countGroupedConsultationsByStatusToday(),

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? latestNotice : Map.of()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDoctorInfo(@NotNull Principal principal) {
        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);
        Consultation nextConsultation = consultationRepository.findNextConsultationToBeAccepted().orElse(null);

        return Map.of(
                ApplicationConstants.NEXT_CONSULTATION, nextConsultation != null ? nextConsultation : Map.of(),

                ApplicationConstants.CONSULTATIONS_BY_STATUS,
                consultationRepository.countGroupedConsultationsByStatus(),

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? latestNotice : Map.of()
        );
    }
}