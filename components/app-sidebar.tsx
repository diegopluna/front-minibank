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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { cn, formatAccountNumber, getInitials } from '@/lib/utils'
import { useSession } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'
import type { IconSvgElement } from '@hugeicons/react'

const navItems: { href: string; label: string; icon: IconSvgElement }[] = [
  { href: '/dashboard', label: 'Início', icon: Home01Icon },
  { href: '/transfer', label: 'Transferir', icon: ArrowDataTransferHorizontalIcon },
  { href: '/loans', label: 'Empréstimos', icon: MoneyBag02Icon },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#111] text-white">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex size-8 items-center justify-center rounded-md bg-white">
          <HugeiconsIcon icon={LandmarkIcon} size={18} className="text-[#111]" />
        </div>
        <span className="text-lg font-bold tracking-tight">MiniBank</span>
      </div>

      <div className="px-5 pt-2 pb-3">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Menu
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white/80',
              )}
            >
              <HugeiconsIcon icon={item.icon} size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-white/10" />

      <div className="flex items-center gap-3 px-5 py-4">
        <Avatar className="size-9 bg-white/10 text-xs font-bold text-white">
          <AvatarFallback className="bg-white/10 text-white">
            {user?.name ? getInitials(user.name) : '??'}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium">{user?.name ?? '...'}</span>
          <span className="text-xs text-white/50">
            Conta: {user?.username ? formatAccountNumber(user.username) : '...'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="shrink-0 rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Sair"
        >
          <HugeiconsIcon icon={Logout01Icon} size={18} />
        </button>
      </div>
    </aside>
  )
}
