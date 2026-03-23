import { Link } from '@tanstack/react-router'
import { useStore } from '@tanstack/react-store'
import { sidebarStore, sidebarActions } from '@/entities/menu/model/sidebarStore'

export function Sidebar() {
  const { isOpen, selectedCategory } = useStore(sidebarStore, (state) => state)

  if (!isOpen || !selectedCategory) return null

  // children이 없으면 렌더링하지 않음
  if (!selectedCategory.children || selectedCategory.children.length === 0) return null

  return (
    <aside className="w-64 bg-card border-r border-border flex-shrink-0">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">{selectedCategory.name}</h2>
        <nav className="space-y-2">
          {selectedCategory.children.map((child) => (
            <Link
              key={child.id}
              to={child.path || '/'}
              className="block px-4 py-2 text-sm rounded-md hover:bg-accent transition-colors"
            >
              {child.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
