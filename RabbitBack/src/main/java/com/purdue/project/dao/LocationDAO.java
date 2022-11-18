package com.purdue.project.dao;

import com.purdue.project.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationDAO extends JpaRepository<Location, Integer> {

}
