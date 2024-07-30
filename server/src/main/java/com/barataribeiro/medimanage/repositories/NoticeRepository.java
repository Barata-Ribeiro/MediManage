package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Notice;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    @EntityGraph(attributePaths = {"issuer"})
    Optional<Notice> findDistinctFirstByOrderByCreatedAtDesc();
}