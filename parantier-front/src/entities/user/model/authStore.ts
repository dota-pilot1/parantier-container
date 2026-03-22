import { Store } from '@tanstack/react-store'
import type { AuthState, User } from '@/shared/types/auth'

// 초기 상태
const initialState: AuthState = {
  user: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: false,
}

// 인증 스토어 생성
export const authStore = new Store(initialState)

// 액션들
export const authActions = {
  login: (accessToken: string, refreshToken: string, user: User) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)

    authStore.setState((state) => ({
      ...state,
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    }))
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

    authStore.setState(() => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    }))
  },

  updateAccessToken: (accessToken: string) => {
    localStorage.setItem('accessToken', accessToken)

    authStore.setState((state) => ({
      ...state,
      accessToken,
    }))
  },

  setUser: (user: User) => {
    authStore.setState((state) => ({
      ...state,
      user,
      isAuthenticated: true,
    }))
  },
}
