package com.barataribeiro.medimanage.services.security.impl;

import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountTypeSecurity {
    public boolean isAccountType(@NotNull Authentication authentication, String[] accountTypes) {
        return Arrays.stream(accountTypes)
                .anyMatch(accountType -> authentication.getAuthorities().stream()
                        .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ACCOUNT_TYPE_" + accountType)));
    }
}