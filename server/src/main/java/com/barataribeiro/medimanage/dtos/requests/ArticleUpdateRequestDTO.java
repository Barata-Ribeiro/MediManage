package com.barataribeiro.medimanage.dtos.requests;

import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record ArticleUpdateRequestDTO(@Size.List(value = {
        @Size(min = 5, message = "The title must have a minimum of 5 characters."),
        @Size(max = 100, message = "The title must have a maximum of 100 " +
                "characters.")
})
                                      String title,

                                      @Size.List(value = {
                                              @Size(min = 5, message = "The subtitle must have a minimum of 5 " +
                                                      "characters."),
                                              @Size(max = 100, message = "The subtitle must have a maximum of 100 " +
                                                      "characters.")
                                      })
                                      String subTitle,

                                      @Size(min = 100, message = "The content must have a minimum of 100 characters.")
                                      String content,

                                      @URL
                                      String mediaUrl) {}