package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import com.barataribeiro.medimanage.entities.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {

    @EntityGraph(attributePaths = {"patient"})
    @Query("SELECT mr FROM MedicalRecord mr JOIN mr.patient p " +
            "WHERE LOWER(p.username) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<MedicalRecord> findRecordsBySearchParams(@Param("search") String search, Pageable pageable);

    @EntityGraph(attributePaths = {"patient", "consultations"})
    Optional<MedicalRecord> findByPatient(User patient);

    boolean existsByPatient(User patient);

}