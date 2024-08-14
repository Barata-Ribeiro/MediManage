package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.dtos.raw.CategoryArticleCountDTO;
import com.barataribeiro.medimanage.entities.models.Category;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    @EntityGraph(attributePaths = {"articles"})
    @Query("""
             SELECT new com.barataribeiro.medimanage.dtos.raw.CategoryArticleCountDTO(c, COUNT(a))
             FROM Category c
             LEFT OUTER JOIN c.articles a
             GROUP BY c
            """)
    Set<CategoryArticleCountDTO> findAllCategoriesAndDisplayArticlesCount();
}