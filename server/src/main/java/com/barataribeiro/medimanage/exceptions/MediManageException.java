package com.barataribeiro.medimanage.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class MediManageException extends RuntimeException {
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);

        problemDetail.setTitle("Internal Server Error");

        return problemDetail;
    }
}