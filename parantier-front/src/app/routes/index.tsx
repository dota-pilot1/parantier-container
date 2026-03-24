import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { Header } from '@/widgets/header/Header'
import { MainPage } from '@/pages/main/MainPage'
import { UsersPage } from '@/pages/admin/users/UsersPage'
import { MenusPage } from '@/pages/admin/menus/MenusPage'
import { WorkspacePage } from '@/pages/admin/workspace/WorkspacePage'
import { AuthoritiesPage } from '@/pages/admin/authorities/AuthoritiesPage'
import { OrganizationsPage } from '@/pages/admin/organizations/OrganizationsPage'
import { authStore } from '@/entities/user/model/authStore'
import { toast } from 'sonner'

// 권한 체크 헬퍼 (최소한의 프론트 체크)
const requireAuth = () => {
  const auth = authStore.state

  if (!auth.isAuthenticated) {
    toast.error('로그인이 필요합니다')
    throw redirect({ to: '/dashboard' })
  }
}

// Authority 기반 권한 체크 (비동기 처리 추가)
const requireAuthority = async (requiredAuthority: string) => {
  const auth = authStore.state

  if (!auth.isAuthenticated) {
    toast.error('로그인이 필요합니다')
    throw redirect({ to: '/dashboard' })
  }

  // 인증 상태가 복원될 때까지 기다림 (user 정보가 없으면)
  if (!auth.user) {
    // 짧은 대기 후 재확인 (최대 3초)
    for (let i = 0; i < 30; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const currentAuth = authStore.state
      if (currentAuth.user) {
        break
      }
    }
  }

  // 다시 확인
  const finalAuth = authStore.state

  // JWT에서 추출한 authorities 배열로 권한 체크
  const userAuthorities = finalAuth.user?.authorities || []

  if (userAuthorities.includes(requiredAuthority)) {
    return
  }

  // 권한이 없으면 접근 차단
  toast.error('접근 권한이 없습니다', {
    description: `${requiredAuthority} 권한이 필요합니다.`,
  })
  throw redirect({ to: '/dashboard' })
}

// Root Route (레이아웃)
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  ),
})

// Dashboard Route
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MainPage,
})

const dashboardAliasRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: MainPage,
})

// Admin: 유저 관리 (AdminLayout 없이 직접 연결)
const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  beforeLoad: () => requireAuthority('USER:READ'),
  component: UsersPage,
})

// 메뉴 관리 (별도 페이지)
const adminMenusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/menus',
  beforeLoad: () => requireAuthority('MENU:ADMIN:WRITE'),
  component: MenusPage,
})

// 업무 관리 (별도 페이지, 자체 사이드바)
const adminWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/workspace',
  beforeLoad: () => requireAuthority('WORKSPACE:READ'),
  component: WorkspacePage,
})

// 권한 관리
const adminAuthoritiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/authorities',
  beforeLoad: () => requireAuthority('AUTHORITY:READ'),
  component: AuthoritiesPage,
})

// 조직 관리
const adminOrganizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/organizations',
  beforeLoad: () => requireAuthority('ORGANIZATION:READ'),
  component: OrganizationsPage,
})

// Route Tree
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  dashboardAliasRoute,
  adminUsersRoute,
  adminMenusRoute,
  adminWorkspaceRoute,
  adminAuthoritiesRoute,
  adminOrganizationsRoute,
])

// Router 생성
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent', // 링크 hover 시 프리로드
})

// TypeScript 타입 선언
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
