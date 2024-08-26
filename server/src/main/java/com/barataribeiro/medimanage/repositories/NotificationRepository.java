package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @EntityGraph(attributePaths = {"user"})
    @Query("""
           SELECT n FROM Notification n
           LEFT JOIN FETCH n.user u
           WHERE u.id = :userId AND n.isRead = :isRead
           """)
    Page<Notification> findAllNotificationsPaginated(@Param("isRead") Boolean isRead, @Param("userId") String userId,
                                                     Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Page<Notification> findAllByUser_Id(UUID id, Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Optional<Notification> findFirstByIdAndUser_Id(Long notifId, UUID userId);

    @EntityGraph(attributePaths = {"user"})
    List<Notification> findDistinctTop5ByUser_IdOrderByIssuedAtAsc(UUID id);
}