package com.barataribeiro.medimanage.dtos.requests;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record MedicalRecordRegisterDTO(@NotBlank String patientId,
                                       @NotBlank String insuranceCompany,
                                       @NotNull Integer insuranceMemberIdNumber,
                                       @NotNull Integer insuranceGroupNumber,
                                       @NotNull Integer insurancePolicyNumber,
                                       @NotBlank String allergies,
                                       @NotBlank String medications,
                                       @NotBlank String medicalHistory,
                                       @NotBlank String familyMedicalHistory) {}
