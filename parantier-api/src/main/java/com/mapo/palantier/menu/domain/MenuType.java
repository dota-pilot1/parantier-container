package com.mapo.palantier.menu.domain;

public enum MenuType {
    HEADER,   // 헤더 메뉴 (직접 페이지로 이동)
    CATEGORY, // 카테고리 메뉴 (사이드바 토글, 페이지 없음)
    SIDE,     // 사이드바 메뉴
    SUB       // 서브 메뉴
}
