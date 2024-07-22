package com.barataribeiro.medimanage.config.security;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
@PreAuthorize("hasRole('ROLE_USER') " +
        "or hasRole('ROLE_ADMIN') " +
        "and @accountTypeSecurity.isAccountType(authentication, #accountType)")
public @interface AccountType {
    String value();
}
