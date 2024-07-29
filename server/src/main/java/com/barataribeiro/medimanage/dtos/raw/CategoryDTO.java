package com.barataribeiro.medimanage.dtos.raw;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;

/**
 * DTO for {@link com.barataribeiro.medimanage.entities.models.Category}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryDTO implements Serializable {
    Long id;
    String name;
    String description;
}