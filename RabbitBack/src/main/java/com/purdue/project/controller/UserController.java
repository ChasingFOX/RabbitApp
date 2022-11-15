package com.purdue.project.controller;

import com.purdue.project.dao.UserDAO;
import com.purdue.project.exception.EmailExistException;
import com.purdue.project.exception.PasswordNotMatchException;
import com.purdue.project.exception.UserNotFoundException;
import com.purdue.project.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    UserDAO userDAO;

    @PostMapping("/signUp")
    public User signUp(@RequestBody User userObj) {
        System.out.println(userDAO.findByEmail(userObj.getEmail()).isPresent());
        if (userDAO.findByEmail(userObj.getEmail()).isPresent()) throw new EmailExistException();

        return userDAO.save(userObj);
    }
    @PostMapping("/signIn")
    public User signIn(@RequestBody User userObj) {
        //  check if the user is valid
        User user = userDAO.findByEmail(userObj.getEmail()).orElseThrow(UserNotFoundException::new);

        //  check if the password is valid
        if (!user.getPassword().equals(userObj.getPassword())) throw new PasswordNotMatchException();

        User responseUser = user;
        responseUser.setPassword(null);
        return responseUser;
    }
    @GetMapping("/user")
    public List<User> get() {
        return userDAO.findAll();
    }

    @GetMapping("/user/{id}")
    public User get(@PathVariable int id) {
        Optional<User> user = userDAO.findById(id);
        if (user.isPresent()) {
            return user.get();
        } else {
            throw new RuntimeException("User not found for " + id);
        }
    }

    @PutMapping("/user")
    public User update(@RequestBody User userObj) {
        return userDAO.save(userObj);
    }

    @DeleteMapping("/user/{id}")
    public String delete(@PathVariable int id) {
        Optional<User> user = userDAO.findById(id);
        if (user.isPresent()) {
            userDAO.delete(user.get());
            return "User is deleted with id " + id;
        } else {
            throw new RuntimeException("User not found for the id " + id);
        }
    }
}
