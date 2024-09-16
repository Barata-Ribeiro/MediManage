package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.ConsultationMapper;
import com.barataribeiro.medimanage.builders.MedicalRecordMapper;
import com.barataribeiro.medimanage.builders.NoticeMapper;
import com.barataribeiro.medimanage.builders.PrescriptionMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.ConsultationDTO;
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
    private final MedicalRecordMapper medicalRecordMapper;
    private final NoticeMapper noticeMapper;

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdministratorInfo(@NotNull Principal principal) {
        return retrieveAdministratorInfo(principal);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getPatientInfo(@NotNull Principal principal) {
        return retrievePatientInfo(principal);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAssistantInfo(@NotNull Principal principal) {
        return retrieveAssistantInfo(principal);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDoctorInfo(@NotNull Principal principal) {
        return retrieveDoctorInfo(principal);
    }

    @Override
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamAdministratorInfo(
            @NotNull Principal principal) {
        log.atInfo().log("Streaming administrator info for Home. Requesting User: {}", principal.getName());

        return Flux.deferContextual(ctx -> {
            Principal ctxPrincipal = ctx.get(ApplicationConstants.PRINCIPAL);
            Duration keepAliveDuration = Duration.ofMinutes(1);
            return administratorSink.asFlux()
                    .map(seq -> ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                            .id(String.valueOf(seq))
                            .event("administrator-info")
                            .data(new RestResponseDTO<>(HttpStatus.OK,
                                                        HttpStatus.OK.value(),
                                                        ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                        retrieveAdministratorInfo(ctxPrincipal)))
                            .build())
                    .timeout(keepAliveDuration,
                             Flux.just(ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                                               .event(ApplicationConstants.HEARTBEAT)
                                               .data(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                                           HttpStatus.NO_CONTENT.value(),
                                                                           String.format(
                                                                                   ApplicationMessages.KEEP_ALIVE_FOR,
                                                                                   keepAliveDuration.toMinutes()),
                                                                           Map.of()))
                                               .build()))
                    .doOnCancel(() -> {
                        log.atInfo().log("Administrator info stream cancelled...");
                        administratorSink.asFlux().subscribe().dispose();
                    })
                    .doFinally(signalType -> log.atInfo().log("Administrator info stream finally... {}", signalType))
                    .subscribeOn(Schedulers.boundedElastic());
        }).contextWrite(Context.of(ApplicationConstants.PRINCIPAL, principal));
    }

    @Override
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamPatientInfo(@NotNull Principal principal) {
        log.atInfo().log("Streaming patient info for Home. Requesting User: {}", principal.getName());

        return Flux.deferContextual(ctx -> {
            Principal ctxPrincipal = ctx.get(ApplicationConstants.PRINCIPAL);
            Duration keepAliveDuration = Duration.ofMinutes(1);
            return patientSink.asFlux()
                    .map(seq -> ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                            .id(String.valueOf(seq))
                            .event("patient-info")
                            .data(new RestResponseDTO<>(HttpStatus.OK,
                                                        HttpStatus.OK.value(),
                                                        ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                        retrievePatientInfo(ctxPrincipal)))
                            .build())
                    .timeout(keepAliveDuration,
                             Flux.just(ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                                               .event(ApplicationConstants.HEARTBEAT)
                                               .data(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                                           HttpStatus.NO_CONTENT.value(),
                                                                           String.format(
                                                                                   ApplicationMessages.KEEP_ALIVE_FOR,
                                                                                   keepAliveDuration.toMinutes()),
                                                                           Map.of()))
                                               .build()))
                    .doOnCancel(() -> {
                        log.atInfo().log("Patient info stream cancelled...");
                        patientSink.asFlux().subscribe().dispose();
                    })
                    .doFinally(signalType -> log.atInfo().log("Patient info stream finally... {}", signalType))
                    .subscribeOn(Schedulers.boundedElastic());
        }).contextWrite(Context.of(ApplicationConstants.PRINCIPAL, principal));
    }

    @Override
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamAssistantInfo(
            @NotNull Principal principal) {
        log.atInfo().log("Streaming assistant info for Home. Requesting User: {}", principal.getName());

        return Flux.deferContextual(ctx -> {
            Principal ctxPrincipal = ctx.get(ApplicationConstants.PRINCIPAL);
            Duration keepAliveDuration = Duration.ofMinutes(1);
            return assistantSink.asFlux()
                    .map(seq -> ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                            .id(String.valueOf(seq))
                            .event("assistant-info")
                            .data(new RestResponseDTO<>(HttpStatus.OK,
                                                        HttpStatus.OK.value(),
                                                        ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                        retrieveAssistantInfo(ctxPrincipal)))
                            .build())
                    .timeout(keepAliveDuration,
                             Flux.just(ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                                               .event(ApplicationConstants.HEARTBEAT)
                                               .data(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                                           HttpStatus.NO_CONTENT.value(),
                                                                           String.format(
                                                                                   ApplicationMessages.KEEP_ALIVE_FOR,
                                                                                   keepAliveDuration.toMinutes()),
                                                                           Map.of()))
                                               .build()))
                    .doOnCancel(() -> {
                        log.atInfo().log("Assistant info stream cancelled...");
                        assistantSink.asFlux().subscribe().dispose();
                    })
                    .doFinally(signalType -> log.atInfo().log("Assistant info stream finally... {}", signalType))
                    .subscribeOn(Schedulers.boundedElastic());
        }).contextWrite(Context.of(ApplicationConstants.PRINCIPAL, principal));
    }

    @Override
    public Flux<ServerSentEvent<RestResponseDTO<Map<String, Object>>>> streamDoctorInfo(@NotNull Principal principal) {
        log.atInfo().log("Streaming doctor info for Home. Requesting User: {}", principal.getName());

        return Flux.deferContextual(ctx -> {
            Principal ctxPrincipal = ctx.get(ApplicationConstants.PRINCIPAL);
            Duration keepAliveDuration = Duration.ofMinutes(1);
            return doctorSink.asFlux()
                    .map(seq -> ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                            .id(String.valueOf(seq))
                            .event("doctor-info")
                            .data(new RestResponseDTO<>(HttpStatus.OK,
                                                        HttpStatus.OK.value(),
                                                        ApplicationConstants.HOME_INFORETRIEVED_SUCCESSFULLY,
                                                        retrieveDoctorInfo(ctxPrincipal)))
                            .build())
                    .timeout(keepAliveDuration,
                             Flux.just(ServerSentEvent.<RestResponseDTO<Map<String, Object>>>builder()
                                               .event(ApplicationConstants.HEARTBEAT)
                                               .data(new RestResponseDTO<>(HttpStatus.NO_CONTENT,
                                                                           HttpStatus.NO_CONTENT.value(),
                                                                           String.format(
                                                                                   ApplicationMessages.KEEP_ALIVE_FOR,
                                                                                   keepAliveDuration.toMinutes()),
                                                                           Map.of()))
                                               .build()))
                    .doOnCancel(() -> {
                        log.atInfo().log("Doctor info stream cancelled...");
                        doctorSink.asFlux().subscribe().dispose();
                    })
                    .doFinally(signalType -> log.atInfo().log("Doctor info stream finally... {}", signalType))
                    .subscribeOn(Schedulers.boundedElastic());
        }).contextWrite(Context.of(ApplicationConstants.PRINCIPAL, principal));
    }

    private @NotNull @Unmodifiable Map<String, Object> retrieveAdministratorInfo(@NotNull Principal principal) {
        log.atInfo().log("Retrieving administrator info for Home. Requesting User: {}", principal.getName());

        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);

        return Map.of(
                ApplicationConstants.ALL_USERS, userRepository.countGroupedUsers(),

                ApplicationConstants.CONSULTATIONS_BY_STATUS,
                consultationRepository.countGroupedConsultationsByStatus(),

                ApplicationConstants.TOTAL_PRESCRIPTIONS, prescriptionRepository.count(),

                ApplicationConstants.TOTAL_ARTICLES, articleRepository.count(),

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? noticeMapper.toDTO(latestNotice) : Map.of()
        );
    }

    private @NotNull @Unmodifiable Map<String, Object> retrievePatientInfo(@NotNull Principal principal) {
        log.atInfo().log("Retrieving patient info for Home. Requesting User: {}", principal.getName());

        Prescription latestPrescription = prescriptionRepository
                .findFirstByPatient_UsernameOrderByCreatedAtAsc(principal.getName()).orElse(null);
        Consultation nextConsultation = consultationRepository
                .findNextScheduledConsultation(principal.getName()).orElse(null);
        MedicalRecord medicalRecord = medicalRecordRepository.findByPatient_Username(principal.getName()).orElse(null);
        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);

        return Map.of(
                ApplicationConstants.LATEST_PRESCRIPTION,
                latestPrescription != null ? prescriptionMapper.toDTO(latestPrescription) : Map.of(),

                ApplicationConstants.NEXT_CONSULTATION,
                nextConsultation != null ? consultationMapper.toDTO(nextConsultation) : Map.of(),

                ApplicationConstants.MEDICAL_RECORD,
                medicalRecord != null ? medicalRecordMapper.toDTO(medicalRecord) : Map.of(),

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? noticeMapper.toDTO(latestNotice) : Map.of()
        );
    }

    private @NotNull @Unmodifiable Map<String, Object> retrieveAssistantInfo(@NotNull Principal principal) {
        log.atInfo().log("Retrieving assistant info for Home. Requesting User: {}", principal.getName());

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

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? noticeMapper.toDTO(latestNotice) : Map.of()
        );
    }

    private @NotNull @Unmodifiable Map<String, Object> retrieveDoctorInfo(@NotNull Principal principal) {
        log.atInfo().log("Retrieving doctor info for Home. Requesting User: {}", principal.getName());

        Notice latestNotice = noticeRepository.findDistinctFirstByOrderByCreatedAtDesc().orElse(null);
        Consultation nextConsultation = consultationRepository.findNextConsultationToBeAccepted().orElse(null);

        List<Prescription> prescriptions = prescriptionRepository
                .findTop5DistinctByDoctor_UsernameOrderByUpdatedAtDesc(principal.getName());

        return Map.of(
                ApplicationConstants.NEXT_CONSULTATION,
                nextConsultation != null ? consultationMapper.toDTO(nextConsultation) : Map.of(),

                ApplicationConstants.CONSULTATIONS_BY_STATUS,
                consultationRepository.countGroupedConsultationsByStatus(),

                ApplicationConstants.LATEST_NOTICE, latestNotice != null ? noticeMapper.toDTO(latestNotice) : Map.of(),

                ApplicationConstants.RECENT_PRESCRIPTIONS, prescriptionMapper.toSimpleDTOList(prescriptions)
        );
    }
}