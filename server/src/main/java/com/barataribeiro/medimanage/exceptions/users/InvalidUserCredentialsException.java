package com.barataribeiro.medimanage.exceptions.users;

import com.barataribeiro.medimanage.exceptions.MediManageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class InvalidUserCredentialsException extends MediManageException {

    private final String detail;

    public InvalidUserCredentialsException(String detail) {
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);

        problemDetail.setTitle("Invalid Credentials");
        problemDetail.setDetail(detail);

        return problemDetail;
    }
}
