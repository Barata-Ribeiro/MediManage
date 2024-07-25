package com.barataribeiro.medimanage.exceptions;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(AccessDeniedException.class)
    protected ProblemDetail handleAccessDenied(@NotNull AccessDeniedException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problemDetail.setTitle("Forbidden");
        problemDetail.setDetail(String.format("%s. You do not have sufficient privileges to access this resource.",
                                              ex.getMessage()));
        return problemDetail;
    }

    @ExceptionHandler(MediManageException.class)
    protected ProblemDetail handleInternalServerError(@NotNull MediManageException ex) {
        return ex.toProblemDetail();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ProblemDetail handleMethodArgumentNotValid(@NotNull MethodArgumentNotValidException ex) {

        List<InvalidParam> fieldErrors = ex.getFieldErrors()
                .stream()
                .map(f -> new InvalidParam(f.getField(), f.getDefaultMessage()))
                .toList();

        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

        problemDetail.setTitle("Your request parameters didn't validate.");
        problemDetail.setProperty("invalid-params", fieldErrors);

        return problemDetail;
    }

    private record InvalidParam(String fieldName, String reason) {}
}
