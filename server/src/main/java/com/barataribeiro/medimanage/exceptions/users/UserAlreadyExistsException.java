package com.barataribeiro.medimanage.exceptions.users;

import com.barataribeiro.medimanage.exceptions.MediManageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class UserAlreadyExistsException extends MediManageException {
    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.UNPROCESSABLE_ENTITY);

        problemDetail.setTitle("User already exists");
        problemDetail.setDetail("An user with the provided data already exists.");

        return problemDetail;
    }
}
