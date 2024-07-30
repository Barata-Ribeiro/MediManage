package com.barataribeiro.medimanage.dtos.raw;

import com.barataribeiro.medimanage.entities.enums.NoticeStatus;
import com.barataribeiro.medimanage.entities.enums.NoticeType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.medimanage.entities.models.Notice}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class NoticeDTO implements Serializable {
    Long id;
    String title;
    String description;
    String mediaUrl;
    NoticeType type = NoticeType.ANNOUNCEMENT;
    NoticeStatus status = NoticeStatus.ACTIVE;
    SimpleUserDTO issuer;
    Instant createdAt;
    Instant updatedAt;
}