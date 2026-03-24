# Palantier 프로젝트 개발 가이드

## 데이터베이스 관리 원칙

### ⚠️ 중요: DB 변경 작업 원칙

**테이블 생성/업데이트는 Docker DB에 직접 실행이 원칙입니다**

- Flyway 마이그레이션 파일을 사용하지 않습니다
- 모든 스키마 변경, 데이터 추가는 Docker 컨테이너에 직접 SQL을 실행합니다
- Flyway 마이그레이션 파일은 히스토리 참고용으로만 유지됩니다
- 실제 운영에서는 Docker DB에 직접 SQL을 실행해야 합니다

### 데이터베이스 접속 정보

**Docker 컨테이너 정보:**
```bash
Container Name: palantier-postgres
Image: postgres:16
```

**접속 정보:**
```bash
Host: localhost
Port: 5432
Database: palantier
Username: palantier_user
Password: palantier_password
```

**Docker를 통한 접속:**
```bash
# psql 접속
docker exec -i palantier-postgres psql -U palantier_user -d palantier

# SQL 직접 실행
docker exec -i palantier-postgres psql -U palantier_user -d palantier -c "SELECT * FROM users;"
```

### compose.yaml 설정
```yaml
services:
  postgres:
    image: 'postgres:16'
    container_name: palantier-postgres
    environment:
      - 'POSTGRES_DB=palantier'
      - 'POSTGRES_USER=palantier_user'
      - 'POSTGRES_PASSWORD=palantier_password'
    ports:
      - '5432:5432'
```

## 프로젝트 구조

### Backend (parantier-api)
- Spring Boot 4.0.4
- MyBatis
- PostgreSQL
- JWT 인증

### Frontend (parantier-front)
- React + TypeScript
- TanStack Router
- TanStack Query
- Vite

## 권한 시스템

### Role vs Authority
- **Role**: 사용자의 신분 (USER, ADMIN)
- **Authority**: 세밀한 권한 (USER:READ, MENU:WRITE 등)

### Authority 명명 규칙
```
CATEGORY:RESOURCE:ACTION
예: USER:READ, MENU:ADMIN:WRITE, AUTHORITY:READ
```

## 주요 엔드포인트

### Backend
```
http://localhost:8080
```

### Frontend
```
http://localhost:5173
```

## 개발 환경 실행

### Backend
```bash
cd parantier-api
./gradlew bootRun
```

### Frontend
```bash
cd parantier-front
npm run dev
```

## Git Commit 규칙

- feat: 새로운 기능
- fix: 버그 수정
- refactor: 리팩토링
- docs: 문서 수정

모든 커밋에 다음을 포함:
```
🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```
