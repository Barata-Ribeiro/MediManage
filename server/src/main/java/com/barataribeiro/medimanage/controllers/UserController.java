package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.UserContextDTO;
import com.barataribeiro.medimanage.dtos.raw.UserDTO;
import com.barataribeiro.medimanage.dtos.raw.simple.SimpleUserDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateAccountRequestDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateUserInformationDTO;
import com.barataribeiro.medimanage.dtos.responses.RestResponseDTO;
import com.barataribeiro.medimanage.entities.enums.AccountType;
import com.barataribeiro.medimanage.repositories.UserRepository;
import com.barataribeiro.medimanage.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    @Operation(summary = "Get all users paginated",
               description = "Get a paginated list of users. The list can be filtered by type, ordered by createdAt " +
                             "or" +
                             " " +
                             "updatedAt, and ordered in ASC or DESC order.",
               tags = {"users"})
    @GetMapping
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<Page<UserDTO>>> getAllUsersPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int perPage,
            @RequestParam(required = false) String type,
            @RequestParam(defaultValue = "ASC") String direction,
            @RequestParam(defaultValue = "createdAt")
            String orderBy,
            Principal principal) {

        Page<UserDTO> response = userService.getAllUsersPaginated(page, perPage, type, direction, orderBy, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Users retrieved successfully.",
                                                       response));
    }

    @Operation(summary = "Get user information",
               description = "Get a specific user information.",
               tags = {"users"})
    @GetMapping("/{userId}")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<UserDTO>> getUserInformation(@PathVariable String userId,
                                                                       Principal principal) {
        UserDTO response = userService.getUserInformation(userId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User retrieved successfully.",
                                                       response));
    }

    @Operation(summary = "Update user information",
               description = "Update a specific user information.",
               tags = {"users"})
    @PatchMapping("/{userId}")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<UserDTO>> updateUserInformation(@PathVariable String userId,
                                                                          @RequestBody @Valid
                                                                          UpdateUserInformationDTO body,
                                                                          Principal principal) {
        UserDTO response = userService.updateUserInformation(userId, body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User updated successfully.",
                                                       response));
    }

    @Operation(summary = "Delete user",
               description = "Delete a specific user.",
               tags = {"users"})
    @DeleteMapping("/{userId}")
    @Secured("ACCOUNT_TYPE_ADMINISTRATOR")
    public ResponseEntity<RestResponseDTO<UserDTO>> deleteUser(@PathVariable String userId, Principal principal) {
        userService.deleteUser(userId, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User deleted successfully.",
                                                       null));
    }

    @Operation(summary = "Get user context",
               description = "For the logged user, get the user context.",
               tags = {"users"})
    @GetMapping("/me/context")
    public ResponseEntity<RestResponseDTO<UserContextDTO>> getContext(Principal principal) {
        UserContextDTO response = userService.getContext(principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "User context retrieved successfully.",
                                                       response));
    }

    @Operation(summary = "Update account",
               description = "Update the account information of the logged user.",
               tags = {"users"})
    @PatchMapping("/me")
    public ResponseEntity<RestResponseDTO<UserContextDTO>> updateAccount(
            @RequestBody @Valid UpdateAccountRequestDTO body,
            Principal principal) {
        UserContextDTO response = userService.updateAccount(body, principal);
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Account updated successfully.",
                                                       response));
    }

    @Operation(summary = "Get search suggestions",
               description = "Get search suggestions for users.",
               tags = {"users"})
    @GetMapping("/search-suggestions")
    @Secured({"ACCOUNT_TYPE_ASSISTANT", "ACCOUNT_TYPE_ADMINISTRATOR", "ACCOUNT_TYPE_DOCTOR"})
    public ResponseEntity<RestResponseDTO<Set<SimpleUserDTO>>> getSearchSuggestions(
            @RequestParam(defaultValue = "") String search,
            @RequestParam String accountType) {

        Set<SimpleUserDTO> response = userRepository
                .findUsersBySearchAndAccountType(search, AccountType.valueOf(accountType));
        return ResponseEntity.ok(new RestResponseDTO<>(HttpStatus.OK,
                                                       HttpStatus.OK.value(),
                                                       "Suggestions retrieved successfully.",
                                                       response));
    }
}
