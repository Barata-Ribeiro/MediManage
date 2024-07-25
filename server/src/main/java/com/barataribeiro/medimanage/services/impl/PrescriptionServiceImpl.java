package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.PrescriptionMapper;
import com.barataribeiro.medimanage.builders.UserMapper;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.PrescriptionDTO;
import com.barataribeiro.medimanage.dtos.raw.SimplePrescriptionDTO;
import com.barataribeiro.medimanage.entities.models.Prescription;
import com.barataribeiro.medimanage.exceptions.prescriptions.PrescriptionNotFoundException;
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

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class PrescriptionServiceImpl implements PrescriptionService {
    private final UserRepository userRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final UserMapper userMapper;
    private final PrescriptionMapper prescriptionMapper;


    @Override
    public Page<SimplePrescriptionDTO> getPatientPrescriptionsPaginatedList(String patientId, int page, int perPage,
                                                                            @NotNull String direction, String orderBy,
                                                                            Principal principal) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Prescription> prescriptions = prescriptionRepository.findDistinctByPatientId(UUID.fromString(patientId),
                                                                                          pageable);

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
    public PrescriptionDTO createPrescription(String text, Principal principal) {
        return null;
    }
}
