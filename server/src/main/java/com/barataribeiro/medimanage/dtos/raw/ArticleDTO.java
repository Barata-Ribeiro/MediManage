package com.barataribeiro.medimanage.dtos.raw;

import com.barataribeiro.medimanage.dtos.raw.simple.SimpleDoctorDTO;
import com.barataribeiro.medimanage.entities.models.Article;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Set;

/**
 * DTO for {@link Article}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class ArticleDTO implements Serializable {
    Long id;
    String title;
    String subTitle;
    String content;
    String slug;
    String mediaUrl;
    Boolean wasEdit = false;
    Instant createdAt;
    Instant updatedAt;
    private SimpleDoctorDTO author;
    private Set<CategoryDTO> categories;
}