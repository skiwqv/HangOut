import { LayoutGrid, Menu, MessageSquare, Bell } from '@lucide/vue'
import type { NavItem } from '@/types/nav'

export const NAV_ITEMS: NavItem[] = [
  { id: 'feed',          title: 'Лента',           icon: LayoutGrid },
  { id: 'activities',    title: 'Мои активности',  icon: Menu,           requiresAuth: true },
  { id: 'chats',         title: 'Чаты',             icon: MessageSquare,  requiresAuth: true },
  { id: 'notifications', title: 'Уведомления',     icon: Bell,           requiresAuth: true },
]