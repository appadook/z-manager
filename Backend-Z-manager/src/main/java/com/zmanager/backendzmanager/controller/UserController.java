package com.zmanager.backendzmanager.controller;

import com.zmanager.backendzmanager.exception.UserNotFoundException;
import com.zmanager.backendzmanager.model.User;
import com.zmanager.backendzmanager.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsersRepository usersRepository;

    @PostMapping("/user")
    public User newUser(@RequestBody User newUser){
        return usersRepository.save(newUser);
    }

    @GetMapping("/users")
    public List<User> getAllUsers(){
        return usersRepository.findAll();
    }

    @GetMapping("user/{id}")
    public User getUserById(@PathVariable Long id){
        return usersRepository.findById(id).orElseThrow(() ->new UserNotFoundException(id));
    }

    @PutMapping("user/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User UpdatedUser){
        return usersRepository.findById(id).
                map(users -> {
                    users.setName(UpdatedUser.getName());
                    users.setEmail(UpdatedUser.getEmail());
                    users.setUsername(UpdatedUser.getUsername());
                    return usersRepository.save(users);
                }).orElseThrow(() ->new UserNotFoundException(id));
    }

    @DeleteMapping("user/{id}")
    public String deleteUser(@PathVariable Long id){
        if (!usersRepository.existsById(id)){
            throw new UserNotFoundException(id);
        }
        usersRepository.deleteById(id);
        return "User with id + " + id + " has been deleted";

    }

}
