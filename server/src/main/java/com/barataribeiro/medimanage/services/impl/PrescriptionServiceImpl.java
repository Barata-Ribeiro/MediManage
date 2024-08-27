package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.PrescriptionMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.PrescriptionDTO;
import com.barataribeiro.medimanage.dtos.raw.SimplePrescriptionDTO;
import com.barataribeiro.medimanage.dtos.requests.PrescriptionCreateDTO;
import com.barataribeiro.medimanage.entities.models.Notification;
import com.barataribeiro.medimanage.entities.models.Prescription;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.prescriptions.PrescriptionNotFoundException;
import com.barataribeiro.medimanage.exceptions.users.UserNotFoundException;
import com.barataribeiro.medimanage.repositories.NotificationRepository;
import com.barataribeiro.medimanage.repositories.PrescriptionRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.PrescriptionService;
import lombok.RequiredArgsConstructor;
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
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Prescription> prescriptions =
                prescriptionRepository.findAllByPatient_Id(UUID.fromString(patientId), pageable);

        List<SimplePrescriptionDTO> prescriptionDTOS = prescriptionMapper.toSimpleDTOList(prescriptions.getContent());

        return new PageImpl<>(prescriptionDTOS, pageable, prescriptions.getTotalElements());
    }

    @Override
    public PrescriptionDTO getPrescription(String prescriptionId, Principal principal) {
        Prescription prescription = prescriptionRepository.findById(Long.valueOf(prescriptionId)).orElseThrow(
                () -> new PrescriptionNotFoundException(String.format(
                        ApplicationMessages.PRESCRIPTION_NOT_FOUND_WITH_ID, prescriptionId)
                ));
        return prescriptionMapper.toDTO(prescription);
    }

    @Override
    @Transactional
    public PrescriptionDTO createPrescription(String patientId, PrescriptionCreateDTO body,
                                              @NotNull Principal principal) {
        User patient = userRepository.findById(UUID.fromString(patientId)).orElseThrow(
                () -> new UserNotFoundException(String.format(ApplicationMessages.USER_NOT_FOUND_WITH_ID, patientId))
        );
        User doctor = userRepository.findByUsername(principal.getName()).orElseThrow(
                () -> new UserNotFoundException(String.format(ApplicationMessages.USER_NOT_FOUND_WITH_USERNAME,
                                                              principal.getName())
                ));

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
        patient.incrementTotalNotifications();
        userRepository.save(patient);

        return prescriptionMapper.toDTO(prescriptionRepository.saveAndFlush(prescription));
    }
}
