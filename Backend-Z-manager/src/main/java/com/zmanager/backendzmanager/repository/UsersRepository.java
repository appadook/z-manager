package com.zmanager.backendzmanager.repository;

import com.zmanager.backendzmanager.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
}
