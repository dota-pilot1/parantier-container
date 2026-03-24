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
