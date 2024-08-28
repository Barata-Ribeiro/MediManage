package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateNotificationDTO(@NotBlank String notificationId, @NotNull Boolean newStatus) {}
