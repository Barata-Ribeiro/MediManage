package com.barataribeiro.medimanage.entities.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_notifications")
public class Notification implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String message;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Builder.Default
    @Column(name = "is_read")
    private Boolean isRead = false;

    @Column(name = "issued_at", updatable = false)
    @CreationTimestamp
    private Instant issuedAt;

    @Column(name = "read_at")
    private Instant readAt;

    @PostPersist
    @PostUpdate
    @PostRemove
    public void updateUser() {
        user.updateNotificationCounts();
    }
}