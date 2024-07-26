package com.barataribeiro.medimanage.dtos.raw;

import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.enums.UserRoles;
import com.barataribeiro.medimanage.entities.models.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link User}
 */
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class SimpleUserDTO implements Serializable {
    UUID id;
    String username;
    String fullName;
    AccountType accountType;
    UserRoles userRoles;
}