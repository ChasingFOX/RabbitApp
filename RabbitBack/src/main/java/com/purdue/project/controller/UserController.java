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
        userObj.setMaking(1);

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
        Optional<User> user = userDAO.findById(userObj.getId());
        UpdateResponse returnedUser = new UpdateResponse(user.get().getId(), userObj.getNickname(), userObj.getCrime(), Boolean.FALSE, user.get().getProcessing(),"Crime is not processing.");

        //check if the crime is updating
        if(user.get().getProcessing() == 1) {
            return ResponseEntity.badRequest().body(new UpdateResponse("Please wait until processing your previous request."));
        }

        //check if the crime has been changed
        if(!userObj.getCrime().equals(user.get().getCrime())) {
            returnedUser.setIsCrimeUpdated(Boolean.TRUE);
            User updatedUser  = new User(user.get().getId(), user.get().getEmail(), user.get().getPassword(), userObj.getNickname(), userObj.getCrime(), user.get().getMaking(), 1, user.get().getRegdate());
            userDAO.save(updatedUser);
        } else {
            User updatedUser  = new User(user.get().getId(), user.get().getEmail(), user.get().getPassword(), userObj.getNickname(), userObj.getCrime(), user.get().getMaking(), user.get().getProcessing(), user.get().getRegdate());
            userDAO.save(updatedUser);
        }

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
