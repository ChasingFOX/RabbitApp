package com.purdue.project.controller;

import com.purdue.project.dao.RouteDAO;
import com.purdue.project.model.Location;
import com.purdue.project.model.Route;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RouteController {
    @Autowired
    RouteDAO routeDAO;

    /*
    @PostMapping("/route")
    public Route save(@RequestBody Route routeObj) { return routeDAO.save(routeObj); }
    */

    @GetMapping("/route")
    public List<Route> get() {
        return routeDAO.findAll();
    }

    @PutMapping("/route")
    public Route update(@RequestBody Route routeObj) {
        return routeDAO.save(routeObj);
    }
}
