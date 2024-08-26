package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.dtos.raw.NotificationDTO;
import com.barataribeiro.medimanage.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NotificationServiceImpl implements NotificationService {
    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getAllUserNotifications(String userId, Boolean isRead, int page, int perPage,
                                                         String direction, String orderBy) {
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationDTO getNotification(String userId, String notificationId) {
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getLatestUserNotifications(String userId) {
        return List.of();
    }

    @Override
    @Transactional
    public NotificationDTO changeNotificationStatus(String userId, String notificationId, Boolean isRead) {
        return null;
    }

    @Override
    @Transactional
    public void deleteNotification(String userId, String notificationId) {

    }
}
