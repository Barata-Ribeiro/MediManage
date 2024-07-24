package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.NotBlank;

public record MedicalRecordRegisterDTO(@NotBlank String patientId,
                                       @NotBlank String insuranceCompany,
                                       @NotBlank int insuranceMemberIdNumber,
                                       @NotBlank int insuranceGroupNumber,
                                       @NotBlank int insurancePolicyNumber,
                                       @NotBlank String allergies,
                                       @NotBlank String medications,
                                       @NotBlank String medicalHistory,
                                       @NotBlank String familyMedicalHistory) {}
