package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    @EntityGraph(attributePaths = {"patient", "doctor"})
    @Query("SELECT 'p.id', 'p.patient', 'p.doctor', 'p.createdAt', 'p.updatedAt' FROM Prescription p WHERE p.patient" +
            ".id = :patientId")
    Page<Prescription> findDistinctByPatientId(UUID patientId, Pageable pageable);
}