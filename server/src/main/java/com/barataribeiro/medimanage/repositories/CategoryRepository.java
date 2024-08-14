package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
}