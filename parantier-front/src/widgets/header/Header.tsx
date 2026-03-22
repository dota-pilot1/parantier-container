import { useStore } from '@tanstack/react-store'
import { authStore } from '@/entities/user/model/authStore'
import { LoginForm } from '@/features/auth/login/LoginForm'
import { LogoutButton } from '@/features/auth/logout/LogoutButton'
import { SignupDialog } from '@/features/auth/signup/SignupDialog'

export function Header() {
  const auth = useStore(authStore, (state) => state)

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-primary">Palantier</h1>
            <nav className="flex items-center gap-6">
              <a href="/" className="text-sm font-medium hover:text-primary transition-colors">
                홈
              </a>
              {auth.isAuthenticated && (
                <>
                  <a href="/projects" className="text-sm font-medium hover:text-primary transition-colors">
                    프로젝트
                  </a>
                  <a href="/docs" className="text-sm font-medium hover:text-primary transition-colors">
                    문서
                  </a>
                  <a href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
                    쇼핑몰
                  </a>
                </>
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
