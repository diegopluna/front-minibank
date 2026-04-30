'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { useSession, isManager } from '@/lib/auth'

type GateState = 'loading' | 'unauth' | 'wrong-role' | 'ok'

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  const onManagerRoute = pathname.startsWith('/manager')
  const manager = session ? isManager(session.user) : false

  const gate: GateState = isPending
    ? 'loading'
    : !session
      ? 'unauth'
      : (manager && !onManagerRoute) || (!manager && onManagerRoute)
        ? 'wrong-role'
        : 'ok'

  useEffect(() => {
    if (gate === 'unauth') router.replace('/sign-in')
    else if (gate === 'wrong-role') {
      router.replace(manager ? '/manager/loans' : '/dashboard')
    }
  }, [gate, manager, router])

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="p-8">
          {gate === 'ok' ? children : null}
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
