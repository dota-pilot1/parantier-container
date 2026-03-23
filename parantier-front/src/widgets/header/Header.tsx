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

  const handleMenuClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    window.history.pushState({}, '', path)
    window.dispatchEvent(new Event('navigate'))
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-primary">Palantier</h1>
            <nav className="flex items-center gap-6">
              {headerMenus.map((menu) => (
                <a
                  key={menu.id}
                  href={menu.path || '#'}
                  onClick={(e) => menu.path && handleMenuClick(e, menu.path)}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {menu.name}
                </a>
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
