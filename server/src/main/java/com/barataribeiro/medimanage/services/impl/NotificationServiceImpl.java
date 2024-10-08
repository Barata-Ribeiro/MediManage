package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.NotificationMapper;
import com.barataribeiro.medimanage.constants.ApplicationConstants;
import com.barataribeiro.medimanage.dtos.raw.NotificationDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateNotificationDTO;
import com.barataribeiro.medimanage.entities.models.Notification;
import com.barataribeiro.medimanage.exceptions.EntityNotFoundException;
import com.barataribeiro.medimanage.exceptions.IllegalRequestException;
import com.barataribeiro.medimanage.repositories.NotificationRepository;
import com.barataribeiro.medimanage.services.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NotificationServiceImpl implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getAllUserNotifications(String userId, Boolean isRead, int page, int perPage,
                                                         @NotNull String direction, String orderBy,
                                                         Principal principal) {
        log.atInfo().log("Fetching notifications for user with id: {}", userId);
        log.atInfo().log("isRead: {}, page: {}, perPage: {}, direction: {}, orderBy: {}",
                         isRead, page, perPage, direction, orderBy);

        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase(ApplicationConstants.ISSUED_AT) ? ApplicationConstants.ISSUED_AT : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<Notification> notifications;
        if (isRead == null) {
            notifications = notificationRepository
                    .findAllByUser_IdAndUser_Username(UUID.fromString(userId), principal.getName(), pageable);
        } else {
            notifications = notificationRepository
                    .findAllNotificationsPaginated(isRead, UUID.fromString(userId), principal.getName(), pageable);
        }

        List<NotificationDTO> notificationDTOS = notificationMapper.toDTOList(notifications.getContent());
        log.atInfo().log("Returning {} notifications.", notificationDTOS.size());
        return new PageImpl<>(notificationDTOS, pageable, notifications.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationDTO getNotification(String userId, String notificationId, @NotNull Principal principal) {
        log.atInfo().log("Fetching notification with id: {} for user with id: {}", notificationId, userId);
        Notification notification = notificationRepository
                .findFirstByIdAndUser_IdAndUser_Username(Long.parseLong(notificationId), UUID.fromString(userId),
                                                         principal.getName())
                .orElseThrow(() -> new EntityNotFoundException(Notification.class.getSimpleName(), notificationId));
        log.atInfo().log("Notification with id: {} found and returned.", notificationId);
        return notificationMapper.toDTO(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getLatestUserNotifications(String userId, @NotNull Principal principal) {
        log.atInfo().log("Fetching latest 5 notifications for user with id: {}", userId);
        List<Notification> notifications = notificationRepository
                .findTop5ByUser_IdAndUser_UsernameOrderByIssuedAtDesc(UUID.fromString(userId), principal.getName());
        log.atInfo().log("{} of the latest notifications found and returned.", notifications.size());
        return notificationMapper.toDTOList(notifications);
    }

    @Override
    @Transactional
    public NotificationDTO changeNotificationStatus(String userId, String notificationId, Boolean isRead,
                                                    @NotNull Principal principal) {
        log.atInfo().log("Changing status of notification with id: {} for user with id: {} to: {}",
                         notificationId, userId, isRead);
        Notification notification = notificationRepository
                .findFirstByIdAndUser_IdAndUser_Username(Long.parseLong(notificationId), UUID.fromString(userId),
                                                         principal.getName())
                .orElseThrow(() -> new EntityNotFoundException(Notification.class.getSimpleName(), notificationId));

        notification.setIsRead(isRead);
        notification.setReadAt(Boolean.TRUE.equals(isRead) ? Instant.now() : null);
        log.atInfo().log("Notification status changed successfully.");
        return notificationMapper.toDTO(notificationRepository.saveAndFlush(notification));
    }

    @Override
    @Transactional
    public List<NotificationDTO> changeNotificationStatusInBatch(String userId,
                                                                 List<UpdateNotificationDTO> notifications,
                                                                 Principal principal) {
        if (notifications == null || notifications.isEmpty()) {
            throw new IllegalRequestException("No notifications to update.");
        }

        log.atInfo().log("Changing status of {} notifications for user with id: {} to new status.",
                         notifications.size(), userId);

        List<Long> notificationsIds = notifications.stream().map(
                updateNotificationDTO -> Long.parseLong(updateNotificationDTO.notificationId())
        ).toList();

        List<Notification> notificationsToUpdate = notificationRepository
                .findDistinctByListOfIds(notificationsIds, UUID.fromString(userId), principal.getName());

        notificationsToUpdate.forEach(notification -> {
            UpdateNotificationDTO updateNotificationDTO = notifications.stream().filter(
                    updateNotification -> updateNotification.notificationId().equals(
                            String.valueOf(notification.getId())
                    )
            ).findFirst().orElseThrow(
                    () -> new EntityNotFoundException(Notification.class.getSimpleName(),
                                                      notification.getId().toString()));

            notification.setIsRead(updateNotificationDTO.newStatus());
            notification.setReadAt(Boolean.TRUE.equals(updateNotificationDTO.newStatus()) ? Instant.now() : null);
        });

        log.atInfo().log("Notifications with ids: {} updated successfully.", notificationsIds);

        return notificationMapper.toDTOList(notificationRepository.saveAllAndFlush(notificationsToUpdate));
    }

    @Override
    @Transactional
    public void deleteNotification(String userId, String notificationId, @NotNull Principal principal) {
        log.atInfo().log("Deleting notification with id: {} for user with id: {}", notificationId, userId);
        Notification notification = notificationRepository
                .findFirstByIdAndUser_IdAndUser_Username(Long.parseLong(notificationId), UUID.fromString(userId),
                                                         principal.getName())
                .orElseThrow(() -> new EntityNotFoundException(Notification.class.getSimpleName(), notificationId));
        notificationRepository.delete(notification);
    }

    @Override
    @Transactional
    public void deleteNotificationsInBatch(String userId, List<String> notifIds, Principal principal) {
        if (notifIds == null || notifIds.isEmpty()) {
            throw new IllegalRequestException("No notifications to delete.");
        }

        log.atInfo().log("Deleting {} notifications for user with id: {}.", notifIds.size(), userId);
        List<Long> notificationsIds = notifIds.stream().map(Long::parseLong).toList();
        List<Notification> notificationsToDelete = notificationRepository
                .findDistinctByListOfIds(notificationsIds, UUID.fromString(userId), principal.getName());

        if (notificationsToDelete.isEmpty()) {
            throw new IllegalRequestException("No notifications to delete.");
        }

        notificationRepository.deleteAll(notificationsToDelete);
    }
}
