import { Header } from '@/widgets/header/Header'
import { MainPage } from '@/pages/main/MainPage'
import { UsersPage } from '@/pages/admin/users/UsersPage'
import { MenusPage } from '@/pages/admin/menus/MenusPage'
import { useStore } from '@tanstack/react-store'
import { authStore, authActions } from '@/entities/user/model/authStore'
import { useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
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

  // 대시보드로 리다이렉트하는 헬퍼 함수
  const redirectToDashboard = () => {
    toast.error('접근 권한이 없습니다', {
      description: '관리자 권한이 필요한 페이지입니다.',
    })
    window.history.pushState({}, '', '/dashboard')
    window.dispatchEvent(new Event('navigate'))
  }

  const renderPage = () => {
    // 루트 경로는 대시보드로 리다이렉트
    if (currentPath === '/') {
      window.history.replaceState({}, '', '/dashboard')
      window.dispatchEvent(new Event('navigate'))
      return <MainPage />
    }

    // 대시보드 페이지
    if (currentPath === '/dashboard') {
      return <MainPage />
    }

    // 관리자 - 사용자 관리
    if (currentPath === '/admin/users') {
      if (auth.user?.role === 'ROLE_ADMIN') {
        return <UsersPage />
      } else {
        redirectToDashboard()
        return <MainPage />
      }
    }

    // 관리자 - 메뉴 관리
    if (currentPath === '/admin/menus') {
      if (auth.user?.role === 'ROLE_ADMIN') {
        return <MenusPage />
      } else {
        redirectToDashboard()
        return <MainPage />
      }
    }

    // 기본값: 대시보드
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
        <main className="flex-1">{renderPage()}</main>
      </div>
    </QueryProvider>
  )
}

export default App
