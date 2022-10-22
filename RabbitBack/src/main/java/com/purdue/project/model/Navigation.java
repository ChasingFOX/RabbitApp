package com.purdue.project.model;

import lombok.Getter;
import lombok.Setter;
@Getter
@Setter
public class Navigation {

    private Integer type;
    private Location orig;
    private Location dest;

    @Override
    public String toString() {
        return "Navigation{" +
                "type=" + type +
                ", orig=" + orig +
                ", dest=" + dest +
                '}';
    }
}