package com.purdue.project.dao;

import com.purdue.project.model.Navigation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NavigationDAO extends JpaRepository<Navigation, Integer> {

}

