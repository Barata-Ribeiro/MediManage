package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.MedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.requests.MedicalRecordRegisterDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;

public interface MedicalRecordService {
    Page<MedicalRecordDTO> getMedicalRecordsPaginated(String search, int page, int perPage, String direction,
                                                      String orderBy, Principal principal);

    MedicalRecordDTO getMedicalRecord(String recordId, Principal principal);

    MedicalRecordDTO registerMedicalRecord(Principal principal, MedicalRecordRegisterDTO body);

    MedicalRecordDTO updateMedicalRecord(Principal principal, MedicalRecordRegisterDTO body, String recordId);
}
