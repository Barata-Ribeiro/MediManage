package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    @Query("SELECT c FROM Consultation c " +
            "JOIN c.patient p JOIN c.doctor d " +
            "WHERE LOWER(p.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(d.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Consultation> findConsultationsBySearchParams(String search, Pageable pageable);
}