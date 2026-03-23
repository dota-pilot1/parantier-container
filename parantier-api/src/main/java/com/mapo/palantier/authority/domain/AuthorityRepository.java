package com.mapo.palantier.authority.domain;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AuthorityRepository {
    /**
     * 역할로 권한 목록 조회
     */
    List<String> findAuthorityNamesByRole(@Param("role") String role);

    /**
     * 모든 권한 조회
     */
    List<Authority> findAll();

    /**
     * 카테고리별 권한 조회
     */
    List<Authority> findByCategory(@Param("category") String category);
}
