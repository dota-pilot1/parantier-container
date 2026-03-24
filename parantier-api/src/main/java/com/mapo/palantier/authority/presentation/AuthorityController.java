package com.mapo.palantier.authority.presentation;

import com.mapo.palantier.authority.application.AuthorityService;
import com.mapo.palantier.authority.domain.Authority;
import com.mapo.palantier.authority.presentation.dto.CreateAuthorityRequest;
import com.mapo.palantier.authority.presentation.dto.UpdateRoleMappingRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/authorities")
@RequiredArgsConstructor
public class AuthorityController {

    private final AuthorityService authorityService;

    /**
     * 모든 권한 조회
     */
    @GetMapping
    public ResponseEntity<List<Authority>> getAllAuthorities() {
        List<Authority> authorities = authorityService.getAllAuthorities();
        return ResponseEntity.ok(authorities);
    }

    /**
     * 카테고리별 권한 조회
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Authority>> getAuthoritiesByCategory(@PathVariable String category) {
        List<Authority> authorities = authorityService.getAuthoritiesByCategory(category);
        return ResponseEntity.ok(authorities);
    }

    /**
     * 역할별 권한 조회
     */
    @GetMapping("/role/{role}")
    public ResponseEntity<List<String>> getAuthoritiesByRole(@PathVariable String role) {
        List<String> authorities = authorityService.getAuthoritiesByRole(role);
        return ResponseEntity.ok(authorities);
    }

    /**
     * 권한 생성
     */
    @PostMapping
    public ResponseEntity<Authority> createAuthority(@RequestBody CreateAuthorityRequest request) {
        Authority authority = authorityService.createAuthority(
            request.getName(),
            request.getDescription(),
            request.getCategory()
        );
        return ResponseEntity.ok(authority);
    }

    /**
     * 권한 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<Authority> updateAuthority(
        @PathVariable Long id,
        @RequestBody CreateAuthorityRequest request
    ) {
        Authority authority = authorityService.updateAuthority(
            id,
            request.getName(),
            request.getDescription(),
            request.getCategory()
        );
        return ResponseEntity.ok(authority);
    }

    /**
     * 권한 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuthority(@PathVariable Long id) {
        authorityService.deleteAuthority(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * 역할-권한 매핑 업데이트
     */
    @PutMapping("/role/{role}/mapping")
    public ResponseEntity<Void> updateRoleAuthorities(
        @PathVariable String role,
        @RequestBody UpdateRoleMappingRequest request
    ) {
        authorityService.updateRoleAuthorities(role, request.getAuthorityIds());
        return ResponseEntity.ok().build();
    }
}
