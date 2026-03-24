package com.mapo.palantier.authority.application;

import com.mapo.palantier.authority.domain.Authority;
import com.mapo.palantier.authority.domain.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthorityService {
    private final AuthorityRepository authorityRepository;

    /**
     * 역할로 권한 목록 조회
     * 예: ROLE_ADMIN → [MENU:ADMIN:READ, MENU:ADMIN:WRITE, PROJECT:CREATE, ...]
     */
    public List<String> getAuthoritiesByRole(String role) {
        return authorityRepository.findAuthorityNamesByRole(role);
    }

    /**
     * 모든 권한 조회
     */
    public List<Authority> getAllAuthorities() {
        return authorityRepository.findAll();
    }

    /**
     * 카테고리별 권한 조회
     */
    public List<Authority> getAuthoritiesByCategory(String category) {
        return authorityRepository.findByCategory(category);
    }

    /**
     * 권한 생성
     */
    @Transactional
    public Authority createAuthority(String name, String description, String category) {
        return authorityRepository.create(name, description, category);
    }

    /**
     * 권한 수정
     */
    @Transactional
    public Authority updateAuthority(Long id, String name, String description, String category) {
        return authorityRepository.update(id, name, description, category);
    }

    /**
     * 권한 삭제
     */
    @Transactional
    public void deleteAuthority(Long id) {
        authorityRepository.delete(id);
    }

    /**
     * 역할-권한 매핑 업데이트
     */
    @Transactional
    public void updateRoleAuthorities(String role, List<Long> authorityIds) {
        authorityRepository.updateRoleAuthorities(role, authorityIds);
    }
}
