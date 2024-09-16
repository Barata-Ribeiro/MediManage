package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.PrescriptionDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimplePrescriptionDTO;
import com.barataribeiro.medimanage.dtos.requests.PrescriptionCreateDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;

public interface PrescriptionService {
    Page<SimplePrescriptionDTO> getPatientPrescriptionsPaginatedList(String entityId, int page, int perPage,
                                                                     String direction, String orderBy,
                                                                     Principal principal);

    PrescriptionDTO getPrescription(String username, String prescriptionId, Principal principal);

    PrescriptionDTO createPrescription(String patientId, PrescriptionCreateDTO body, Principal principal);

    Page<SimplePrescriptionDTO> getMyPrescriptionsPaginatedList(String search, int page, int perPage, String direction,
                                                                String orderBy, Principal principal);
}
