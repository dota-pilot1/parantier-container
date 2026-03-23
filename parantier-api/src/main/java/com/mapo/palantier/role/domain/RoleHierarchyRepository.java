package com.mapo.palantier.role.domain;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface RoleHierarchyRepository {
    List<String> findAccessibleRoles(@Param("role") String role);
}
