package com.mapo.palantier.user.application;

import com.mapo.palantier.user.domain.User;
import com.mapo.palantier.user.domain.UserRepository;
import com.mapo.palantier.user.domain.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;

    /**
     * 전체 사용자 목록 조회 (관리자 전용)
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * 사용자 권한 변경 (관리자 전용)
     */
    @Transactional
    public void updateUserRole(Long userId, UserRole role) {
        // 사용자 존재 여부 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 권한 업데이트
        userRepository.updateRole(userId, role);
    }
}
