package com.purdue.project.controller;

import com.purdue.project.model.Location;
import com.purdue.project.model.Route;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class RouteController {
    @ResponseBody
    @RequestMapping(value = "/navi/route", method = { RequestMethod.GET, RequestMethod.POST })
    public Route save(@RequestBody Route routeObj) { return routeObj; }
}
