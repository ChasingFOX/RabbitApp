package com.purdue.project.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends UserException{
    public UserNotFoundException() {super("회원 가입을 진행해주세요.", HttpStatus.BAD_REQUEST);}

}
