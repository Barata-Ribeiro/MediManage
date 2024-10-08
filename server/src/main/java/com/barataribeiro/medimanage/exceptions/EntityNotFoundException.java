package com.barataribeiro.medimanage.exceptions;

import jakarta.annotation.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class EntityNotFoundException extends MediManageException {
    private final String entityName;
    private final String entityIdentifier;

    public EntityNotFoundException(String entityName, @Nullable String entityIdentifier) {
        this.entityName = entityName;
        this.entityIdentifier = entityIdentifier;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);

        problemDetail.setTitle("Resource not found");
        if (entityIdentifier != null)
            problemDetail.setDetail(String.format("The %s was not found or does not exist", entityName));

        problemDetail
                .setDetail(String.format("The %s with identifier %s was not found or does not exist", entityName,
                                         entityIdentifier));


        return problemDetail;
    }
}