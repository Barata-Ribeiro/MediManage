package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
}