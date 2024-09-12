package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.ConsultationMapper;
import com.barataribeiro.medimanage.builders.PrescriptionMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.ConsultationDTO;
import com.barataribeiro.medimanage.dtos.raw.SimplePrescriptionDTO;
import com.barataribeiro.medimanage.dtos.responses.RestResponseDTO;
import com.barataribeiro.medimanage.entities.models.Consultation;
import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import com.barataribeiro.medimanage.entities.models.Notice;
import com.barataribeiro.medimanage.entities.models.Prescription;
import com.barataribeiro.medimanage.repositories.*;
import com.barataribeiro.medimanage.services.HomeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Unmodifiable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.scheduler.Schedulers;
import reactor.util.context.Context;

import java.security.Principal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@Slf4j
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

    private final Sinks.Many<RestResponseDTO<Map<String, Object>>> administratorSink =
            Sinks.many().multicast().directBestEffort();
    private final Sinks.Many<RestResponseDTO<Map<String, Object>>> patientSink =
            Sinks.many().multicast().directBestEffort();
    private final Sinks.Many<RestResponseDTO<Map<String, Object>>> assistantSink =
            Sinks.many().multicast().directBestEffort();
    private final Sinks.Many<RestResponseDTO<Map<String, Object>>> doctorSink =
            Sinks.many().multicast().directBestEffort();

    @Override
    @Transactional
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
        return retrieveDoctorInfo(principal);
    }

    @Override
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamAdministratorInfo(Principal principal) {
        return null;
    }

    @Override
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamPatientInfo(Principal principal) {
        return null;
    }

    @Override
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamAssistantInfo(Principal principal) {
        return null;
    }

    @Override
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamDoctorInfo(Principal principal) {
        log.info("Streaming doctor info in HomeServiceImpl...");

        return Flux.deferContextual(ctx -> {
            Principal ctxPrincipal = ctx.get("principal");
            return doctorSink.asFlux()
                    .map(seq -> ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                            .id(String.valueOf(seq))
                            .event("doctor-info")
                            .data(new RestResponseDTO<>(HttpStatus.OK,
                                                        HttpStatus.OK.value(),
                                                        ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                        retrieveDoctorInfo(ctxPrincipal)))
                            .build())
                    .timeout(Duration.ofMinutes(2),
                             Flux.just(ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                                               .event("heartbeat")
                                               .data(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                                           HttpStatus.NO_CONTENT.value(),
                                                                           "Heartbeat",
                                                                           Map.of()))
                                               .build()))
                    .doOnCancel(() -> {
                        log.info("Doctor info stream cancelled...");
                        doctorSink.asFlux().subscribe().dispose();
                    })
                    .doFinally(signalType -> log.info("Doctor info stream finally... {}", signalType))
                    .subscribeOn(Schedulers.boundedElastic());
        }).contextWrite(Context.of("principal", principal));
    }

    private @NotNull @Unmodifiable Map<String, Object> retrieveDoctorInfo(@NotNull Principal principal) {
        log.info("Retrieving doctor info in HomeServiceImpl...");

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