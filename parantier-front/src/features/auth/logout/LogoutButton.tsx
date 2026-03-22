import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { authActions } from '@/entities/user/model/authStore'
import { authApi } from '@/entities/user/api/authApi'

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await authApi.logout()
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      authActions.logout()
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={isLoading} variant="outline">
      {isLoading ? '로그아웃 중...' : '로그아웃'}
    </Button>
  )
}
