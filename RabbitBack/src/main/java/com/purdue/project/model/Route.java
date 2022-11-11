package com.purdue.project.model;

import java.sql.Timestamp;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name="route")
public class Route {
    @Column
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    @Column
    private Timestamp time;
    @Column
    private String length;
    @Column
    private Integer type;
    @Column
    private Integer waypoint_id_1;
    @Column
    private Integer waypoint_id_2;
    @Column
    private Integer waypoint_id_3;
    @Column
    private Integer waypoint_id_4;
    @Column
    private Integer waypoint_id_5;
    @Column
    private Integer waypoint_id_6;
    @Column
    private Integer waypoint_id_7;
    @Column
    private Integer waypoint_id_8;
    @Column
    private Integer waypoint_id_9;

    @Transient
    private Location waypoint_1;
    @Transient
    private Location waypoint_2;
    @Transient
    private Location waypoint_3;
    @Transient
    private Location waypoint_4;
    @Transient
    private Location waypoint_5;
    @Transient
    private Location waypoint_6;
    @Transient
    private Location waypoint_7;
    @Transient
    private Location waypoint_8;
    @Transient
    private Location waypoint_9;

    @Override
    public String toString() {
        return "Route{" +
                "id=" + id +
                ", time=" + time +
                ", length='" + length + '\'' +
                ", type=" + type +
                ", waypoint_id_1=" + waypoint_id_1 +
                ", waypoint_id_2=" + waypoint_id_2 +
                ", waypoint_id_3=" + waypoint_id_3 +
                ", waypoint_id_4=" + waypoint_id_4 +
                ", waypoint_id_5=" + waypoint_id_5 +
                ", waypoint_id_6=" + waypoint_id_6 +
                ", waypoint_id_7=" + waypoint_id_7 +
                ", waypoint_id_8=" + waypoint_id_8 +
                ", waypoint_id_9=" + waypoint_id_9 +
                ", waypoint_1=" + waypoint_1 +
                ", waypoint_2=" + waypoint_2 +
                ", waypoint_3=" + waypoint_3 +
                ", waypoint_4=" + waypoint_4 +
                ", waypoint_5=" + waypoint_5 +
                ", waypoint_6=" + waypoint_6 +
                ", waypoint_7=" + waypoint_7 +
                ", waypoint_8=" + waypoint_8 +
                ", waypoint_9=" + waypoint_9 +
                '}';
    }
}
