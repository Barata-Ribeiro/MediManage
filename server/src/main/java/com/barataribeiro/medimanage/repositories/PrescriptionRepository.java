package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    @EntityGraph(attributePaths = {"patient", "doctor"})
    Page<Prescription> findAllByPatient_Id(UUID patientId, Pageable pageable);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    Optional<Prescription> findByIdAndPatient_Username(Long id, String username);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    Optional<Prescription> findFirstByPatient_UsernameOrderByCreatedAtAsc(String username);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    List<Prescription> findTop5DistinctByDoctor_UsernameOrderByUpdatedAtDesc(String username);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    @Query("""
           SELECT p FROM Prescription p
           LEFT JOIN p.patient pat
           LEFT JOIN p.doctor doc
           WHERE LOWER(pat.username) = LOWER(:username)
           AND (LOWER(doc.username) LIKE LOWER(CONCAT('%', :searchParams, '%'))
                OR LOWER(doc.fullName) LIKE LOWER(CONCAT('%', :searchParams, '%'))
                OR LOWER(p.text) LIKE LOWER(CONCAT('%', :searchParams, '%')))
           """)
    Page<Prescription> findPrescriptionsBySearchParams(@Param("searchParams") String searchParams,
                                                       @Param("username") String username, Pageable pageable);
}