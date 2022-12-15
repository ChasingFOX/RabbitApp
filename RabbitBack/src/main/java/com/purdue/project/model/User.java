package com.purdue.project.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "user")
public class User {
    @Column
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;
    @Column
    private String email;
    @Column
    private String password;
    @Column
    private String nickname;
    @Column
    private String crime;
    @Column
    private int making;
    @Column
    private int processing;
    @Column
    private Date regdate;

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", nickname='" + nickname + '\'' +
                ", crime='" + crime + '\'' +
                ", processing=" + processing +
                ", regdate=" + regdate +
                '}';
    }
}
