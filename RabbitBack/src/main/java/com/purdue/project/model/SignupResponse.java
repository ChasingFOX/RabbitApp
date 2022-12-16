package com.purdue.project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupResponse {

    private Integer userId;
    private String message;

    public SignupResponse(String message) {
        this.message = message;
    }

}
