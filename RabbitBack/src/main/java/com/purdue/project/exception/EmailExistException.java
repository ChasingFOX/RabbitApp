package com.purdue.project.exception;

import org.springframework.http.HttpStatus;

public class EmailExistException extends UserException{
    public EmailExistException() {super("이미 존재하는 이메일입니다.", HttpStatus.BAD_REQUEST);}

}
