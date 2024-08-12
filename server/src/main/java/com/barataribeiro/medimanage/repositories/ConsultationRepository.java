package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.enums.ConsultationStatus;
import com.barataribeiro.medimanage.entities.models.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {

    @Query("SELECT c FROM Consultation c " +
           "JOIN c.patient p JOIN c.doctor d " +
           "WHERE LOWER(p.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(d.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Consultation> findConsultationsBySearchParams(String search, Pageable pageable);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    Page<Consultation> findAllByPatient_Id(UUID uuid, Pageable pageable);

    List<Consultation> findAllByScheduledToBeforeAndStatusNotIn(LocalDateTime now,
                                                                Collection<ConsultationStatus> statuses);

    @Query("""
           SELECT
           SUM (CASE WHEN c.status = 'SCHEDULED' THEN 1 ELSE 0 END) AS scheduled,
           SUM (CASE WHEN c.status = 'ACCEPTED' THEN 1 ELSE 0 END) AS accepted,
           SUM (CASE WHEN c.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS inProgress,
           SUM (CASE WHEN c.status = 'DONE' THEN 1 ELSE 0 END) AS done,
           SUM (CASE WHEN c.status = 'MISSED' THEN 1 ELSE 0 END) AS missed,
           SUM (CASE WHEN c.status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled
           FROM Consultation c
           """)
    Map<String, Long> countGroupedConsultationsByStatus();

    // Use CAST for date comparison for compatibility with other databases
    @Query("""
           SELECT
           COUNT(c) AS totalConsultations,
           COALESCE(SUM(CASE WHEN c.status = 'SCHEDULED' THEN 1 ELSE 0 END), 0) AS scheduled,
           COALESCE(SUM(CASE WHEN c.status = 'ACCEPTED' THEN 1 ELSE 0 END), 0) AS accepted,
           COALESCE(SUM(CASE WHEN c.status = 'IN_PROGRESS' THEN 1 ELSE 0 END), 0) AS inProgress,
           COALESCE(SUM(CASE WHEN c.status = 'DONE' THEN 1 ELSE 0 END), 0) AS done,
           COALESCE(SUM(CASE WHEN c.status = 'MISSED' THEN 1 ELSE 0 END), 0) AS missed,
           COALESCE(SUM(CASE WHEN c.status = 'CANCELLED' THEN 1 ELSE 0 END), 0) AS cancelled
           FROM Consultation c
           WHERE CAST(c.scheduledTo AS DATE) = CURRENT_DATE
           """)
    Map<String, Long> countGroupedConsultationsByStatusToday();
}