package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.NotificationMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.NotificationDTO;
import com.barataribeiro.medimanage.entities.models.Notification;
import com.barataribeiro.medimanage.exceptions.notifications.NotificationNotFoundException;
import com.barataribeiro.medimanage.repositories.NotificationRepository;
import com.barataribeiro.medimanage.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getAllUserNotifications(String userId, Boolean isRead, int page, int perPage,
                                                         @NotNull String direction, String orderBy) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.ISSUED_AT) ? ApplicationConstants.ISSUED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Notification> notifications;
        if (isRead == null) notifications = notificationRepository.findAllByUser_Id(UUID.fromString(userId), pageable);
        else notifications = notificationRepository.findAllNotificationsPaginated(isRead, userId, pageable);

        List<NotificationDTO> notificationDTOS = notificationMapper.toDTOList(notifications.getContent());

        return new PageImpl<>(notificationDTOS, pageable, notifications.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationDTO getNotification(String userId, String notificationId) {
        Notification notification = notificationRepository.findFirstByIdAndUser_Id(Long.parseLong(notificationId),
                                                                                   UUID.fromString(userId))
                .orElseThrow(() -> new NotificationNotFoundException(
                        String.format(ApplicationMessages.NOTIFICATION_NOT_FOUND_WITH_ID, notificationId)
                ));
        return notificationMapper.toDTO(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getLatestUserNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findDistinctTop5ByUser_IdOrderByIssuedAtAsc(
                UUID.fromString(userId));
        return notificationMapper.toDTOList(notifications);
    }

    @Override
    @Transactional
    public NotificationDTO changeNotificationStatus(String userId, String notificationId, Boolean isRead) {
        Notification notification = notificationRepository.findFirstByIdAndUser_Id(Long.parseLong(notificationId),
                                                                                   UUID.fromString(userId))
                .orElseThrow(() -> new NotificationNotFoundException(
                        String.format(ApplicationMessages.NOTIFICATION_NOT_FOUND_WITH_ID, notificationId)
                ));

        notification.setIsRead(isRead);

        return notificationMapper.toDTO(notificationRepository.saveAndFlush(notification));
    }

    @Override
    @Transactional
    public void deleteNotification(String userId, String notificationId) {
        Notification notification = notificationRepository.findFirstByIdAndUser_Id(Long.parseLong(notificationId),
                                                                                   UUID.fromString(userId))
                .orElseThrow(() -> new NotificationNotFoundException(
                        String.format(ApplicationMessages.NOTIFICATION_NOT_FOUND_WITH_ID, notificationId)
                ));

        notificationRepository.delete(notification);
    }
}
