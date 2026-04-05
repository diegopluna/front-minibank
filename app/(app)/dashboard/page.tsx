'use client'

import { useRouter } from 'next/navigation'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MiniBankLogo } from '@/components/minibank-logo'
import { useSession } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/sign-in')
    }
  }, [isPending, session, router])

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
  }



  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }


  const user = session?.user

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="flex w-full max-w-md flex-col gap-5 p-8">
        <CardTitle className="flex flex-col items-center gap-2">
          <MiniBankLogo />
          <p className="text-sm font-normal text-muted-foreground">
            Bem-vindo(a), {user?.name}
          </p>
        </CardTitle>

        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Conta</span>
              <span className="font-mono text-sm font-medium">
                {user?.username ?? '-'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">E-mail</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
