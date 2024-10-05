package com.barataribeiro.medimanage.services.security.impl;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.barataribeiro.medimanage.repositories.BlacklistedTokenRepository;
import com.barataribeiro.medimanage.services.security.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import reactor.core.publisher.Mono;
import reactor.util.context.Context;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SecurityFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final RequestAttributeSecurityContextRepository filterRepository =
            new RequestAttributeSecurityContextRepository();
    private final BlacklistedTokenRepository blacklistedTokenRepository;

    @Override
    protected void doFilterInternal(final @NonNull HttpServletRequest request,
                                    final @NonNull HttpServletResponse response,
                                    final @NonNull FilterChain filterChain) throws ServletException, IOException {
        log.info("Filtering request...");
        String token = recoverToken(request);
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        if (token != null) {
            DecodedJWT decodedJWT = tokenService.validateToken(token);

            if (decodedJWT != null) {
                String jti = decodedJWT.getId();
                String username = decodedJWT.getSubject();

                if (blacklistedTokenRepository.existsById(jti)) {
                    log.atWarn().log("Token {} has been blacklisted!", jti);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }

                String role = decodedJWT.getClaim("role").asString();
                String accountType = decodedJWT.getClaim("accountType").asString();

                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role));
                authorities.add(new SimpleGrantedAuthority("ACCOUNT_TYPE_" + accountType));

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);
                filterRepository.saveContext(context, request, response);

                Mono.deferContextual(Mono::just)
                        .contextWrite(contextView -> Context.of("principal", username))
                        .subscribe();

                log.info("User authenticated successfully!");
            }
        }

        filterChain.doFilter(request, response);
    }

    private @Nullable String recoverToken(@NotNull HttpServletRequest request) {
        log.info("Recovering token from request...");

        String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            log.info("Token recovered successfully!");
            return authHeader.replace("Bearer ", "");
        }

        log.warn("Token not found in request.");

        return null;
    }
}