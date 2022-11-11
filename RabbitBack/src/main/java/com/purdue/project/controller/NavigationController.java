package com.purdue.project.controller;

import com.purdue.project.dao.NaviDAO;
import com.purdue.project.dao.LocationDAO;
import com.purdue.project.model.Navigation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class NavigationController {

    @Autowired
    NaviDAO naviDAO;
    @Autowired
    LocationDAO locationDAO;

    @ResponseBody
    @RequestMapping(value = "/navi/create", method = RequestMethod.POST)
    public Navigation create(@RequestBody Navigation navigationObj) {

        int orig_id = locationDAO.save(navigationObj.getOrig()).getId();
        int dest_id = locationDAO.save(navigationObj.getDest()).getId();

        Navigation navigation = navigationObj;

        navigation.setOrig_id(orig_id);
        navigation.setDest_id(dest_id);

        return naviDAO.save(navigation);
    }

    @GetMapping("/navi/read/")
    public List<Navigation> readAll() {
//        naviDAO.findall().filter
        return naviDAO.findAll();
    }
}
