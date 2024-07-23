package com.barataribeiro.medimanage.exceptions.users;

import com.barataribeiro.medimanage.exceptions.MediManageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class UserIsBannedException extends MediManageException {
    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);

        problemDetail.setTitle("User is banned");
        problemDetail.setDetail("This account has been banned.");

        return problemDetail;
    }
}
