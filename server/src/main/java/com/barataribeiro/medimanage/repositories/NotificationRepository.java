package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}