package com.purdue.project.controller;

import com.purdue.project.model.Navigation;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class NavigationController {
    @ResponseBody
    @RequestMapping(value = "/navi", method = { RequestMethod.GET, RequestMethod.POST })
    public Navigation save(@RequestBody Navigation navigationObj) { return (navigationObj); }

}
