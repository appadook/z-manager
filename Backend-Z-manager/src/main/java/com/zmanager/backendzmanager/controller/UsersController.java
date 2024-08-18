package com.zmanager.backendzmanager.controller;

import com.zmanager.backendzmanager.model.Users;
import com.zmanager.backendzmanager.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UsersController {

    @Autowired
    private UsersRepository usersRepository;

    @PostMapping("/user")
    Users newUser(@RequestBody Users newUser){
        return usersRepository.save(newUser);
    }

}
