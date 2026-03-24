import { apiClient } from '@/shared/api/axios'

export interface UserResponse {
  id: number
  email: string
  username: string
  role: string
  organizationId: number | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateRoleRequest {
  role: string
}

export const adminApi = {
  /**
   * 전체 사용자 목록 조회 (관리자 전용)
   */
  getAllUsers: async (): Promise<UserResponse[]> => {
    const response = await apiClient.get<UserResponse[]>('/admin/users')
    return response.data
  },

  /**
   * 사용자 권한 변경 (관리자 전용)
   */
  updateUserRole: async (userId: number, role: string): Promise<void> => {
    await apiClient.patch(`/admin/users/${userId}/role`, { role })
  },

  /**
   * 여러 사용자의 조직 일괄 변경 (관리자 전용)
   */
  updateUsersOrganization: async (userIds: number[], organizationId: number): Promise<void> => {
    // Spring Boot의 @RequestParam List<Long>는 userIds=1&userIds=2 형식을 기대
    const params = new URLSearchParams()
    userIds.forEach((id) => params.append('userIds', id.toString()))
    params.append('organizationId', organizationId.toString())

    await apiClient.patch(`/admin/users/organization?${params.toString()}`)
  },

  /**
   * 사용자를 조직에서 제거 (관리자 전용)
   */
  removeUserFromOrganization: async (userId: number): Promise<void> => {
    await apiClient.delete(`/admin/users/${userId}/organization`)
  },
}
