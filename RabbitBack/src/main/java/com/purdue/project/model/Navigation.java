package com.purdue.project.model;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name="navigation")
public class Navigation {

    @Column
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private Integer type;
    private Integer orig_id;
    private Integer dest_id;
    @Transient
    private Location orig;
    @Transient
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