package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.ArticleDTO;
import com.barataribeiro.medimanage.dtos.raw.SimpleArticleDTO;
import com.barataribeiro.medimanage.dtos.requests.ArticleRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.ArticleUpdateRequestDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.List;

public interface ArticleService {
    List<SimpleArticleDTO> getLatestArticles();

    ArticleDTO getArticleById(Long articleId);

    Page<SimpleArticleDTO> getAllArticles(String search, String category, int page, int perPage, String direction,
                                          String orderBy);

    ArticleDTO createArticle(ArticleRequestDTO body, Principal principal);

    ArticleDTO updateArticle(Long articleId, ArticleUpdateRequestDTO body, Principal principal);
}
