import { api } from '@/shared/api/client'
import type { Menu, CreateMenuRequest } from '@/types/menu'

export const menuApi = {
  // 메뉴 트리 조회 (현재 사용자 권한에 맞는 메뉴)
  getMenuTree: (): Promise<Menu[]> => {
    return api.get('/api/menus/tree').then((res) => res.data)
  },

  // 자식 메뉴 조회
  getChildMenus: (parentId: number): Promise<Menu[]> => {
    return api.get(`/api/menus/${parentId}/children`).then((res) => res.data)
  },

  // 메뉴 생성 (ADMIN)
  createMenu: (data: CreateMenuRequest): Promise<Menu> => {
    return api.post('/api/menus', data).then((res) => res.data)
  },

  // 메뉴 수정 (ADMIN)
  updateMenu: (id: number, data: CreateMenuRequest): Promise<Menu> => {
    return api.put(`/api/menus/${id}`, data).then((res) => res.data)
  },

  // 메뉴 삭제 (ADMIN)
  deleteMenu: (id: number): Promise<void> => {
    return api.delete(`/api/menus/${id}`).then((res) => res.data)
  },
}
