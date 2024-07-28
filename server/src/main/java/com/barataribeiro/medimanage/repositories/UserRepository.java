package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

    Page<User> findDistinctByAccountType(AccountType accountType, Pageable pageable);


    List<User> findDistinctAllByFullNameInIgnoreCaseAndAccountTypeIn(Collection<String> fullName,
                                                                     Collection<AccountType> accountType);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsernameOrEmail(String username, String email);

    boolean existsByEmailOrFullName(String email, String fullName);
}