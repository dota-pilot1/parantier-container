-- 권한 계층 테이블
CREATE TABLE role_hierarchy (
    parent_role VARCHAR(50) NOT NULL,
    child_role VARCHAR(50) NOT NULL,
    PRIMARY KEY (parent_role, child_role)
);

-- ADMIN은 USER 권한을 포함
INSERT INTO role_hierarchy (parent_role, child_role) VALUES ('ADMIN', 'USER');

-- 나중에 확장 가능: SUPER_ADMIN > ADMIN > MANAGER > USER
-- INSERT INTO role_hierarchy (parent_role, child_role) VALUES ('SUPER_ADMIN', 'ADMIN');
-- INSERT INTO role_hierarchy (parent_role, child_role) VALUES ('ADMIN', 'MANAGER');
-- INSERT INTO role_hierarchy (parent_role, child_role) VALUES ('MANAGER', 'USER');

COMMENT ON TABLE role_hierarchy IS '권한 계층 구조 (parent_role이 child_role의 권한을 포함)';
