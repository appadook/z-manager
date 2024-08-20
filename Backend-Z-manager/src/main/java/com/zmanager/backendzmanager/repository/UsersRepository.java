package com.zmanager.backendzmanager.repository;

import com.zmanager.backendzmanager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<User, Long> {
}
