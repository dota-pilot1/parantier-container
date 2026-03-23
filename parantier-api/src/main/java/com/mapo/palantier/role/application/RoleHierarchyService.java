package com.mapo.palantier.role.application;

import com.mapo.palantier.role.domain.RoleHierarchyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoleHierarchyService {
    private final RoleHierarchyRepository roleHierarchyRepository;

    /**
     * 주어진 권한으로 접근 가능한 모든 권한을 조회
     * 예: ROLE_ADMIN → [ROLE_ADMIN, ROLE_USER]
     */
    public List<String> getAccessibleRoles(String role) {
        log.info("🔍 getAccessibleRoles called with role: {}", role);
        List<String> roles = roleHierarchyRepository.findAccessibleRoles(role);
        log.info("✅ getAccessibleRoles result: {}", roles);
        return roles;
    }
}
