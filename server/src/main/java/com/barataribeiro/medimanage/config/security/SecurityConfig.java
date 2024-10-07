package com.barataribeiro.medimanage.config.security;

import com.barataribeiro.medimanage.services.security.impl.SecurityFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
@EnableScheduling
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class SecurityConfig {

    private static final String[] AUTH_WHITELIST = {
            // -- Swagger UI v2
            "/v2/api-docs",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui.html",
            "/webjars/**",
            // -- Swagger UI v3 (OpenAPI)
            "/api-docs/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            // -- MediManage
            "/",
            "/api/v1/auth/**",
            "/api/v1/articles/public/**",
            "/api/v1/notices/public/**"
    };
    private static final String CONTENT_SECURITY_POLICY_VALUE = "default-src 'self'; base-uri 'self'; " +
                                                                "font-src 'self' https: data:; form-action 'self'; " +
                                                                "frame-ancestors 'self'; img-src 'self' data:; " +
                                                                "object-src 'none'; script-src 'self'; style-src " +
                                                                "'self' https:; upgrade-insecure-requests";
    private final SecurityFilter securityFilter;

    @Value("${api.security.argon2.salt}")
    private int salt;
    @Value("${api.security.argon2.length}")
    private int length;
    @Value("${api.security.argon2.parallelism}")
    private int parallelism;
    @Value("${api.security.argon2.memory}")
    private int memory;
    @Value("${api.security.argon2.iterations}")
    private int iterations;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .httpStrictTransportSecurity(Customizer.withDefaults())
                        .xssProtection(Customizer.withDefaults())
                        .contentSecurityPolicy(csp -> csp.policyDirectives(CONTENT_SECURITY_POLICY_VALUE))
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin)
                        .permissionsPolicy(policy -> policy.policy("geolocation=(), microphone=(), camera=()")))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(AUTH_WHITELIST).permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new Argon2PasswordEncoder(salt, length, parallelism, memory, iterations);
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
