package com.purdue.project.dao;

import com.purdue.project.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteDAO extends JpaRepository<Route, Integer> {

}
