package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.ConsultationMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.ConsultationDTO;
import com.barataribeiro.medimanage.entities.models.Consultation;
import com.barataribeiro.medimanage.repositories.ConsultationRepository;
import com.barataribeiro.medimanage.services.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ConsultationServiceImpl implements ConsultationService {
    private final ConsultationRepository consultationRepository;
    private final ConsultationMapper consultationMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<ConsultationDTO> getConsultationsPaginated(String search, int page, int perPage,
                                                           @NotNull String direction,
                                                           String orderBy, Principal principal) {

        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Consultation> consultations;
        if (search != null && !search.trim().isEmpty()) {
            consultations = consultationRepository.findConsultationsBySearchParams(search, pageable);
        } else {
            consultations = consultationRepository.findAll(pageable);
        }

        List<ConsultationDTO> consultationDTOS = consultationMapper.toDTOList(consultations.getContent());

        return new PageImpl<>(consultationDTOS, pageable, consultations.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConsultationDTO> getPatientConsultationsPaginatedList(String patientId, int page, int perPage,
                                                                      @NotNull String direction, String orderBy,
                                                                      Principal principal) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.CREATED_AT) ? ApplicationConstants.CREATED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Consultation> consultations = consultationRepository.findAllByPatient_Id(UUID.fromString(patientId),
                                                                                      pageable);

        List<ConsultationDTO> consultationDTOS = consultationMapper.toDTOList(consultations.getContent());

        return new PageImpl<>(consultationDTOS, pageable, consultations.getTotalElements());
    }
}
