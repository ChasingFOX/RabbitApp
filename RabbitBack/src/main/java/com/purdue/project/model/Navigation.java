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
    private Integer orig_id;
    @Column
    private Integer dest_id;
    @Column
    @Transient
    private Location orig;
    @Column
    @Transient
    private Location dest;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getOrig_id() {
        return orig_id;
    }

    public void setOrig_id(Integer orig_id) {
        this.orig_id = orig_id;
    }

    public Integer getDest_id() {
        return dest_id;
    }

    public void setDest_id(Integer dest_id) {
        this.dest_id = dest_id;
    }

    public Location getOrig() {
        return orig;
    }

    public void setOrig(Location orig) {
        this.orig = orig;
    }

    public Location getDest() {
        return dest;
    }

    public void setDest(Location dest) {
        this.dest = dest;
    }

    @Override
    public String toString() {
        return "Navigation{" +
                "id=" + id +
                ", type=" + type +
                ", orig_id=" + orig_id +
                ", dest_id=" + dest_id +
                ", orig=" + orig +
                ", dest=" + dest +
                '}';
    }
}