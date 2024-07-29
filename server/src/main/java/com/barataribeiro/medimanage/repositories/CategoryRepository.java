package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}