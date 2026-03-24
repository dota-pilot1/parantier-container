# Claude Code 설정

## 자동 커밋 & 푸시

변경사항을 완료한 후에는 자동으로 git commit과 push를 수행합니다.

### 커밋 규칙
- feat: 새로운 기능 추가
- fix: 버그 수정
- refactor: 코드 리팩토링
- style: UI/스타일 변경
- docs: 문서 수정
- chore: 빌드/설정 변경

### 커밋 메시지 형식
```
<type>: <subject>

- <상세 내용 1>
- <상세 내용 2>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### 자동화 동작
1. 변경사항 완료 시 자동으로 `git add` 수행
2. 적절한 커밋 메시지 작성 후 `git commit` 수행
3. 자동으로 `git push` 수행
4. 사용자 확인 없이 진행

## 프로젝트 구조

### Backend (Spring Boot)
- `parantier-api/`: API 서버
  - Java 17
  - Spring Boot 3.4.3
  - MyBatis
  - MySQL

### Frontend (React)
- `parantier-front/`: 프론트엔드 앱
  - React 19
  - TypeScript
  - Vite
  - TanStack Query
  - TanStack Router
  - Tailwind CSS
  - shadcn/ui
