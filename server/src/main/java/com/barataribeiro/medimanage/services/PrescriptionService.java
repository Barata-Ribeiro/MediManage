package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.PrescriptionDTO;
import com.barataribeiro.medimanage.dtos.raw.SimplePrescriptionDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;

public interface PrescriptionService {
    Page<SimplePrescriptionDTO> getPatientPrescriptionsPaginatedList(String entityId, int page, int perPage,
                                                                     String direction, String orderBy,
                                                                     Principal principal);

    PrescriptionDTO getPrescription(String prescriptionId, Principal principal);

    PrescriptionDTO createPrescription(String text, Principal principal);
}
