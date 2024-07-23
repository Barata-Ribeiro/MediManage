package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
}