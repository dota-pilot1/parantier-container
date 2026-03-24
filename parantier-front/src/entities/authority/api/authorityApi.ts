import { api } from '@/shared/api/client'
import type { Authority, CreateAuthorityRequest, UpdateRoleMappingRequest } from '@/types/authority'

export const authorityApi = {
  // 모든 권한 조회
  getAll: async (): Promise<Authority[]> => {
    const response = await api.get<Authority[]>('/authorities')
    return response.data
  },

  // 카테고리별 권한 조회
  getByCategory: async (category: string): Promise<Authority[]> => {
    const response = await api.get<Authority[]>(`/authorities/category/${category}`)
    return response.data
  },

  // 역할별 권한 조회
  getByRole: async (role: string): Promise<string[]> => {
    const response = await api.get<string[]>(`/authorities/role/${role}`)
    return response.data
  },

  // 권한 생성
  create: async (data: CreateAuthorityRequest): Promise<Authority> => {
    const response = await api.post<Authority>('/authorities', data)
    return response.data
  },

  // 권한 수정
  update: async (id: number, data: CreateAuthorityRequest): Promise<Authority> => {
    const response = await api.put<Authority>(`/authorities/${id}`, data)
    return response.data
  },

  // 권한 삭제
  delete: async (id: number): Promise<void> => {
    await api.delete(`/authorities/${id}`)
  },

  // 역할-권한 매핑 업데이트
  updateRoleMapping: async (role: string, data: UpdateRoleMappingRequest): Promise<void> => {
    await api.put(`/authorities/role/${role}/mapping`, data)
  },
}
