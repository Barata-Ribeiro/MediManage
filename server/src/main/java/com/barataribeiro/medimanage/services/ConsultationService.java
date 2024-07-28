package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.ConsultationDTO;
import com.barataribeiro.medimanage.dtos.requests.ConsultationRegisterDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;

public interface ConsultationService {
    Page<ConsultationDTO> getConsultationsPaginated(String search, int page, int perPage, String direction,
                                                    String orderBy, Principal principal);

    Page<ConsultationDTO> getPatientConsultationsPaginatedList(String patientId, int page, int perPage,
                                                               String direction,
                                                               String orderBy, Principal principal);

    ConsultationDTO registerNewConsultationForPatient(ConsultationRegisterDTO body, Principal principal);
}
