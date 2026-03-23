import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from '@tanstack/react-router'
import { Header } from '@/widgets/header/Header'
import { Sidebar } from '@/widgets/sidebar/Sidebar'
import { MainPage } from '@/pages/main/MainPage'
import { UsersPage } from '@/pages/admin/users/UsersPage'
import { MenusPage } from '@/pages/admin/menus/MenusPage'
import { WorkspacePage } from '@/pages/admin/workspace/WorkspacePage'
import { authStore } from '@/entities/user/model/authStore'
import { toast } from 'sonner'

// 권한 체크 헬퍼 (최소한의 프론트 체크)
const requireAuth = (requiredRole?: string) => {
  const auth = authStore.state

  console.log('requireAuth - auth:', auth)
  console.log('requireAuth - requiredRole:', requiredRole)

  if (!auth.isAuthenticated) {
    toast.error('로그인이 필요합니다')
    throw redirect({ to: '/dashboard' })
  }

  // requiredRole이 없으면 인증만 체크
  if (!requiredRole) {
    return
  }

  // JWT에서 추출한 roles 배열로 권한 체크
  const userRoles = auth.user?.roles || []
  console.log('requireAuth - user.role:', auth.user?.role)
  console.log('requireAuth - user.roles:', userRoles)

  // roles 배열에 requiredRole이 포함되어 있으면 접근 허용
  if (userRoles.includes(requiredRole)) {
    console.log('requireAuth - 접근 허용')
    return
  }

  // 권한이 없으면 접근 차단
  console.log('requireAuth - 접근 차단')
  toast.error('접근 권한이 없습니다', {
    description: `${requiredRole} 권한이 필요합니다.`,
  })
  throw redirect({ to: '/dashboard' })
}

// Root Route (레이아웃)
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
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
  beforeLoad: () => requireAuth('ROLE_ADMIN'),
  component: UsersPage,
})

// 메뉴 관리 (별도 페이지)
const adminMenusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/menus',
  beforeLoad: () => requireAuth('ROLE_ADMIN'),
  component: MenusPage,
})

// 업무 관리 (별도 페이지, 자체 사이드바)
const adminWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/workspace',
  beforeLoad: () => requireAuth('ROLE_USER'),
  component: WorkspacePage,
})

// Route Tree
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  dashboardAliasRoute,
  adminUsersRoute,
  adminMenusRoute,
  adminWorkspaceRoute,
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
