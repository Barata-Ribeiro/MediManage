package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
}