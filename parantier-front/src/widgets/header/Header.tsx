import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { authStore } from '@/entities/user/model/authStore'
import { sidebarActions } from '@/entities/menu/model/sidebarStore'
import { LoginForm } from '@/features/auth/login/LoginForm'
import { LogoutButton } from '@/features/auth/logout/LogoutButton'
import { SignupDialog } from '@/features/auth/signup/SignupDialog'
import { useMenuTree } from '@/features/menu/hooks/useMenuTree'
import type { Menu } from '@/types/menu'

export function Header() {
  const auth = useStore(authStore, (state) => state)
  const { data: menus = [] } = useMenuTree()

  // 헤더 메뉴만 필터링 (HEADER 또는 CATEGORY 타입, parent_id가 null인 1차 메뉴)
  const headerMenus = menus.filter(
    (menu) => menu.parentId === null && (menu.menuType === 'HEADER' || menu.menuType === 'CATEGORY')
  )

  const handleMenuClick = (menu: Menu) => {
    // CATEGORY 타입이거나 path가 없으면서, children이 있을 때만 사이드바 토글
    if ((menu.menuType === 'CATEGORY' || !menu.path) && menu.children && menu.children.length > 0) {
      // 메뉴 이름을 기반으로 사이드바 키 결정
      const sidebarKey = menu.name === '관리자' ? 'admin' : menu.name.toLowerCase()
      sidebarActions.toggle(sidebarKey)
    } else if (menu.path) {
      // HEADER 타입 메뉴(일반 페이지)로 이동할 때는 사이드바 닫기
      sidebarActions.close()
    }
  }

  return (
    <header className="relative border-b border-border bg-card">
      <div className="max-w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xl font-bold text-primary hover:opacity-80 transition-opacity cursor-pointer"
            >
              Palantier
            </Link>
            <nav className="flex items-center gap-6">
              {headerMenus.map((menu) =>
                menu.menuType === 'CATEGORY' || !menu.path ? (
                  <button
                    key={menu.id}
                    onClick={() => handleMenuClick(menu)}
                    className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                  >
                    {menu.name}
                  </button>
                ) : (
                  <Link
                    key={menu.id}
                    to={menu.path}
                    onClick={() => handleMenuClick(menu)}
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    {menu.name}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {auth.isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {auth.user?.username} ({auth.user?.role})
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <LoginForm />
                <SignupDialog />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
