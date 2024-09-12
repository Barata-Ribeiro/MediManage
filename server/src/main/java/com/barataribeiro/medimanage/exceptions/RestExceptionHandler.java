package com.barataribeiro.medimanage.exceptions;

import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.async.AsyncRequestNotUsableException;

import java.util.List;

@Slf4j
@RestControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(AsyncRequestNotUsableException.class)
    protected ProblemDetail handleAsyncRequestNotUsable(@NotNull AsyncRequestNotUsableException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        problemDetail.setTitle("Internal server error");
        problemDetail.setDetail(
                "The server encountered an unexpected condition which prevented it from fulfilling the request.");
        log.atError().log("Async request not usable: {}", ex.getMessage());
        return problemDetail;
    }

    @ExceptionHandler(AccessDeniedException.class)
    protected ProblemDetail handleAccessDenied(@NotNull AccessDeniedException ex) {
        ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.FORBIDDEN);
        problemDetail.setTitle("Forbidden");
        problemDetail.setDetail(String.format("%s. You do not have sufficient privileges to access this resource.",
                                              ex.getMessage()));
        log.atError().log("Access denied: {}", ex.getMessage());
        return problemDetail;
    }

    @ExceptionHandler(MediManageException.class)
    protected ProblemDetail handleInternalServerError(@NotNull MediManageException ex) {
        log.atError().log("Internal server error: {}", ex.getMessage());
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

        log.atError().log("Invalid request parameters: {}, {}", fieldErrors, ex.getMessage());

        return problemDetail;
    }

    private record InvalidParam(String fieldName, String reason) {}
}
