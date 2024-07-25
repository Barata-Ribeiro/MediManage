package com.barataribeiro.medimanage.exceptions.records;

import com.barataribeiro.medimanage.exceptions.MediManageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class MedicalRecordNotFoundException extends MediManageException {

    private final String detail;

    public MedicalRecordNotFoundException(String detail) {
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);

        problemDetail.setTitle("Medical Record not found");
        problemDetail.setDetail(detail);

        return problemDetail;
    }
}
