'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession, isManager } from '@/lib/auth'

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  const onManagerRoute = pathname.startsWith('/manager')

  useEffect(() => {
    if (isPending) return

    if (!session) {
      router.replace('/sign-in')
      return
    }

    const manager = isManager(session.user)

    if (manager && !onManagerRoute) {
      router.replace('/manager/loans')
    } else if (!manager && onManagerRoute) {
      router.replace('/dashboard')
    }
  }, [isPending, session, router, onManagerRoute])

  if (isPending) {
    return (
      <div className="flex min-h-screen">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="p-8">
            <div className="mx-auto max-w-4xl space-y-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  if (!session) return null

  const manager = isManager(session.user)
  const wrongRoute = (manager && !onManagerRoute) || (!manager && onManagerRoute)
  if (wrongRoute) return null

  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="p-8">{children}</SidebarInset>
      </SidebarProvider>
    </div>
  )
}
