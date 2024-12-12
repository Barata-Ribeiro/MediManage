package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.ArticleDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimpleArticleDTO;
import com.barataribeiro.medimanage.dtos.requests.ArticleRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.ArticleUpdateRequestDTO;
import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;

import java.security.Principal;
import java.util.List;

public interface ArticleService {
    List<SimpleArticleDTO> getLatestArticles();

    ArticleDTO getArticleById(Long articleId);

    Page<SimpleArticleDTO> getAllPublicArticles(String search, String category, int page, int perPage, String direction,
                                                String orderBy);

    Page<SimpleArticleDTO> getAllArticles(String search, String category, int page, int perPage, String direction,
                                          String orderBy, Authentication authentication);

    ArticleDTO createArticle(ArticleRequestDTO body, Principal principal);

    ArticleDTO updateArticle(Long articleId, ArticleUpdateRequestDTO body, Principal principal);

    void deleteArticle(Long articleId, Authentication authentication);
}
