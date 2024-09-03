package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.NotificationDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateNotificationDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;
import java.util.List;


public interface NotificationService {
    Page<NotificationDTO> getAllUserNotifications(String userId, Boolean isRead, int page, int perPage,
                                                  String direction, String orderBy, Principal principal);

    NotificationDTO getNotification(String userId, String notificationId, Principal principal);

    List<NotificationDTO> getLatestUserNotifications(String userId, Principal principal);

    NotificationDTO changeNotificationStatus(String userId, String notificationId, Boolean isRead, Principal principal);

    List<NotificationDTO> changeNotificationStatusInBatch(String userId, List<UpdateNotificationDTO> notifications,
                                                          Principal principal);

    void deleteNotification(String userId, String notificationId, Principal principal);

    void deleteNotificationsInBatch(String userId, List<String> notifIds, Principal principal);
}
