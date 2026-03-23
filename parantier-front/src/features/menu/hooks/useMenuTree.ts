import { useQuery } from '@tanstack/react-query'
import { menuApi } from '@/entities/menu/api/menuApi'

export function useMenuTree() {
  return useQuery({
    queryKey: ['menus', 'tree'],
    queryFn: menuApi.getMenuTree,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
  })
}
