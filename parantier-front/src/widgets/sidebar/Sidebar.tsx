import { useMenuTree } from '@/features/menu/hooks/useMenuTree'
import { useState, useEffect } from 'react'

interface SidebarProps {
  headerMenuPath: string  // 현재 선택된 헤더 메뉴의 path
}

export function Sidebar({ headerMenuPath }: SidebarProps) {
  const { data: menus = [] } = useMenuTree()
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener('popstate', handleNavigation)

    // Listen for custom navigation events
    window.addEventListener('navigate', handleNavigation)

    return () => {
      window.removeEventListener('popstate', handleNavigation)
      window.removeEventListener('navigate', handleNavigation)
    }
  }, [])

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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault()
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.dispatchEvent(new Event('navigate'))
  }

  return (
    <aside className="w-64 border-r border-border bg-card">
      <nav className="p-4 space-y-1">
        {sideMenus.map((menu) => {
          const isActive = currentPath === menu.path

          return (
            <a
              key={menu.id}
              href={menu.path || '#'}
              onClick={(e) => menu.path && handleClick(e, menu.path)}
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
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
