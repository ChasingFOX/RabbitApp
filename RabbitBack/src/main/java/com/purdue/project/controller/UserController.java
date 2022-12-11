package com.purdue.project.controller;

import com.purdue.project.model.*;
import com.purdue.project.exception.UserNotFoundException;
import com.purdue.project.dao.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    UserDAO userDAO;

    @PostMapping("/signUp")
    public ResponseEntity<SignupResponse> signUp(@RequestBody User userObj) {
        //  check if the email is valid
        if (userDAO.findByEmail(userObj.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new SignupResponse("Email already exists."));
        }
        Integer userId =  userDAO.save(userObj).getId();
        return ResponseEntity.ok(new SignupResponse(userId, "Sign up succeed."));
    }
    @PostMapping("/signIn")
    public ResponseEntity<SigninResponse> signIn(@RequestBody User userObj) {

        //  check if the user is valid
        if (!userDAO.findByEmail(userObj.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new SigninResponse("Please sign up first."));
        }
        User user = userDAO.findByEmail(userObj.getEmail()).orElseThrow(UserNotFoundException::new);

        //  check if the password is valid
        if (!user.getPassword().equals(userObj.getPassword())) {
            return ResponseEntity.badRequest().body(new SigninResponse("Your password is wrong."));
        }

        SigninResponse response = new SigninResponse("Sign in succeed.", user.getId(), user.getEmail(), user.getNickname(), user.getCrime());
        return ResponseEntity.ok(response);
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

    @PostMapping("/user/update")
    public ResponseEntity<UpdateResponse> update(@RequestBody User userObj) {
        User user = userDAO.findById(userObj.getId()).orElseThrow(UserNotFoundException::new);
        UpdateResponse returnedUser = new UpdateResponse(user.getId(), userObj.getNickname(), userObj.getCrime(), Boolean.FALSE, "Crime is not processing");

        //check if the crime is updating
        if(user.getProcessing()) {
            return ResponseEntity.badRequest().body(new UpdateResponse("Please wait until processing your previous request."));
        }

        //check if the crime has been changed
        if(!userObj.getCrime().equals(user.getCrime())) {
            returnedUser.setIsCrimeUpdated(Boolean.TRUE);
        }

        User updatedUser  = new User(user.getId(), user.getEmail(), user.getPassword(), userObj.getNickname(), userObj.getCrime(), user.getProcessing(), user.getRegdate());
        userDAO.save(updatedUser);

        return ResponseEntity.ok(returnedUser);
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
