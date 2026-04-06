'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Home01Icon,
  ArrowDataTransferHorizontalIcon,
  MoneyBag02Icon,
  Logout01Icon,
  LandmarkIcon,
} from '@hugeicons/core-free-icons'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatAccountNumber, getInitials } from '@/lib/utils'
import { useSession, isManager } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'
import type { IconSvgElement } from '@hugeicons/react'

type NavItem = { href: string; label: string; icon: IconSvgElement }

const clientNav: NavItem[] = [
  { href: '/dashboard', label: 'Início', icon: Home01Icon },
  { href: '/transfer', label: 'Transferir', icon: ArrowDataTransferHorizontalIcon },
  { href: '/loans', label: 'Empréstimos', icon: MoneyBag02Icon },
]

const managerNav: NavItem[] = [
  { href: '/manager/loans', label: 'Empréstimos', icon: MoneyBag02Icon },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user
  const manager = user ? isManager(user) : false
  const navItems = manager ? managerNav : clientNav
  const groupLabel = manager ? 'Gerência' : 'Menu'

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <Sidebar collapsible="none" className="border-r-0">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary">
            <HugeiconsIcon icon={LandmarkIcon} size={18} className="text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">MiniBank</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    render={<Link href={item.href} />}
                  >
                    <HugeiconsIcon icon={item.icon} size={18} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0">
            <AvatarFallback className="text-xs font-semibold">
              {user?.name ? getInitials(user.name) : '??'}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{user?.name ?? '...'}</span>
            <span className="text-xs text-sidebar-foreground/50">
              Conta: {user?.username ? formatAccountNumber(user.username) : '...'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="shrink-0 rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            aria-label="Sair"
          >
            <HugeiconsIcon icon={Logout01Icon} size={18} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
