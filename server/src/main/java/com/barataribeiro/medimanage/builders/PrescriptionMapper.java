package com.barataribeiro.medimanage.builders;

import com.barataribeiro.medimanage.dtos.raw.PrescriptionDTO;
import com.barataribeiro.medimanage.dtos.raw.SimplePrescriptionDTO;
import com.barataribeiro.medimanage.entities.models.Prescription;
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
public class PrescriptionMapper {
    private final ModelMapper modelMapper;

    public PrescriptionDTO toDTO(Prescription prescription) {
        return modelMapper.map(prescription, PrescriptionDTO.class);
    }

    public SimplePrescriptionDTO toSimpleDTO(Prescription prescription) {
        return modelMapper.map(prescription, SimplePrescriptionDTO.class);
    }

    public Prescription toEntity(PrescriptionDTO prescriptionDTO) {
        return modelMapper.map(prescriptionDTO, Prescription.class);
    }

    public List<PrescriptionDTO> toDTOList(@NotNull List<Prescription> prescriptions) {
        return prescriptions.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<SimplePrescriptionDTO> toSimpleDTOList(@NotNull List<Prescription> prescriptions) {
        return prescriptions.stream()
                .map(this::toSimpleDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Prescription> toListEntity(@NotNull List<PrescriptionDTO> prescriptionDTOS) {
        return prescriptionDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }

}
