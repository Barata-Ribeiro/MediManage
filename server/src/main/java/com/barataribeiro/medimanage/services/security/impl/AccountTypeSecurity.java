package com.barataribeiro.medimanage.services.security.impl;

import com.barataribeiro.medimanage.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountTypeSecurity {
    private final UserRepository userRepository;

    public boolean isAccountType(@NotNull Authentication authentication, String accountType) {
        return authentication.getAuthorities().stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals("ACCOUNT_TYPE_" + accountType));
    }
}
