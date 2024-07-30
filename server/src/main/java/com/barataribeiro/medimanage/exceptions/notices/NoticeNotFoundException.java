package com.barataribeiro.medimanage.exceptions.notices;

import com.barataribeiro.medimanage.exceptions.MediManageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class NoticeNotFoundException extends MediManageException {
    private final String detail;

    public NoticeNotFoundException(String detail) {
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);

        problemDetail.setTitle("Notice not found");
        problemDetail.setDetail(detail);

        return problemDetail;
    }
}
