package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    @EntityGraph("Article.author.categories")
    List<Article> findDistinctTop4ByOrderByCreatedAtDesc();

    @EntityGraph("Article.author.categories")
    @Query("SELECT a FROM Article a LEFT JOIN FETCH a.categories c " +
            "WHERE LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%'))" +
            "OR LOWER(a.subTitle) LIKE LOWER(CONCAT('%', :search, '%'))" +
            "OR LOWER(a.content) LIKE LOWER(CONCAT('%', :search, '%'))" +
            "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Article> findArticlesBySearchParams(@Param("search") String search, Pageable pageable);

    @EntityGraph("Article.author.categories")
    Page<Article> findDistinctByCategories_Name(String name, Pageable pageable);

    long deleteByIdAndAuthor_Username(Long id, String username);
}