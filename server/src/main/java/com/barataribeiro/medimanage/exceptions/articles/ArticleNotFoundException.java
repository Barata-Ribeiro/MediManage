package com.barataribeiro.medimanage.exceptions.articles;

import com.barataribeiro.medimanage.exceptions.MediManageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;

public class ArticleNotFoundException extends MediManageException {
    private final String detail;

    public ArticleNotFoundException(String detail) {
        this.detail = detail;
    }

    @Override
    public ProblemDetail toProblemDetail() {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);

        problemDetail.setTitle("Article not found");
        problemDetail.setDetail(detail);

        return problemDetail;
    }
}
