package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Pattern;

public record ConsultationUpdateDTO(@Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}$",
        message = "Date must be in the format yyyy-MM-ddTHH:mm.")
                                    String scheduledTo,

                                    @Pattern(regexp = "^(SCHEDULED|ACCEPTED|IN_PROGRESS|DONE|MISSED|CANCELLED)$",
                                            message = "Invalid status.")
                                    String status) {
}
