import { useState } from 'react'
import { useMenuTree } from '@/features/menu/hooks/useMenuTree'
import { Button } from '@/shared/ui/button'
import type { Menu } from '@/types/menu'
import { TreeView } from './components/TreeView'
import { MenuEditForm } from './components/MenuEditForm'

export function MenusPage() {
  const { data: menus = [], isLoading } = useMenuTree()
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // 확장/축소 토글
  const handleToggle = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // 메뉴 선택
  const handleSelect = (menu: Menu) => {
    setSelectedMenu(menu)
    setIsCreating(false)
  }

  // 새 메뉴 추가 모드
  const handleCreateNew = () => {
    setSelectedMenu(null)
    setIsCreating(true)
  }

  // 저장 처리 (TODO: API 연동)
  const handleSave = (menuData: Partial<Menu>) => {
    console.log('Save menu:', menuData)
    // TODO: API 호출
  }

  // 삭제 처리 (TODO: API 연동)
  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      console.log('Delete menu:', id)
      // TODO: API 호출
    }
  }

  // 취소
  const handleCancel = () => {
    setSelectedMenu(null)
    setIsCreating(false)
  }

  // 전체 펼치기
  const handleExpandAll = () => {
    const flattenMenus = (menuList: Menu[]): number[] => {
      const ids: number[] = []
      menuList.forEach((menu) => {
        ids.push(menu.id)
        if (menu.children && menu.children.length > 0) {
          ids.push(...flattenMenus(menu.children))
        }
      })
      return ids
    }
    setExpandedIds(new Set(flattenMenus(menus)))
  }

  // 전체 접기
  const handleCollapseAll = () => {
    setExpandedIds(new Set())
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">메뉴 관리</h1>
        <p className="text-muted-foreground mt-2">
          시스템 메뉴를 계층적으로 관리합니다.
        </p>
      </div>

      {isLoading ? (
        <div className="flex h-[500px] items-center justify-center rounded-lg border bg-card">
          <div className="text-center text-muted-foreground">
            메뉴를 불러오는 중...
          </div>
        </div>
      ) : menus.length === 0 ? (
        <div className="flex h-[500px] flex-col items-center justify-center rounded-lg border bg-card">
          <div className="text-center text-muted-foreground mb-4">
            등록된 메뉴가 없습니다.
          </div>
          <Button onClick={handleCreateNew}>+ 첫 메뉴 추가</Button>
        </div>
      ) : (
        <div className="grid grid-cols-[400px_1fr] gap-6">
          {/* 왼쪽: 트리 뷰 */}
          <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">메뉴 구조</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleExpandAll}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    전체 펼치기
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={handleCollapseAll}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    전체 접기
                  </button>
                </div>
              </div>
              <Button onClick={handleCreateNew} className="w-full" size="sm">
                + 새 메뉴 추가
              </Button>
            </div>
            <div className="overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 350px)' }}>
              <TreeView
                menus={menus}
                expandedIds={expandedIds}
                selectedId={selectedMenu?.id || null}
                onSelect={handleSelect}
                onToggle={handleToggle}
              />
            </div>
          </div>

          {/* 오른쪽: 상세 편집 */}
          <div className="rounded-lg border bg-card p-6">
            {selectedMenu || isCreating ? (
              <MenuEditForm
                menu={selectedMenu}
                onSave={handleSave}
                onDelete={handleDelete}
                onCancel={handleCancel}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <svg
                  className="mb-4 h-16 w-16 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-600 mb-2">
                  메뉴를 선택하세요
                </p>
                <p className="text-sm text-gray-500">
                  왼쪽에서 편집할 메뉴를 선택하거나
                  <br />새 메뉴를 추가할 수 있습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
