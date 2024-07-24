package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.MedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.requests.MedicalRecordRegisterDTO;

import java.security.Principal;

public interface MedicalRecordService {
    MedicalRecordDTO registerMedicalRecord(Principal principal, MedicalRecordRegisterDTO body);
}
