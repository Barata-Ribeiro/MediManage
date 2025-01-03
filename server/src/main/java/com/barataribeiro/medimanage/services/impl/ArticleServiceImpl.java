package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.ArticleMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.ArticleDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimpleArticleDTO;
import com.barataribeiro.medimanage.dtos.requests.ArticleRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.ArticleUpdateRequestDTO;
import com.barataribeiro.medimanage.entities.models.Article;
import com.barataribeiro.medimanage.entities.models.Category;
import com.barataribeiro.medimanage.exceptions.EntityNotFoundException;
import com.barataribeiro.medimanage.repositories.ArticleRepository;
import com.barataribeiro.medimanage.repositories.CategoryRepository;
import com.barataribeiro.medimanage.services.ArticleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;
    private final ArticleMapper articleMapper;
    private final CategoryRepository categoryRepository;

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
                                           .orElseThrow(() -> new EntityNotFoundException(Article.class.getSimpleName(),
                                                                                          articleId.toString()));
        return articleMapper.toDTO(article);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SimpleArticleDTO> getAllPublicArticles(String search, String category, int page, int perPage,
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

    @Override
    public Page<SimpleArticleDTO> getAllArticles(String search, String category, int page, int perPage,
                                                 @NotNull String direction, String orderBy,
                                                 Authentication authentication) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        return null;
    }

    @Override
    @Transactional
    public ArticleDTO createArticle(@NotNull ArticleRequestDTO body, Principal principal) {
        Set<Category> categories = body.categories().stream()
                                       .map(categoryName -> categoryRepository
                                               .findByName(categoryName)
                                               .orElseGet(() -> {
                                                   Category category = Category.builder()
                                                                               .name(categoryName)
                                                                               .description(categoryName)
                                                                               .build();
                                                   return categoryRepository.saveAndFlush(category);
                                               }))
                                       .collect(Collectors.toSet());

        Article article = Article.builder()
                                 .title(body.title())
                                 .subTitle(body.subTitle())
                                 .content(body.content())
                                 .slug(generateSlug(body.title()))
                                 .categories(categories)
                                 .build();

        return articleMapper.toDTO(articleRepository.saveAndFlush(article));
    }

    @Override
    @Transactional
    public ArticleDTO updateArticle(Long articleId, @NotNull ArticleUpdateRequestDTO body, Principal principal) {
        Article article = articleRepository.findById(articleId)
                                           .orElseThrow(() -> new EntityNotFoundException(Article.class.getSimpleName(),
                                                                                          articleId.toString()));

        if (body.title() != null && !body.title().trim().isEmpty()) {
            article.setTitle(body.title());
            article.setSlug(generateSlug(body.title()));
        }

        if (body.subTitle() != null && !body.subTitle().trim().isEmpty()) {
            article.setSubTitle(body.subTitle());
        }

        if (body.content() != null && !body.content().trim().isEmpty()) {
            article.setContent(body.content());
        }

        if (body.mediaUrl() != null && !body.mediaUrl().trim().isEmpty()) {
            article.setMediaUrl(body.mediaUrl());
        }

        article.setWasEdit(true);

        return articleMapper.toDTO(articleRepository.saveAndFlush(article));
    }

    @Override
    @Transactional
    public void deleteArticle(Long articleId, @NotNull Authentication authentication) {
        String accountType = authentication.getAuthorities().stream()
                                           .map(Object::toString)
                                           .filter(s -> s.startsWith("ACCOUNT_TYPE_"))
                                           .findFirst()
                                           .orElseThrow(() -> new RuntimeException("Account type not found."));

        log.atInfo().log("The user {} with account type {} is trying to delete the article with id: {}.",
                         authentication.getName(), accountType, articleId);

        if (accountType.equals("ACCOUNT_TYPE_ADMINISTRATOR")) {
            articleRepository.deleteById(articleId);
        }

        articleRepository.deleteByIdAndAuthor_Username(articleId, authentication.getName());

        log.atInfo().log("The article with id: {} was deleted successfully.", articleId);
    }

    private @NotNull String generateSlug(@NotNull String title) {
        return title.toLowerCase().replaceAll("\\s+", "-");
    }
}
