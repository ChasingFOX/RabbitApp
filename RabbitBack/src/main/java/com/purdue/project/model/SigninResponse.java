package com.purdue.project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SigninResponse {

    private String message;
    private Integer id;
    private String email;
    private String nickname;
    private String crime;

    public SigninResponse(String message) {
        this.message = message;
    }
}
