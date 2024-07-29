package com.barataribeiro.medimanage.dtos.raw;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for {@link com.barataribeiro.medimanage.entities.models.Article}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class SimpleArticleDTO implements Serializable {
    Long id;
    String title;
    String subTitle;
    String slug;
    String mediaUrl;
    SimpleUserDTO author;
    Instant createdAt;
}