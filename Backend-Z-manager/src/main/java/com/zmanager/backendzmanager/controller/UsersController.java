package com.zmanager.backendzmanager.controller;

import com.zmanager.backendzmanager.model.Users;
import com.zmanager.backendzmanager.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UsersController {

    @Autowired
    private UsersRepository usersRepository;

    @PostMapping("/user")
    Users newUser(@RequestBody Users newUser){
        return usersRepository.save(newUser);
    }

    @GetMapping("/users")
    List<Users> getAllUsers(){
        return usersRepository.findAll();
    }

    @GetMapping("user/{id}")
    Users getUserById(@PathVariable Long id){
        return usersRepository.findById(id).orElse(null);
    }

    @PutMapping("user/{id}")
    Users updateUser(@PathVariable Long id, @RequestBody Users UpdatedUser){
        return usersRepository.findById(id).
                map(users -> {
                    users.setName(UpdatedUser.getName());
                    users.setEmail(UpdatedUser.getEmail());
                    users.setUsername(UpdatedUser.getUsername());
                    return usersRepository.save(users);
                }).orElse(null);
    }

    @DeleteMapping("user/{id}")
    String deleteUser(@PathVariable Long id){
        if (!usersRepository.existsById(id)){
            return null;
        }
        usersRepository.deleteById(id);
        return "User with id + " + id + " has been deleted";

    }

}
