package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.NotificationDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateNotificationDTO;
import org.springframework.data.domain.Page;

import java.util.List;


public interface NotificationService {
    Page<NotificationDTO> getAllUserNotifications(String userId, Boolean isRead, int page, int perPage,
                                                  String direction, String orderBy);

    NotificationDTO getNotification(String userId, String notificationId);

    List<NotificationDTO> getLatestUserNotifications(String userId);

    NotificationDTO changeNotificationStatus(String userId, String notificationId, Boolean isRead);

    List<NotificationDTO> changeNotificationStatusInBatch(String userId, List<UpdateNotificationDTO> notifications);

    void deleteNotification(String userId, String notificationId);

    void deleteNotificationsInBatch(String userId, List<String> notifIds);
}
