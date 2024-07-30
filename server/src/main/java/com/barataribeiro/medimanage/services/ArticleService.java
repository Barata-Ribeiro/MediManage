package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.ArticleDTO;
import com.barataribeiro.medimanage.dtos.raw.SimpleArticleDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ArticleService {
    List<SimpleArticleDTO> getLatestArticles();

    ArticleDTO getArticleById(Long articleId);

    Page<SimpleArticleDTO> getAllArticles(String search, String category, int page, int perPage, String direction,
                                          String orderBy);
}
