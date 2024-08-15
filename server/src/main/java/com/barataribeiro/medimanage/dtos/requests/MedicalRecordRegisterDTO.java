package com.barataribeiro.medimanage.dtos.requests;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.UUID;

public record MedicalRecordRegisterDTO(@NotBlank @UUID String patientId,
                                       @NotBlank String insuranceCompany,
                                       @NotNull Integer insuranceMemberIdNumber,
                                       @NotNull Integer insuranceGroupNumber,
                                       @NotNull Integer insurancePolicyNumber,
                                       @NotBlank String allergies,
                                       @NotBlank String medications,
                                       @NotBlank String medicalHistory,
                                       @NotBlank String familyMedicalHistory) {}
