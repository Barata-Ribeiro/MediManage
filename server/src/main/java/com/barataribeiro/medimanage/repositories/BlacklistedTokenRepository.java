package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.models.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, String> {
    Optional<BlacklistedToken> findByIdAndOwnerUsername(String id, String ownerUsername);

}