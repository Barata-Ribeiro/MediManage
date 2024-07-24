package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.MedicalRecordMapper;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.MedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.requests.MedicalRecordRegisterDTO;
import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.IllegalRequestException;
import com.barataribeiro.medimanage.exceptions.users.UserNotFoundException;
import com.barataribeiro.medimanage.repositories.MedicalRecordRepository;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.UUID;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class MedicalRecordServiceImpl implements MedicalRecordService {
    private final UserRepository userRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MedicalRecordMapper medicalRecordMapper;


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

        return medicalRecordMapper.toDTO(medicalRecordRepository.save(medicalRecord));
    }
}
