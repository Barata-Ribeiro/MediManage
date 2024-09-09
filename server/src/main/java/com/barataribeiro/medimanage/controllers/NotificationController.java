package com.barataribeiro.medimanage.controllers;

import com.barataribeiro.medimanage.dtos.raw.NotificationDTO;
import com.barataribeiro.medimanage.dtos.raw.RestResponseDTO;
import com.barataribeiro.medimanage.dtos.requests.UpdateNotificationDTO;
import com.barataribeiro.medimanage.services.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class NotificationController {
    private final NotificationService notificationService;

    @Operation(summary = "Get all user notifications",
               description = "Get a paginated list of notifications for a specific user. The list can be filtered by " +
                             "isRead, ordered by issuedAt, and ordered in ASC or DESC order.",
               tags = {"notifications"})
    @GetMapping("/{userId}")
    public ResponseEntity<RestResponseDTO> getAllUserNotifications(@PathVariable String userId,
                                                                   @RequestParam(required = false) Boolean isRead,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "10") int perPage,
                                                                   @RequestParam(defaultValue = "ASC") String direction,
                                                                   @RequestParam(defaultValue = "issuedAt")
                                                                   String orderBy, Principal principal) {
        Page<NotificationDTO> response = notificationService.getAllUserNotifications(userId, isRead, page, perPage,
                                                                                     direction, orderBy, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Notifications retrieved successfully.",
                                                     response));
    }

    @Operation(summary = "Get latest user notifications",
               description = "Get the latest notifications for a specific user.",
               tags = {"notifications"})
    @GetMapping("/{userId}/latest")
    public ResponseEntity<RestResponseDTO> getLatestUserNotifications(@PathVariable String userId,
                                                                      Principal principal) {
        List<NotificationDTO> response = notificationService.getLatestUserNotifications(userId, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Notifications retrieved successfully.",
                                                     response));
    }

    @Operation(summary = "Get notification",
               description = "Get a specific notification.",
               tags = {"notifications"})
    @GetMapping("/{userId}/{notificationId}")
    public ResponseEntity<RestResponseDTO> getNotification(@PathVariable String userId,
                                                           @PathVariable String notificationId, Principal principal) {
        NotificationDTO response = notificationService.getNotification(userId, notificationId, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Notification retrieved successfully.",
                                                     response));
    }

    @Operation(summary = "Change notification status",
               description = "Change the status of a specific notification.",
               tags = {"notifications"})
    @PatchMapping("/{userId}/{notificationId}")
    public ResponseEntity<RestResponseDTO> changeNotificationStatus(@PathVariable String userId,
                                                                    @PathVariable String notificationId,
                                                                    @RequestParam Boolean isRead, Principal principal) {
        NotificationDTO response = notificationService.changeNotificationStatus(userId, notificationId, isRead,
                                                                                principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Notification status changed successfully.",
                                                     response));
    }

    @Operation(summary = "Change notification status in batch",
               description = "Change the status of multiple notifications.",
               tags = {"notifications"})
    @PatchMapping("/{userId}")
    public ResponseEntity<RestResponseDTO> changeNotificationStatusInBatch(@PathVariable String userId,
                                                                           @RequestBody @Valid
                                                                           List<UpdateNotificationDTO> notifications,
                                                                           Principal principal) {
        List<NotificationDTO> response = notificationService.changeNotificationStatusInBatch(userId, notifications,
                                                                                             principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Notifications statuses changed successfully.",
                                                     response));
    }

    @Operation(summary = "Delete notification",
               description = "Delete a specific notification.",
               tags = {"notifications"})
    @DeleteMapping("/{userId}/{notificationId}")
    public ResponseEntity<RestResponseDTO> deleteNotification(@PathVariable String userId,
                                                              @PathVariable String notificationId,
                                                              Principal principal) {
        notificationService.deleteNotification(userId, notificationId, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Notification deleted successfully.",
                                                     null));
    }

    @Operation(summary = "Delete notifications in batch",
               description = "Delete multiple notifications.",
               tags = {"notifications"})
    @DeleteMapping("/{userId}/batch")
    public ResponseEntity<RestResponseDTO> deleteNotificationsInBatch(@PathVariable String userId,
                                                                      @RequestParam List<String> notifIds,
                                                                      Principal principal) {
        notificationService.deleteNotificationsInBatch(userId, notifIds, principal);
        return ResponseEntity.ok(new RestResponseDTO(HttpStatus.OK,
                                                     HttpStatus.OK.value(),
                                                     "Notifications deleted successfully.",
                                                     null));
    }
}
