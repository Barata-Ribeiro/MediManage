package com.barataribeiro.medimanage.builders;

import com.barataribeiro.medimanage.dtos.raw.NotificationDTO;
import com.barataribeiro.medimanage.entities.models.Notification;
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
public class NotificationMapper {
    private final ModelMapper modelMapper;

    public NotificationDTO toDTO(Notification notification) {
        return modelMapper.map(notification, NotificationDTO.class);
    }

    public Notification toEntity(NotificationDTO notificationDTO) {
        return modelMapper.map(notificationDTO, Notification.class);
    }

    public List<NotificationDTO> toDTOList(@NotNull List<Notification> notifications) {
        return notifications.stream()
                .map(this::toDTO)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    public List<Notification> toListEntity(@NotNull List<NotificationDTO> notificationDTOS) {
        return notificationDTOS.stream()
                .map(this::toEntity)
                .collect(Collectors.toCollection(ArrayList::new));
    }
}
