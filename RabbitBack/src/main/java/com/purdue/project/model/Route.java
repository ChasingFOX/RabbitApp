package com.purdue.project.model;

import java.sql.Time;
import java.util.ArrayList;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Table;

@Getter
@Setter
@Table(name="route")
public class Route {
    private Time time;
    private String length;
    private Integer type;
    private ArrayList<Location> waypoint = new ArrayList<Location>();

    @Override
    public String toString() {
        return "Route{" +
                "time=" + time +
                ", length=" + length +
                ", type=" + type +
                ", waypoint=" + waypoint +
                '}';
    }
}
