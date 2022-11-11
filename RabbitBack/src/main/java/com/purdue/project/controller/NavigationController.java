package com.purdue.project.controller;

import com.purdue.project.dao.NavigationDAO;
import com.purdue.project.model.Navigation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NavigationController {
    @Autowired
    NavigationDAO navigationDAO;

    /*
    @PostMapping("/navi")
    public Navigation save(@RequestBody Navigation navigationObj) {
        return navigationDAO.save(navigationObj);
    }
    */

    @GetMapping("/navi")
    public List<Navigation> get() {
        return navigationDAO.findAll();
    }

    @PutMapping("/navi")
    public Navigation update(@RequestBody Navigation navigationObj) {
        return navigationDAO.save(navigationObj);
    }

}
