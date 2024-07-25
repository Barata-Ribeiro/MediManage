package com.barataribeiro.medimanage.services;

import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateAccountRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateUserInformationDTO;
import org.springframework.data.domain.Page;

import java.security.Principal;

public interface UserService {
    Page<UserDTO> getAllUsersPaginated(int page, int perPage, String type,
                                       String direction, String orderBy, Principal principal);

    UserDTO getUserInformation(String userId, Principal principal);

    UserDTO updateUserInformation(String userId, UpdateUserInformationDTO body, Principal principal);

    void deleteUser(String userId, Principal principal);

    UserDTO getContext(Principal principal);

    UserDTO updateAccount(UpdateAccountRequestDTO body, Principal principal);
}
