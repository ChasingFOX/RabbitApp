package com.purdue.project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateResponse {

    private Integer id;
    private String nickname;
    private String crime;
    private Boolean isCrimeUpdated;
    private int processing;
    private String message;

    public UpdateResponse(String message) {
        this.message = message;
    }

}
