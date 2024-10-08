package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.PrescriptionMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.PrescriptionDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimplePrescriptionDTO;
import com.barataribeiro.medimanage.dtos.requests.PrescriptionCreateDTO;
import com.barataribeiro.medimanage.entities.models.Notification;
import com.barataribeiro.medimanage.entities.models.Prescription;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.EntityNotFoundException;
import com.barataribeiro.medimanage.repositories.NotificationRepository;
import com.barataribeiro.medimanage.repositories.PrescriptionRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.PrescriptionService;
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
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PrescriptionServiceImpl implements PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionMapper prescriptionMapper;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;


    @Override
    @Transactional(readOnly = true)
    public Page<SimplePrescriptionDTO> getPatientPrescriptionsPaginatedList(String patientId, int page, int perPage,
                                                                            @NotNull String direction, String orderBy,
                                                                            Principal principal) {
        log.atInfo().log("Fetching prescriptions for patient with id: {}", patientId);
        log.atInfo().log("page: {}, perPage: {}, direction: {}, orderBy: {}", page, perPage, direction, orderBy);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Prescription> prescriptions =
                prescriptionRepository.findAllByPatient_Id(UUID.fromString(patientId), pageable);

        List<SimplePrescriptionDTO> prescriptionDTOS = prescriptionMapper.toSimpleDTOList(prescriptions.getContent());
        log.atInfo().log("Returning {} prescriptions.", prescriptionDTOS.size());
        return new PageImpl<>(prescriptionDTOS, pageable, prescriptions.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionDTO getPrescription(String username, String prescriptionId, Principal principal) {
        log.atInfo().log("Fetching prescription with id '{}' for user '{}'", prescriptionId, username);
        Prescription prescription = prescriptionRepository
                .findByIdAndPatient_Username(Long.valueOf(prescriptionId), username)
                .orElseThrow(() -> new EntityNotFoundException(Prescription.class.getSimpleName(), prescriptionId));
        log.atInfo().log("Prescription with id '{}' for user '{}' has been found.", prescriptionId, username);
        return prescriptionMapper.toDTO(prescription);
    }

    @Override
    @Transactional
    public PrescriptionDTO createPrescription(String patientId, PrescriptionCreateDTO body,
                                              @NotNull Principal principal) {
        log.atInfo().log("Doctor {} is creating a prescription for patient with id '{}'", principal.getName(),
                         patientId);

        User patient = userRepository.findById(UUID.fromString(patientId))
                .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName(), patientId));
        User doctor = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new EntityNotFoundException(User.class.getSimpleName(), principal.getName()));

        if (patient.getId().equals(doctor.getId())) {
            throw new IllegalArgumentException("You can't create a prescription for yourself");
        }

        Prescription prescription = Prescription.builder()
                .patient(patient)
                .doctor(doctor)
                .text(body.text())
                .build();

        String doctorName = !doctor.getFullName().isEmpty() ? doctor.getFullName() : doctor.getUsername();
        Notification notification = Notification.builder()
                .title("New prescription!")
                .message(String.format("%s has issued a new prescription for you.", doctorName))
                .user(patient)
                .build();
        notificationRepository.save(notification);

        log.atInfo().log("A new prescription for patient '{}' of username '{}' has been created by doctor '{}'",
                         patient.getFullName(), patient.getUsername(), doctor.getUsername());

        return prescriptionMapper.toDTO(prescriptionRepository.saveAndFlush(prescription));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SimplePrescriptionDTO> getMyPrescriptionsPaginatedList(String search, int page, int perPage,
                                                                       @NotNull String direction, String orderBy,
                                                                       Principal principal) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Prescription> prescriptions;
        if (search != null && !search.trim().isEmpty()) {
            prescriptions = prescriptionRepository
                    .findPrescriptionsBySearchParams(search, principal.getName(), pageable);
        } else {
            prescriptions = prescriptionRepository.findAll(pageable);
        }

        List<SimplePrescriptionDTO> prescriptionDTOS = prescriptionMapper.toSimpleDTOList(prescriptions.getContent());

        return new PageImpl<>(prescriptionDTOS, pageable, prescriptions.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public PrescriptionDTO getMyPrescription(String prescriptionId, @NotNull Principal principal) {
        log.atInfo().log("Fetching prescription with id '{}' for user '{}'", prescriptionId, principal.getName());

        Prescription prescription = prescriptionRepository
                .findByIdAndPatient_Username(Long.valueOf(prescriptionId), principal.getName())
                .orElseThrow(() -> new EntityNotFoundException(Prescription.class.getSimpleName(), prescriptionId));

        log.atInfo().log("Prescription with id '{}' for user '{}' has been found.", prescriptionId,
                         principal.getName());

        return prescriptionMapper.toDTO(prescription);
    }

    @Override
    @Transactional
    public PrescriptionDTO updatePrescription(String username, String prescriptionId,
                                              @NotNull PrescriptionCreateDTO body,
                                              @NotNull Principal principal) {
        log.atInfo().log("Updating prescription with id '{}' for user '{}'", prescriptionId, username);

        Prescription prescription = prescriptionRepository
                .findByIdAndPatient_UsernameAndDoctor_Username(Long.valueOf(prescriptionId), username,
                                                               principal.getName())
                .orElseThrow(() -> new EntityNotFoundException(Prescription.class.getSimpleName(), prescriptionId));

        prescription.setText(body.text());

        String doctorName = prescription.getDoctor().getFullName().isEmpty()
                            ? prescription.getDoctor().getUsername()
                            : prescription.getDoctor().getFullName();

        if (prescription.getPatient().getId().equals(prescription.getDoctor().getId())) {
            throw new IllegalArgumentException("You can't update a prescription for yourself");
        }

        if (prescription.getDoctor().getUsername().equals(principal.getName())) {
            throw new IllegalArgumentException("You can't update a prescription that you didn't issued.");
        }

        Notification notification = Notification.builder()
                .title("Prescription updated!")
                .message(String.format("Your prescription '%s' has been updated by %s.", prescriptionId, doctorName))
                .user(prescription.getPatient())
                .build();

        notificationRepository.save(notification);

        return prescriptionMapper.toDTO(prescriptionRepository.saveAndFlush(prescription));
    }
}
