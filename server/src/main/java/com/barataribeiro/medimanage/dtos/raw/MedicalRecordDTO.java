package com.barataribeiro.medimanage.dtos.raw;

import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

/**
 * DTO for {@link MedicalRecord}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class MedicalRecordDTO implements Serializable {
    UUID id;
    UserDTO patient;
    String insuranceCompany;
    String insuranceMemberIdNumber;
    String insuranceGroupNumber;
    String insurancePolicyNumber;
    String allergies;
    String medications;
    String medicalHistory;
    String familyMedicalHistory;
    Instant createdAt;
    Instant updatedAt;
}