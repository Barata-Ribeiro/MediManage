package com.barataribeiro.medimanage.builders;

import com.barataribeiro.medimanage.dtos.raw.ConsultationDTO;
import com.barataribeiro.medimanage.entities.models.Consultation;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class ConsultationMapper {
    private final ModelMapper modelMapper;

    public ConsultationDTO toDTO(Consultation consultation) {
        return modelMapper.map(consultation, ConsultationDTO.class);
    }

    public Consultation toEntity(ConsultationDTO consultationDTO) {
        return modelMapper.map(consultationDTO, Consultation.class);
    }

    public List<ConsultationDTO> toDTOList(@NotNull List<Consultation> consultations) {
        return consultations.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Consultation> toListEntity(@NotNull List<ConsultationDTO> consultationDTOS) {
        return consultationDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
