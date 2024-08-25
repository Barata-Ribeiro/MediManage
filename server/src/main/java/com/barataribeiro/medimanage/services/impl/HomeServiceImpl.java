package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.ConsultationMapper;
import com.barataribeiro.medimanage.builders.PrescriptionMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.ConsultationDTO;
import com.barataribeiro.medimanage.dtos.raw.SimplePrescriptionDTO;
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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class HomeServiceImpl implements HomeService {
    private final ArticleRepository articleRepository;
    private final ConsultationRepository consultationRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final NoticeRepository noticeRepository;
    private final PrescriptionMapper prescriptionMapper;
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final ConsultationMapper consultationMapper;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdministratorInfo(@NotNull Principal principal) {
        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);

        return Map.of(
                ApplicationConstants.ALL_USERS, userRepository.countGroupedUsers(),

                ApplicationConstants.CONSULTATIONS_BY_STATUS,
                consultationRepository.countGroupedConsultationsByStatus(),

                ApplicationConstants.TOTAL_PRESCRIPTIONS, prescriptionRepository.count(),

                ApplicationConstants.TOTAL_ARTICLES, articleRepository.count(),

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? latestNotice : Map.of()

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
        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);

        return Map.of(
                ApplicationConstants.LATEST_PRESCRIPTION, latestPrescription != null ? latestPrescription : Map.of(),
                ApplicationConstants.NEXT_CONSULTATION, nextConsultation != null ? nextConsultation : Map.of(),
                ApplicationConstants.MEDICAL_RECORD, medicalRecord != null ? medicalRecord : Map.of(),

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? latestNotice : Map.of()

        );
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAssistantInfo(@NotNull Principal principal) {
        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);
        List<ConsultationDTO> consultationsForToday = consultationMapper.toDTOList(
                consultationRepository.findAllConsultationsForToday(
                        LocalDateTime.now().with(LocalTime.MIN),
                        LocalDateTime.now().with(LocalTime.MAX)
                ));

        return Map.of(
                ApplicationConstants.CONSULTATIONS_BY_STATUS,
                consultationRepository.countGroupedConsultationsByStatus(),

                ApplicationConstants.TOTAL_CONSULTATIONS_FOR_TODAY,
                consultationRepository.countGroupedConsultationsByStatusToday(),

                ApplicationConstants.CONSULTATIONS_FOR_TODAY, consultationsForToday,

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? latestNotice : Map.of()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDoctorInfo(@NotNull Principal principal) {
        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);
        Consultation nextConsultation = consultationRepository.findNextConsultationToBeAccepted().orElse(null);

        List<Prescription> prescriptions =
                prescriptionRepository.findTop5DistinctByDoctor_UsernameOrderByUpdatedAtDesc(principal.getName());
        List<SimplePrescriptionDTO> recentPrescriptions = prescriptionMapper.toSimpleDTOList(prescriptions);

        return Map.of(
                ApplicationConstants.NEXT_CONSULTATION, nextConsultation != null ? nextConsultation : Map.of(),

                ApplicationConstants.CONSULTATIONS_BY_STATUS,
                consultationRepository.countGroupedConsultationsByStatus(),

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? latestNotice : Map.of(),

                ApplicationConstants.RECENT_PRESCRIPTIONS, recentPrescriptions
        );
    }
}