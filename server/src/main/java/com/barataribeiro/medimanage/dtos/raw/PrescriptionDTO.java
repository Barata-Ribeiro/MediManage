package com.barataribeiro.medimanage.dtos.raw;

import com.barataribeiro.medimanage.entities.models.Prescription;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link Prescription}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class PrescriptionDTO implements Serializable {
    Long id;
    UserDTO patient;
    UserDTO doctor;
    String text;
    Instant createdAt;
    Instant updatedAt;
}