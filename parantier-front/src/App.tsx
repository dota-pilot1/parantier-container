import { Header } from '@/widgets/header/Header'
import { Sidebar } from '@/widgets/sidebar/Sidebar'
import { MainPage } from '@/pages/main/MainPage'
import { UsersPage } from '@/pages/admin/users/UsersPage'
import { useStore } from '@tanstack/react-store'
import { authStore, authActions } from '@/entities/user/model/authStore'
import { useEffect, useState, useMemo } from 'react'
import { Toaster } from 'sonner'
import { QueryProvider } from '@/app/providers/QueryProvider'

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const auth = useStore(authStore, (state) => state)

  // 앱 로드 시 로그인 상태 복원
  useEffect(() => {
    authActions.restoreAuth()
  }, [])

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleNavigation)
    window.addEventListener('navigate', handleNavigation)

    return () => {
      window.removeEventListener('popstate', handleNavigation)
      window.removeEventListener('navigate', handleNavigation)
    }
  }, [])

  // 현재 경로에서 헤더 메뉴 path 추출
  const currentHeaderPath = useMemo(() => {
    if (currentPath.startsWith('/admin')) return '/admin'
    if (currentPath.startsWith('/dashboard')) return '/dashboard'
    return null
  }, [currentPath])

  const renderPage = () => {
    if (currentPath === '/admin/users') {
      if (auth.user?.role === 'ROLE_ADMIN') {
        return <UsersPage />
      } else {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-lg text-destructive">접근 권한이 없습니다.</p>
          </div>
        )
      }
    }

    return <MainPage />
  }

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={2000}
        />
        <Header />
        <div className="flex flex-1">
          {currentHeaderPath && <Sidebar headerMenuPath={currentHeaderPath} />}
          <main className="flex-1">{renderPage()}</main>
        </div>
      </div>
    </QueryProvider>
  )
}

export default App
