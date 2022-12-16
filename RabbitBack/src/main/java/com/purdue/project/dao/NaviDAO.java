package com.purdue.project.dao;

import com.purdue.project.model.Navigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NaviDAO extends JpaRepository<Navigation, Integer> {

}
