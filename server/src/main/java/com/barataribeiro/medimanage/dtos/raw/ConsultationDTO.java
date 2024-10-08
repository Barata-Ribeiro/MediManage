package com.barataribeiro.medimanage.dtos.raw;

import com.barataribeiro.medimanage.dtos.raw.simple.SimpleDoctorDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimpleUserDTO;
import com.barataribeiro.medimanage.entities.enums.ConsultationStatus;
import com.barataribeiro.medimanage.entities.models.Consultation;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;

/**
 * DTO for {@link Consultation}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConsultationDTO implements Serializable {
    Long id;
    SimpleUserDTO patient;
    SimpleDoctorDTO doctor;
    LocalDateTime scheduledTo;
    ConsultationStatus status;
    Instant createdAt;
    Instant updatedAt;
}