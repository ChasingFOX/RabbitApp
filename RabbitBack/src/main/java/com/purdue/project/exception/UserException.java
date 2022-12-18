package com.purdue.project.exception;

import org.springframework.http.HttpStatus;

public class UserException extends RabbitException{
    protected UserException(String message, HttpStatus httpStatus) {super(message, httpStatus);}
}
