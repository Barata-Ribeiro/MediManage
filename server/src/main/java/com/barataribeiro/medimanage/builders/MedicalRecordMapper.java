package com.barataribeiro.medimanage.builders;

import com.barataribeiro.medimanage.dtos.raw.MedicalRecordDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimpleMedicalRecordDTO;
import com.barataribeiro.medimanage.entities.models.MedicalRecord;
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
public class MedicalRecordMapper {
    private final ModelMapper modelMapper;

    public MedicalRecordDTO toDTO(MedicalRecord medicalRecord) {
        return modelMapper.map(medicalRecord, MedicalRecordDTO.class);
    }

    public SimpleMedicalRecordDTO toSimpleDTO(MedicalRecord medicalRecord) {
        return modelMapper.map(medicalRecord, SimpleMedicalRecordDTO.class);
    }

    public MedicalRecord toEntity(MedicalRecordDTO medicalRecordDTO) {
        return modelMapper.map(medicalRecordDTO, MedicalRecord.class);
    }

    public List<MedicalRecordDTO> toDTOList(@NotNull List<MedicalRecord> records) {
        return records.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<SimpleMedicalRecordDTO> toSimpleDTOList(@NotNull List<MedicalRecord> records) {
        return records.stream()
                .map(this::toSimpleDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<MedicalRecord> toListEntity(@NotNull List<MedicalRecordDTO> recordsDTOs) {
        return recordsDTOs.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
