package com.mapo.palantier.user.domain;

import org.apache.ibatis.annotations.Param;

import java.util.Optional;

public interface UserRepository {
    void save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findById(@Param("id") Long id);
    boolean existsByEmail(String email);
}