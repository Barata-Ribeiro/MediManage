package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record NoticeRequestDTO(@Size(min = 5, max = 100, message = "Notice title must be between 5 and 100 characters.")
                               String title,

                               @Size(min = 5, message = "Notice description must have a minimum of 5 characters.")
                               String description,

                               @URL(message = "Media URL must be a valid URL.")
                               String mediaUrl,

                               @Pattern(regexp = "ANNOUNCEMENT|WARNING|ALERT|INFOS",
                                       message = "Notice type must be one of: ANNOUNCEMENT, WARNING, ALERT, INFOS.")
                               String type,

                               @Pattern(regexp = "ACTIVE|INACTIVE",
                                       message = "Notice status must be one of: ACTIVE, INACTIVE.")
                               String status) {}
