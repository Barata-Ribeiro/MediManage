package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.config.security.AccountType;
import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateAccountRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateUserInformationRequestDTO;
import com.barataribeiro.medimanage.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    private final UserService userService;

    @AccountType("ADMINISTRATOR")
    @GetMapping
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

    @AccountType("ADMINISTRATOR")
    @GetMapping("/{userId}")
    public ResponseEntity<RestResponseDTO> getUserInformation(@PathVariable String userId, Principal principal) {
        UserDTO response = userService.getUserInformation(userId, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "User retrieved successfully.",
                                                     response));
    }

    @AccountType("ADMINISTRATOR")
    @PutMapping("/{userId}")
    public ResponseEntity<RestResponseDTO> updateUserInformation(@PathVariable String userId,
                                                                 @RequestBody @Valid UpdateUserInformationRequestDTO body,
                                                                 Principal principal) {
        UserDTO response = userService.updateUserInformation(userId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "User updated successfully.",
                                                     response));
    }

    @AccountType("ADMINISTRATOR")
    @DeleteMapping("/{userId}")
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
