package com.barataribeiro.medimanage.builders;

import com.barataribeiro.medimanage.dtos.raw.ArticleDTO;
import com.barataribeiro.medimanage.entities.models.Article;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ArticleMapper {
    private final ModelMapper modelMapper;

    public ArticleDTO toDTO(Article article) {
        return modelMapper.map(article, ArticleDTO.class);
    }

    public Article toEntity(ArticleDTO articleDTO) {
        return modelMapper.map(articleDTO, Article.class);
    }

    public List<ArticleDTO> toDTOList(@NotNull List<Article> articles) {
        return articles.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Article> toListEntity(@NotNull List<ArticleDTO> articleDTOS) {
        return articleDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
