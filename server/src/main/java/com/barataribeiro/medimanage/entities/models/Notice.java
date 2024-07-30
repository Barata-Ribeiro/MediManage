package com.barataribeiro.medimanage.entities.models;

import com.barataribeiro.medimanage.entities.enums.NoticeStatus;
import com.barataribeiro.medimanage.entities.enums.NoticeType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_notices")
public class Notice {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "media_url")
    private String mediaUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "notice_type", nullable = false)
    private NoticeType type = NoticeType.ANNOUNCEMENT;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "notice_status", nullable = false)
    private NoticeStatus status = NoticeStatus.ACTIVE;

    @ManyToOne(optional = false)
    @JoinColumn(name = "issuer_id")
    private User issuer;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;
}