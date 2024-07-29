package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findDistinctTop4ByOrderByCreatedAtDesc();
}