import { Store } from '@tanstack/react-store'
import type { Menu } from '@/types/menu'

interface SidebarState {
  isOpen: boolean
  selectedCategory: Menu | null
}

const initialState: SidebarState = {
  isOpen: false,
  selectedCategory: null,
}

export const sidebarStore = new Store(initialState)

export const sidebarActions = {
  open: (category: Menu) => {
    sidebarStore.setState(() => ({
      isOpen: true,
      selectedCategory: category,
    }))
  },
  close: () => {
    sidebarStore.setState(() => ({
      isOpen: false,
      selectedCategory: null,
    }))
  },
  toggle: (category: Menu) => {
    const currentState = sidebarStore.state
    if (currentState.isOpen && currentState.selectedCategory?.id === category.id) {
      sidebarActions.close()
    } else {
      sidebarActions.open(category)
    }
  },
}
