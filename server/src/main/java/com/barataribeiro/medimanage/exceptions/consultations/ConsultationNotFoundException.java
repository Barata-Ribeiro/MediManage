package com.barataribeiro.medimanage.exceptions.consultations;

import com.barataribeiro.medimanage.exceptions.MediManageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class ConsultationNotFoundException extends MediManageException {
    private final String detail;

    public ConsultationNotFoundException(String detail) {
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);

        problemDetail.setTitle("Prescription not found");
        problemDetail.setDetail(detail);

        return problemDetail;
    }
}
