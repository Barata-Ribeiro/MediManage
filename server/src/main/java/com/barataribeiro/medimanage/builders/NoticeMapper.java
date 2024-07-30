package com.barataribeiro.medimanage.builders;

import com.barataribeiro.medimanage.dtos.raw.NoticeDTO;
import com.barataribeiro.medimanage.entities.models.Notice;
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
public class NoticeMapper {
    private final ModelMapper modelMapper;

    public NoticeDTO toDTO(Notice notice) {
        return modelMapper.map(notice, NoticeDTO.class);
    }

    public Notice toEntity(NoticeDTO noticeDTO) {
        return modelMapper.map(noticeDTO, Notice.class);
    }

    public List<NoticeDTO> toDTOList(@NotNull List<Notice> notices) {
        return notices.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Notice> toListEntity(@NotNull List<NoticeDTO> noticeDTOS) {
        return noticeDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }


}
