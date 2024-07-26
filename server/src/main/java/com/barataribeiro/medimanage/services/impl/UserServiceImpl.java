package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.UserMapper;
import com.barataribeiro.medimanage.constants.ApplicationMessages;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateAccountRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateUserInformationDTO;
import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.models.User;
import com.barataribeiro.medimanage.exceptions.IllegalRequestException;
import com.barataribeiro.medimanage.exceptions.users.UserNotFoundException;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.UserService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsersPaginated(int page, int perPage, String type, @NotNull String direction,
                                              String orderBy, Principal principal) {
        Sort.Direction sortDirection = direction.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        orderBy = orderBy.equalsIgnoreCase("createdAt") ? "createdAt" : orderBy;
        PageRequest pageable = PageRequest.of(page, perPage, Sort.by(sortDirection, orderBy));

        Page<User> users;
        if (type != null && !type.trim().isEmpty()) {
            AccountType accountType = AccountType.valueOf(type);
            users = userRepository.findDistinctByAccountType(accountType, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }

        List<UserDTO> userDTOS = userMapper.toDTOList(users.getContent());

        return new PageImpl<>(userDTOS, pageable, users.getTotalElements());
    }

    @Override
    public UserDTO getUserInformation(String userId, Principal principal) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new UserNotFoundException(
                String.format(ApplicationMessages.USER_NOT_FOUND_WITH_ID, userId))
        );

        return userMapper.toDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateUserInformation(String userId, @NotNull UpdateUserInformationDTO body,
                                         Principal principal) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new UserNotFoundException(
                String.format(ApplicationMessages.USER_NOT_FOUND_WITH_ID, userId))
        );

        user.setUsername(body.username());
        user.setEmail(body.email());
        user.setFullName(body.fullName());
        user.setPhone(body.phone());
        user.setAddress(body.address());
        user.setBirthDate(LocalDate.parse(body.birthDate()));
        user.setAccountType(AccountType.valueOf(body.accountType()));

        return userMapper.toDTO(userRepository.saveAndFlush(user));
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void deleteUser(String userId, @NotNull Principal principal) {
        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow(() -> new UserNotFoundException(
                String.format(ApplicationMessages.USER_NOT_FOUND_WITH_ID, userId))
        );

        if (user.getUsername().equals(principal.getName())) {
            throw new IllegalRequestException("You cannot delete your own account.");
        }

        userRepository.delete(user);
    }

    @Override
    public UserDTO getContext(@NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new UserNotFoundException(
                String.format(ApplicationMessages.USER_NOT_FOUND_WITH_USERNAME, principal.getName())
        ));

        return userMapper.toDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateAccount(@NotNull UpdateAccountRequestDTO body, @NotNull Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new UserNotFoundException(
                String.format(ApplicationMessages.USER_NOT_FOUND_WITH_USERNAME, principal.getName())
        ));

        if (!user.getUsername().equals(principal.getName())) {
            throw new IllegalRequestException("You cannot update another user's account.");
        }

        if (!user.getPassword().equals(body.currentPassword())) {
            throw new IllegalRequestException("Current password is incorrect.");
        }

        if (userRepository.existsByEmail(body.email())) {
            throw new IllegalRequestException("Email is already in use.");
        }

        user.setEmail(body.email());
        user.setFullName(body.fullName());
        user.setPassword(body.newPassword());
        user.setPhone(body.phone());
        user.setAddress(body.address());
        user.setBirthDate(LocalDate.parse(body.birthDate()));

        return userMapper.toDTO(userRepository.saveAndFlush(user));
    }
}
