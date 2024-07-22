package com.barataribeiro.medimanage.entities.models;

import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.enums.UserRoles;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
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
        @Index(name = "idx_user_email_unq", columnList = "email", unique = true)
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

    private String phone;

    private String address;

    private LocalDate birthdate;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_type", nullable = false, unique = true)
    private AccountType accountType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(name = "user_roles", unique = true)
    private UserRoles userRoles = UserRoles.USER;

}