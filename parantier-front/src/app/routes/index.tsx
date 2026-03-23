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
import { authStore } from '@/entities/user/model/authStore'
import { toast } from 'sonner'

// 권한 체크 헬퍼
const requireAuth = (requiredRole?: string) => {
  const auth = authStore.state

  if (!auth.isAuthenticated) {
    toast.error('로그인이 필요합니다')
    throw redirect({ to: '/dashboard' })
  }

  if (requiredRole && auth.user?.role !== requiredRole) {
    toast.error('접근 권한이 없습니다', {
      description: '관리자 권한이 필요한 페이지입니다.',
    })
    throw redirect({ to: '/dashboard' })
  }
}

// Root Route (레이아웃)
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
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

// Admin Routes (관리자 권한 필요)
const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  beforeLoad: () => requireAuth('ROLE_ADMIN'),
  component: UsersPage,
})

const adminMenusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/menus',
  beforeLoad: () => requireAuth('ROLE_ADMIN'),
  component: MenusPage,
})

// Route Tree
const routeTree = rootRoute.addChildren([
  dashboardRoute,
  dashboardAliasRoute,
  adminUsersRoute,
  adminMenusRoute,
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
