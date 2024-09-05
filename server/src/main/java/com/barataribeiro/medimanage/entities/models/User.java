package com.barataribeiro.medimanage.entities.models;

import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.enums.UserRoles;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name = "tb_users", indexes = {
        @Index(name = "idx_user_username_unq", columnList = "username", unique = true),
        @Index(name = "idx_user_email_unq", columnList = "email", unique = true),
        @Index(name = "idx_user_full_name_unq", columnList = "full_name", unique = true)
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name")
    private String fullName;

    private String phone;

    private String address;

    private LocalDate birthDate;

    // Doctor related fields
    @Column(name = "registration_number", unique = true)
    private String registrationNumber;

    @Column(name = "registration_origin")
    private String registrationOrigin;

    private String specialization;
    // End of Doctor related fields

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false)
    private AccountType accountType;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "user_roles")
    private UserRoles userRoles = UserRoles.USER;

    @Builder.Default
    @Column(name = "total_notifications", columnDefinition = "BIGINT default '0'", nullable = false)
    private Long totalNotifications = 0L;

    @Builder.Default
    @Column(name = "total_read_notifications", columnDefinition = "BIGINT default '0'", nullable = false)
    private Long totalReadNotifications = 0L;

    @Builder.Default
    @Column(name = "total_unread_notifications", columnDefinition = "BIGINT default '0'", nullable = false)
    private Long totalUnreadNotifications = 0L;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private Instant updatedAt;

    // Associations
    @Builder.Default
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Notification> notifications = new LinkedHashSet<>();

    @Builder.Default
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Consultation> consultationsAsPatient = new LinkedHashSet<>();

    @Builder.Default
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Consultation> consultationsAsDoctor = new LinkedHashSet<>();

    @JsonIgnore
    @ToString.Exclude
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private MedicalRecord medicalRecord;

    @Builder.Default
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Prescription> prescriptionsAsPatient = new LinkedHashSet<>();

    @Builder.Default
    @JsonIgnore
    @ToString.Exclude
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<Prescription> prescriptionsAsDoctor = new LinkedHashSet<>();


    // Lifecycle methods
    @PostLoad
    @PostPersist
    @PostUpdate
    public void updateNotificationCounts() {
        this.totalNotifications = (long) this.notifications.size();
        this.totalReadNotifications = this.notifications.stream().filter(Notification::getIsRead).count();
        this.totalUnreadNotifications = this.totalNotifications - this.totalReadNotifications;
    }
}