package com.barataribeiro.medimanage.services.impl;

import com.barataribeiro.medimanage.builders.UserMapper;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateAccountRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateUserInformationRequestDTO;
import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.entities.models.User;
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

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
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
        return null;
    }

    @Override
    public UserDTO updateUserInformation(String userId, UpdateUserInformationRequestDTO body, Principal principal) {
        return null;
    }

    @Override
    public void deleteUser(String userId, Principal principal) {
        // TODO: To implement this delete method
    }

    @Override
    public UserDTO getContext(Principal principal) {
        return null;
    }

    @Override
    public UserDTO updateAccount(UpdateAccountRequestDTO body, Principal principal) {
        return null;
    }
}
