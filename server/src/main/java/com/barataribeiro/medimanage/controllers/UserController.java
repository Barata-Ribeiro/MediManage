package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateAccountRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateUserInformationDTO;
import com.barataribeiro.medimanage.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    private final UserService userService;

    @GetMapping
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO> getAllUsersPaginated(@RequestParam(defaultValue = "0") int page,
                                                                @RequestParam(defaultValue = "10") int perPage,
                                                                @RequestParam(defaultValue = "ALL") String type,
                                                                @RequestParam(defaultValue = "ASC") String direction,
                                                                @RequestParam(defaultValue = "createdAt") String orderBy,
                                                                Principal principal) {
        Page<UserDTO> response = userService.getAllUsersPaginated(page, perPage, type, direction, orderBy, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Users retrieved successfully.",
                                                     response));
    }

    @GetMapping("/{userId}")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO> getUserInformation(@PathVariable String userId, Principal principal) {
        UserDTO response = userService.getUserInformation(userId, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "User retrieved successfully.",
                                                     response));
    }

    @PutMapping("/{userId}")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO> updateUserInformation(@PathVariable String userId,
                                                                 @RequestBody @Valid UpdateUserInformationDTO body,
                                                                 Principal principal) {
        UserDTO response = userService.updateUserInformation(userId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "User updated successfully.",
                                                     response));
    }

    @DeleteMapping("/{userId}")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO> deleteUser(@PathVariable String userId, Principal principal) {
        userService.deleteUser(userId, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "User deleted successfully.",
                                                     null));
    }

    @GetMapping("/me/context")
    public ResponseEntity<RestResponseDTO> getContext(Principal principal) {
        UserDTO response = userService.getContext(principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "User context retrieved successfully.",
                                                     response));
    }

    @PutMapping("/me")
    public ResponseEntity<RestResponseDTO> updateAccount(@RequestBody @Valid UpdateAccountRequestDTO body,
                                                         Principal principal) {
        UserDTO response = userService.updateAccount(body, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Account updated successfully.",
                                                     response));
    }


}
