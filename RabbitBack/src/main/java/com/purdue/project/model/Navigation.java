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
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column
    private Integer type;
    @Column
    private Integer orig_id;
    @Column
    private Integer dest_id;


}