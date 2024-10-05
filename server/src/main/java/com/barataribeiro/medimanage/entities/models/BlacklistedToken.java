package com.barataribeiro.medimanage.entities.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Entity
@Table(name = "tb_blacklist", uniqueConstraints = {
        @UniqueConstraint(name = "uc_blacklist_token", columnNames = {"token"}),
})
public class BlacklistedToken {
    @Id // The id is the JTI (JWT Token Identifier)
    @Column(updatable = false, nullable = false, unique = true)
    private String id;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "owner_username", nullable = false)
    private String ownerUsername;

    @Column(name = "expiration_date", nullable = false)
    private Instant expirationDate;

    @Column(name = "blacklisted_at", nullable = false)
    @CreationTimestamp
    private Instant blacklistedAt;

}