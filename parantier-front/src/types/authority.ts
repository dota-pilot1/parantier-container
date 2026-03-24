export interface Authority {
  id: number
  name: string
  description: string
  category: string
  createdAt: string
}

export interface CreateAuthorityRequest {
  name: string
  description: string
  category: string
}

export interface UpdateRoleMappingRequest {
  authorityIds: number[]
}

// ==================== 사용자별 권한 관리 ====================

export interface UserAuthorityResponse {
  userId: number
  authorityId: number
  authorityName: string
  authorityDescription: string
  authorityCategory: string
  grantedAt: string
  grantedBy: number | null
  expiresAt: string | null
  notes: string | null
  isExpired: boolean
}

export interface GrantUserAuthorityRequest {
  authorityId: number
  expiresAt?: string | null
  notes?: string | null
}
