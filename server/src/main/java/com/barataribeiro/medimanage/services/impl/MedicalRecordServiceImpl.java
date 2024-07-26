package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.MedicalRecordMapper;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.MedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.raw.SimpleMedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.requests.MedicalRecordRegisterDTO;
import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.IllegalRequestException;
import com.barataribeiro.medimanage.exceptions.records.MedicalRecordNotFoundException;
import com.barataribeiro.medimanage.exceptions.users.UserNotFoundException;
import com.barataribeiro.medimanage.repositories.MedicalRecordRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.MedicalRecordService;
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
public class MedicalRecordServiceImpl implements MedicalRecordService {
    private final UserRepository userRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordMapper medicalRecordMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<SimpleMedicalRecordDTO> getMedicalRecordsPaginated(String search, int page, int perPage,
                                                                   @NotNull String direction,
                                                                   String orderBy, Principal principal) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<MedicalRecord> records;
        if (search != null && !search.trim().isEmpty()) {
            records = medicalRecordRepository.findRecordsBySearchParams(search, pageable);
        } else {
            records = medicalRecordRepository.findAll(pageable);
        }

        List<SimpleMedicalRecordDTO> medicalRecordDTOS = medicalRecordMapper.toSimpleDTOList(records.getContent());

        return new PageImpl<>(medicalRecordDTOS, pageable, records.getTotalElements());
    }

    @Override
    public MedicalRecordDTO getMedicalRecord(String recordId, Principal principal) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(UUID.fromString(recordId))
                .orElseThrow(() -> new MedicalRecordNotFoundException(
                        String.format(ApplicationMessages.MEDICAL_RECORD_NOT_FOUND_WITH_ID, recordId)
                ));
        return medicalRecordMapper.toDTO(medicalRecord);
    }

    @Override
    @Transactional
    public MedicalRecordDTO registerMedicalRecord(@NotNull Principal principal,
                                                  @NotNull MedicalRecordRegisterDTO body) {
        User user = userRepository.findById(UUID.fromString(body.patientId()))
                .orElseThrow(() -> new UserNotFoundException(
                        String.format(ApplicationMessages.USER_NOT_FOUND_WITH_ID, body.patientId())
                ));

        if (user.getUsername().equals(principal.getName())) {
            throw new IllegalRequestException("You cannot register a medical record for yourself.");
        }

        MedicalRecord medicalRecord = MedicalRecord.builder()
                .patient(user)
                .insuranceCompany(body.insuranceCompany())
                .insuranceMemberIdNumber(String.valueOf(body.insuranceMemberIdNumber()))
                .insuranceGroupNumber(String.valueOf(body.insuranceGroupNumber()))
                .insurancePolicyNumber(String.valueOf(body.insurancePolicyNumber()))
                .allergies(body.allergies())
                .medications(body.medications())
                .medicalHistory(body.medicalHistory())
                .familyMedicalHistory(body.familyMedicalHistory())
                .build();

        return medicalRecordMapper.toDTO(medicalRecordRepository.saveAndFlush(medicalRecord));
    }

    @Override
    @Transactional
    public MedicalRecordDTO updateMedicalRecord(@NotNull Principal principal, @NotNull MedicalRecordRegisterDTO body,
                                                String recordId) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(UUID.fromString(recordId))
                .orElseThrow(() -> new IllegalRequestException(
                        String.format(ApplicationMessages.MEDICAL_RECORD_NOT_FOUND_WITH_ID, recordId)
                ));

        if (medicalRecord.getPatient().getUsername().equals(principal.getName())) {
            throw new IllegalRequestException("You cannot update a medical record for yourself.");
        }

        medicalRecord.setInsuranceCompany(body.insuranceCompany());
        medicalRecord.setInsuranceMemberIdNumber(String.valueOf(body.insuranceMemberIdNumber()));
        medicalRecord.setInsuranceGroupNumber(String.valueOf(body.insuranceGroupNumber()));
        medicalRecord.setInsurancePolicyNumber(String.valueOf(body.insurancePolicyNumber()));
        medicalRecord.setAllergies(body.allergies());
        medicalRecord.setMedications(body.medications());
        medicalRecord.setMedicalHistory(body.medicalHistory());
        medicalRecord.setFamilyMedicalHistory(body.familyMedicalHistory());

        return medicalRecordMapper.toDTO(medicalRecordRepository.saveAndFlush(medicalRecord));
    }
}
