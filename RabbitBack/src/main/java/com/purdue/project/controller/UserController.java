package com.purdue.project.controller;

import com.purdue.project.model.*;
import com.purdue.project.dao.UserDAO;
import com.purdue.project.exception.UserNotFoundException;
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
            return ResponseEntity.badRequest().body(new SignupResponse("이미 존재하는 이메일입니다."));
        }
        userDAO.save(userObj);
        return ResponseEntity.ok(new SignupResponse("회원 가입이 완료되었습니다."));
    }
    @PostMapping("/signIn")
    public ResponseEntity<SigninResponse> signIn(@RequestBody User userObj) {

        //  check if the user is valid
        if (!userDAO.findByEmail(userObj.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new SigninResponse("회원 가입을 진행해주세요."));
        }
        User user = userDAO.findByEmail(userObj.getEmail()).orElseThrow(UserNotFoundException::new);

        //  check if the password is valid
        if (!user.getPassword().equals(userObj.getPassword())) {
            return ResponseEntity.badRequest().body(new SigninResponse("비밀번호가 틀렸습니다."));
        }

        SigninResponse response = new SigninResponse("로그인에 성공하였습니다.", user.getId(), user.getEmail(), user.getNickname(), user.getCrime());
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
    public User update(@RequestBody User userObj) {
        Optional<User> user = userDAO.findById(userObj.getId());
        User updatedUser  = new User(user.get().getId(), user.get().getEmail(), user.get().getPassword(), userObj.getNickname(), userObj.getCrime(), user.get().getRegdate());
        return userDAO.save(updatedUser);
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
