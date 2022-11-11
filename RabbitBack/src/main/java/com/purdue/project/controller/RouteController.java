package com.purdue.project.controller;

import com.purdue.project.dao.LocationDAO;
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

    @Autowired
    LocationDAO locationDAO;

    @RequestMapping(value = "/navi/route/create", method = RequestMethod.POST)
    public Route create(@RequestBody Route routeObj) {

        int waypoint_id_1 = locationDAO.save(routeObj.getWaypoint_1()).getId();
        int waypoint_id_2 = locationDAO.save(routeObj.getWaypoint_2()).getId();
        int waypoint_id_3 = locationDAO.save(routeObj.getWaypoint_3()).getId();
        int waypoint_id_4 = locationDAO.save(routeObj.getWaypoint_4()).getId();
        int waypoint_id_5 = locationDAO.save(routeObj.getWaypoint_5()).getId();
        int waypoint_id_6 = locationDAO.save(routeObj.getWaypoint_6()).getId();
        int waypoint_id_7 = locationDAO.save(routeObj.getWaypoint_7()).getId();
        int waypoint_id_8 = locationDAO.save(routeObj.getWaypoint_8()).getId();
        int waypoint_id_9 = locationDAO.save(routeObj.getWaypoint_9()).getId();

        Route route = routeObj;

        route.setWaypoint_id_1(waypoint_id_1);
        route.setWaypoint_id_2(waypoint_id_2);
        route.setWaypoint_id_3(waypoint_id_3);
        route.setWaypoint_id_4(waypoint_id_4);
        route.setWaypoint_id_5(waypoint_id_5);
        route.setWaypoint_id_6(waypoint_id_6);
        route.setWaypoint_id_7(waypoint_id_7);
        route.setWaypoint_id_8(waypoint_id_8);
        route.setWaypoint_id_9(waypoint_id_9);

        return routeDAO.save(route);
    }

    @GetMapping("/navi/route/read/{id}")
    public List<Route> readAll() {
//        routeDAO.findall().filter
        return routeDAO.findAll();
    }
}