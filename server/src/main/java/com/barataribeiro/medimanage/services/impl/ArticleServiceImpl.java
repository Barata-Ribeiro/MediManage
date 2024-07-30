package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.ArticleMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.ArticleDTO;
import com.barataribeiro.medimanage.dtos.raw.SimpleArticleDTO;
import com.barataribeiro.medimanage.entities.models.Article;
import com.barataribeiro.medimanage.exceptions.articles.ArticleNotFoundException;
import com.barataribeiro.medimanage.repositories.ArticleRepository;
import com.barataribeiro.medimanage.services.ArticleService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;
    private final ArticleMapper articleMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SimpleArticleDTO> getLatestArticles() {
        List<Article> articleList = articleRepository.findDistinctTop4ByOrderByCreatedAtDesc();
        return articleMapper.toSimpleDTOList(articleList);
    }

    @Override
    @Transactional(readOnly = true)
    public ArticleDTO getArticleById(Long articleId) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new ArticleNotFoundException(
                        String.format(ApplicationMessages.ARTICLE_NOT_FOUND_WITH_ID, articleId)
                ));
        return articleMapper.toDTO(article);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SimpleArticleDTO> getAllArticles(String search, String category, int page, int perPage,
                                                 @NotNull String direction, String orderBy) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Article> articles;
        if (search != null && !search.trim().isEmpty()) {
            articles = articleRepository.findArticlesBySearchParams(search, pageable);
        } else if (category != null && !category.trim().isEmpty()) {
            articles = articleRepository.findDistinctByCategories_Name(category, pageable);
        } else {
            articles = articleRepository.findAll(pageable);
        }

        List<SimpleArticleDTO> simpleArticleDTOS = articleMapper.toSimpleDTOList(articles.getContent());

        return new PageImpl<>(simpleArticleDTOS, pageable, articles.getTotalElements());
    }
}
