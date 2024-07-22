package com.barataribeiro.medimanage.exceptions.users;

import com.barataribeiro.medimanage.exceptions.MediManageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class UserNotFoundException extends MediManageException {

    private final String detail;

    public UserNotFoundException(String detail) {
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);

        problemDetail.setTitle("User not found");
        problemDetail.setDetail(detail);

        return problemDetail;
    }
}