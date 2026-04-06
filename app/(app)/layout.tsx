'use client'

import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { useSession } from '@/lib/auth'
import { Skeleton } from '@/components/ui/skeleton'

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/sign-in')
    }
  }, [isPending, session, router])

  if (!isPending && !session) {
    return null
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-background p-8">
        {isPending ? (
          <div className="mx-auto max-w-4xl space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  )
}
