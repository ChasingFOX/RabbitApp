package com.purdue.project.model;

import lombok.*;

import javax.persistence.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "navigation")
public class Navigation {
    @Column
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column
    private Integer type;
    @Column
    private Location orig;
    @Column
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