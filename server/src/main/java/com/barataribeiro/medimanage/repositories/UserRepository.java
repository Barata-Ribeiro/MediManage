package com.barataribeiro.medimanage.repositories;

import com.barataribeiro.medimanage.dtos.raw.simple.SimpleUserDTO;
import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.*;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

    Page<User> findDistinctByAccountType(AccountType accountType, Pageable pageable);

    @Query("""
            SELECT u FROM User u
            WHERE (u.fullName = :patientFullName AND u.accountType = 'PATIENT')
            OR (u.fullName = :doctorFullName AND u.accountType = 'DOCTOR')
           """)
    List<User> findPatientAndDoctorByFullname(@Param("patientFullName") String patientFullName,
                                              @Param("doctorFullName") String doctorFullName);


    // TESTING QUERY WITH DTO
    @Query("""
            SELECT DISTINCT new com.barataribeiro.medimanage.dtos.raw.simple.SimpleUserDTO(
                    u.id,
                    u.username,
                    u.fullName,
                    u.accountType,
                    u.userRoles)
            FROM User u
            WHERE (LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%'))
                  OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')))
            AND u.accountType = :accountType
            ORDER BY u.fullName ASC
           """)
    Set<SimpleUserDTO> findUsersBySearchAndAccountType(
            @Param("search") String search, @Param("accountType") AccountType accountType);

    @Query("""
            SELECT
            COUNT (u) AS totalUsers,
            SUM(CASE WHEN u.accountType = 'PATIENT' THEN 1 ELSE 0 END) AS patients,
            SUM(CASE WHEN u.accountType = 'DOCTOR' THEN 1 ELSE 0 END) AS doctors,
            SUM(CASE WHEN u.accountType = 'ASSISTANT' OR u.accountType = 'ADMINISTRATOR' THEN 1 ELSE 0 END) AS employees
            FROM User u
           """)
    Map<String, Long> countGroupedUsers();

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByUsernameOrEmail(String username, String email);

    boolean existsByEmailOrFullName(String email, String fullName);
}