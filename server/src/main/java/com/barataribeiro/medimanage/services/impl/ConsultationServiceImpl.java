package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.ConsultationMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.ConsultationDTO;
import com.barataribeiro.medimanage.dtos.requests.ConsultationRegisterDTO;
import com.barataribeiro.medimanage.dtos.requests.ConsultationUpdateDTO;
import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.enums.ConsultationStatus;
import com.barataribeiro.medimanage.entities.models.Consultation;
import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import com.barataribeiro.medimanage.entities.models.Notification;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.EntityNotFoundException;
import com.barataribeiro.medimanage.repositories.ConsultationRepository;
import com.barataribeiro.medimanage.repositories.MedicalRecordRepository;
import com.barataribeiro.medimanage.repositories.NotificationRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.ConsultationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ConsultationServiceImpl implements ConsultationService {
    private final ConsultationRepository consultationRepository;
    private final ConsultationMapper consultationMapper;
    private final UserRepository userRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ConsultationDTO> getConsultationsPaginated(String search, int page, int perPage,
                                                           @NotNull String direction,
                                                           String orderBy, Principal principal) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Consultation> consultations;
        if (search != null && !search.trim().isEmpty()) {
            consultations = consultationRepository.findConsultationsBySearchParams(search, pageable);
        } else {
            consultations = consultationRepository.findAll(pageable);
        }

        List<ConsultationDTO> consultationDTOS = consultationMapper.toDTOList(consultations.getContent());

        return new PageImpl<>(consultationDTOS, pageable, consultations.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConsultationDTO> getPatientConsultationsPaginatedList(String patientId, int page, int perPage,
                                                                      @NotNull String direction, String orderBy,
                                                                      Principal principal) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Consultation> consultations = consultationRepository.findAllByPatient_Id(UUID.fromString(patientId),
                                                                                      pageable);

        if (consultations.isEmpty()) {
            return new PageImpl<>(List.of(), pageable, 0);
        }

        List<ConsultationDTO> consultationDTOS = consultationMapper.toDTOList(consultations.getContent());

        return new PageImpl<>(consultationDTOS, pageable, consultations.getTotalElements());
    }

    @Override
    @Transactional
    public ConsultationDTO registerNewConsultationForPatient(@NotNull ConsultationRegisterDTO body,
                                                             Principal principal) {
        log.atInfo().log("Registering new consultation for patient...");
        log.atInfo().log("Patient: {}", body.patientFullName());
        log.atInfo().log("Doctor: {}", body.doctorFullName());

        List<User> users = userRepository.findPatientAndDoctorByFullname(body.patientFullName(), body.doctorFullName());

        User patient = users.stream()
                .filter(user -> user.getFullName().equals(
                        body.patientFullName()) && user.getAccountType() == AccountType.PATIENT)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName(), body.patientFullName()));

        User doctor = users.stream()
                .filter(user -> user.getFullName().equals(
                        body.doctorFullName()) && user.getAccountType() == AccountType.DOCTOR)
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName(), body.doctorFullName()));

        MedicalRecord medicalRecord = medicalRecordRepository.findByPatient(patient)
                .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName(), patient.getFullName()));

        Consultation consultation = Consultation.builder()
                .patient(patient)
                .doctor(doctor)
                .scheduledTo(LocalDateTime.parse(body.scheduledTo()))
                .medicalRecord(medicalRecord)
                .build();

        String doctorName = !doctor.getFullName().isEmpty() ? doctor.getFullName() : doctor.getUsername();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a");
        String formattedScheduledTo = LocalDateTime.parse(body.scheduledTo()).format(formatter);
        Notification notification = Notification.builder()
                .title("New consultation!")
                .message(String.format("You have a new consultation with %s scheduled to %s", doctorName,
                                       formattedScheduledTo))
                .user(patient)
                .build();

        notificationRepository.save(notification);

        return consultationMapper.toDTO(consultationRepository.saveAndFlush(consultation));
    }

    @Override
    public ConsultationDTO getConsultation(String consultationId, Principal principal) {
        Consultation consultation = consultationRepository.findById(Long.valueOf(consultationId))
                .orElseThrow(() -> new EntityNotFoundException(Consultation.class.getSimpleName(), consultationId));
        return consultationMapper.toDTO(consultation);
    }

    @Override
    @Transactional
    public ConsultationDTO updateConsultation(String consultationId, @NotNull ConsultationUpdateDTO body,
                                              Principal principal) {
        Consultation consultation = consultationRepository.findById(Long.valueOf(consultationId))
                .orElseThrow(() -> new EntityNotFoundException(Consultation.class.getSimpleName(), consultationId));

        List<String> changes = new ArrayList<>();

        if (body.status() != null) {
            ConsultationStatus consultationStatus = ConsultationStatus.valueOf(body.status());
            consultation.setStatus(consultationStatus);
            changes.add("Status - " + body.status());
        }

        if (body.scheduledTo() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy 'at' hh:mm a");
            String formattedScheduledTo = LocalDateTime.parse(body.scheduledTo()).format(formatter);

            consultation.setScheduledTo(LocalDateTime.parse(body.scheduledTo()));
            changes.add("Scheduled to - " + formattedScheduledTo);
        }

        String doctorName = !consultation.getDoctor().getFullName().isEmpty() ? consultation.getDoctor().getFullName() :
                            consultation.getDoctor().getUsername();
        Notification notification = Notification.builder()
                .title("Consultation updated.")
                .message(String.format("Your consultation with %s has been updated. Changes: %s", doctorName,
                                       String.join(", ", changes)))
                .user(consultation.getPatient())
                .build();
        notificationRepository.save(notification);

        return consultationMapper.toDTO(consultationRepository.saveAndFlush(consultation));
    }
}
