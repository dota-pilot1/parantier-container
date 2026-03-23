package com.mapo.palantier.menu.domain;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class Menu {
    private Long id;
    private String name;
    private String path;
    private Long parentId;
    private MenuType menuType;
    private Integer orderNum;
    private String requiredRole;
    private String icon;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 트리 구조용 (조회 시에만 사용)
    private List<Menu> children;
}
