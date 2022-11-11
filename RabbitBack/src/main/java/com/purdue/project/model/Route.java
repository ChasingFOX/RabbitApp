package com.purdue.project.model;

import java.sql.Timestamp;
import java.util.ArrayList;
import lombok.*;

import javax.persistence.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "route")
public class Route {
    @Column
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column
    private Timestamp time; // "time": "1592926896113",
    @Column
    private String length;
    @Column
    private Integer type;
    @Column
    @ElementCollection
    private ArrayList<Location> waypoint = new ArrayList<Location>(); // [{}, {}]

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
