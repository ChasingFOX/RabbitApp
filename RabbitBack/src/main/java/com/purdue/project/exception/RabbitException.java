package com.purdue.project.exception;

import org.springframework.http.HttpStatus;

public class RabbitException extends RuntimeException {
    private final HttpStatus httpStatus;

    public RabbitException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {return httpStatus;}
}