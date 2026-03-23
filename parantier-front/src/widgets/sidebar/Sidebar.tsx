import { Link, useLocation } from 'react-router-dom'
import { useMenuTree } from '@/features/menu/hooks/useMenuTree'
import type { Menu } from '@/types/menu'

interface SidebarProps {
  headerMenuPath: string  // 현재 선택된 헤더 메뉴의 path
}

export function Sidebar({ headerMenuPath }: SidebarProps) {
  const { data: menus = [] } = useMenuTree()
  const location = useLocation()

  // 현재 헤더 메뉴 찾기
  const currentHeaderMenu = menus.find(
    (menu) => menu.menuType === 'HEADER' && menu.path === headerMenuPath
  )

  if (!currentHeaderMenu) {
    return null
  }

  // 해당 헤더의 자식 메뉴들 (SIDE 타입)
  const sideMenus = menus.filter(
    (menu) => menu.menuType === 'SIDE' && menu.parentId === currentHeaderMenu.id
  )

  if (sideMenus.length === 0) {
    return null
  }

  return (
    <aside className="w-64 border-r border-border bg-card">
      <nav className="p-4 space-y-1">
        {sideMenus.map((menu) => {
          const isActive = location.pathname === menu.path

          return (
            <Link
              key={menu.id}
              to={menu.path || '#'}
              className={`
                block px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }
              `}
            >
              {menu.icon && <span className="mr-2">{menu.icon}</span>}
              {menu.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
