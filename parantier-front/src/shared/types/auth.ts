export interface User {
  email: string
  username: string
  role: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  email: string
  username: string
  role: string
}

export interface SignupRequest {
  email: string
  password: string
  username: string
}
