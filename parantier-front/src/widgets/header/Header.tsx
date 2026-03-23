import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { authStore } from '@/entities/user/model/authStore'
import { LoginForm } from '@/features/auth/login/LoginForm'
import { LogoutButton } from '@/features/auth/logout/LogoutButton'
import { SignupDialog } from '@/features/auth/signup/SignupDialog'
import { useMenuTree } from '@/features/menu/hooks/useMenuTree'

export function Header() {
  const auth = useStore(authStore, (state) => state)
  const { data: menus = [] } = useMenuTree()

  // 헤더 메뉴만 필터링 (HEADER 타입)
  const headerMenus = menus.filter((menu) => menu.menuType === 'HEADER')

  return (
    <header className="border-b border-border bg-card">
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
              {headerMenus.map((menu) => (
                <Link
                  key={menu.id}
                  to={menu.path || '/'}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {menu.name}
                </Link>
              ))}
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
