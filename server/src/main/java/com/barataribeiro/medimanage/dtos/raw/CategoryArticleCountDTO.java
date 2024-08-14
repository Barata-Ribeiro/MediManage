package com.barataribeiro.medimanage.dtos.raw;

import com.barataribeiro.medimanage.entities.models.Category;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import org.jetbrains.annotations.NotNull;

/**
 * DTO for {@link com.barataribeiro.medimanage.entities.models.Category}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class CategoryArticleCountDTO {
    private CategoryDTO category;
    private Long articleCount;

    public CategoryArticleCountDTO(@NotNull Category category, Long articleCount) {
        this.category = new CategoryDTO(category.getId(), category.getName(), category.getDescription());
        this.articleCount = articleCount;
    }
}