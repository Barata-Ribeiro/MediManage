package com.barataribeiro.medimanage.dtos.raw;

import com.barataribeiro.medimanage.dtos.raw.simple.SimpleUserDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.medimanage.entities.models.Notification}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class NotificationDTO implements Serializable {
    Long id;
    String title;
    String message;
    SimpleUserDTO user;
    Boolean isRead;
    Instant issuedAt;
    Instant readAt;
}