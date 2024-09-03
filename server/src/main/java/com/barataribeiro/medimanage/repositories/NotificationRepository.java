package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @EntityGraph(attributePaths = {"user"})
    @Query("""
           SELECT n FROM Notification n
           LEFT JOIN FETCH n.user u
           WHERE u.id = :userId AND u.username = :username
           AND n.isRead = :isRead
           """)
    Page<Notification> findAllNotificationsPaginated(@Param("isRead") Boolean isRead, @Param("userId") UUID userId,
                                                     @Param("username") String username, Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Page<Notification> findAllByUser_IdAndUser_Username(UUID id, String username, Pageable pageable);

    @EntityGraph(attributePaths = {"user"})
    Optional<Notification> findFirstByIdAndUser_IdAndUser_Username(Long notifId, UUID userId, String username);

    @EntityGraph(attributePaths = {"user"})
    List<Notification> findDistinctTop5ByUser_IdAndUser_UsernameOrderByIssuedAtAsc(UUID id, String username);

    @EntityGraph(attributePaths = {"user"})
    @Query("""
           SELECT DISTINCT n FROM Notification n
           LEFT JOIN FETCH n.user u
           WHERE n.id IN :ids
           AND u.id = :userId AND u.username = :username
           """)
    List<Notification> findDistinctByListOfIds(@Param("ids") Collection<Long> ids, @Param("userId") UUID userId,
                                               @Param("username") String username);
}