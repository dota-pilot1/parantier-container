import { apiClient } from '@/shared/api/axios'

export interface UserResponse {
  id: number
  email: string
  username: string
  role: string
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
}
