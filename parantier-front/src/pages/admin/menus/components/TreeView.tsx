import type { Menu } from '@/types/menu'
import { TreeNode } from './TreeNode'

interface TreeViewProps {
  menus: Menu[]
  expandedIds: Set<number>
  selectedId: number | null
  onSelect: (menu: Menu) => void
  onToggle: (id: number) => void
  onContextMenu: (x: number, y: number, menu: Menu) => void
}

export function TreeView({
  menus,
  expandedIds,
  selectedId,
  onSelect,
  onToggle,
  onContextMenu,
}: TreeViewProps) {
  // 모든 메뉴를 평탄화 (재귀적으로 children 포함)
  const flattenMenus = (menuList: Menu[]): Menu[] => {
    const result: Menu[] = []
    menuList.forEach((menu) => {
      result.push(menu)
      if (menu.children && menu.children.length > 0) {
        result.push(...flattenMenus(menu.children))
      }
    })
    return result
  }

  const allMenus = flattenMenus(menus)

  // 최상위 메뉴만 필터링 (parentId가 null인 메뉴)
  const rootMenus = menus.filter((m) => m.parentId === null)

  return (
    <div className="space-y-0.5">
      {rootMenus.map((menu) => (
        <TreeNode
          key={menu.id}
          menu={menu}
          depth={0}
          allMenus={allMenus}
          expandedIds={expandedIds}
          selectedId={selectedId}
          onSelect={onSelect}
          onToggle={onToggle}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  )
}
