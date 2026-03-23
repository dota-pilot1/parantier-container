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
        log.info("🔍 getAuthoritiesByRole called with role: {}", role);
        List<String> authorities = authorityRepository.findAuthorityNamesByRole(role);
        log.info("✅ getAuthoritiesByRole result: {}", authorities);
        return authorities;
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
}
