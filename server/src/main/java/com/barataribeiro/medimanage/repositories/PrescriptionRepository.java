package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    @EntityGraph(attributePaths = {"patient", "doctor"})
    Page<Prescription> findAllByPatient_Id(UUID patientId, Pageable pageable);
}