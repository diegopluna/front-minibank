'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { MiniBankLogo } from '@/components/minibank-logo'
import { authClient } from '@/lib/auth-client'
import { useSession } from '@/lib/auth'
import { useAppForm } from '@/lib/form'

const schema = z.object({
  username: z.string().min(1, 'Número da conta é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export default function SignInPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (session) router.replace('/dashboard')
  }, [session, router])

  const form = useAppForm({
    defaultValues: { username: '', password: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setServerError('')
      const { error } = await authClient.signIn.username({
        username: value.username,
        password: value.password,
      })
      if (error) {
        setServerError(error.message ?? 'Erro ao entrar. Verifique seus dados.')
        return
      }
      router.push('/dashboard')
    },
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Card className="flex w-full max-w-md flex-col gap-5 p-8">
        <CardTitle className="flex flex-col items-center gap-2">
          <MiniBankLogo />
          <p className="text-sm font-normal text-muted-foreground">
            Acesse sua conta
          </p>
        </CardTitle>

        <CardContent className="p-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="flex flex-col gap-4"
          >
            <form.AppField name="username">
              {(f) => (
                <f.TextField
                  label="Número da Conta"
                  inputProps={{ placeholder: 'Digite seu número' }}
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(f) => (
                <f.TextField
                  label="Senha"
                  inputProps={{ type: 'password', placeholder: 'Digite sua senha' }}
                />
              )}
            </form.AppField>

            {serverError && (
              <p className="text-center text-sm text-destructive">{serverError}</p>
            )}

            <form.AppForm>
              <form.SubmitButton label="Entrar" pendingLabel="Entrando..." />
            </form.AppForm>

            <p className="text-center text-sm text-muted-foreground">
              Não tem conta?{' '}
              <Link
                href="/sign-up"
                className="text-foreground underline underline-offset-4"
              >
                Cadastre-se
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
