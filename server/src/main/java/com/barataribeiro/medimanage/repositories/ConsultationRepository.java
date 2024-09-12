package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.enums.ConsultationStatus;
import com.barataribeiro.medimanage.entities.models.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.*;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    @EntityGraph(attributePaths = {"patient", "doctor"})
    @Query("SELECT c FROM Consultation c " +
           "JOIN c.patient p JOIN c.doctor d " +
           "WHERE LOWER(p.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(d.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(d.fullName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Consultation> findConsultationsBySearchParams(String search, Pageable pageable);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    Page<Consultation> findAllByPatient_Id(UUID uuid, Pageable pageable);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    List<Consultation> findAllByScheduledToBeforeAndStatusNotIn(LocalDateTime now,
                                                                Collection<ConsultationStatus> statuses);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    @Query("""
           SELECT c FROM Consultation c WHERE c.patient.username = :username
           AND c.status = 'SCHEDULED'
           ORDER BY c.scheduledTo ASC
           """)
    Optional<Consultation> findNextScheduledConsultation(String username);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    @Query("""
              SELECT DISTINCT c FROM Consultation c
              WHERE c.status = 'SCHEDULED'
              ORDER BY c.scheduledTo ASC
           """)
    Optional<Consultation> findNextConsultationToBeAccepted();

    @Query("""
           SELECT c FROM Consultation c
           WHERE c.scheduledTo >= :startOfDay AND c.scheduledTo < :endOfDay
           ORDER BY c.scheduledTo ASC
           """)
    List<Consultation> findAllConsultationsForToday(LocalDateTime startOfDay, LocalDateTime endOfDay);

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