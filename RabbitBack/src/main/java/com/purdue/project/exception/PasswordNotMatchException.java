package com.purdue.project.exception;

import org.springframework.http.HttpStatus;

public class PasswordNotMatchException extends UserException{
    public PasswordNotMatchException() {super("비밀번호가 틀렸습니다.", HttpStatus.BAD_REQUEST);}

}
