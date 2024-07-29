package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.ArticleDTO;
import com.barataribeiro.medimanage.dtos.raw.SimpleArticleDTO;

import java.util.List;

public interface ArticleService {
    List<SimpleArticleDTO> getLatestArticles();

    ArticleDTO getArticleById(Long articleId);
}
