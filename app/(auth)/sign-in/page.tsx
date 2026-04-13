'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from '@tanstack/react-form'

import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { MiniBankLogo } from '@/components/minibank-logo'
import { authClient } from '@/lib/auth-client'
import { useSession } from '@/lib/auth'

export default function SignInPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (!isPending && session) {
      router.replace('/dashboard')
    }
  }, [session, isPending, router])

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setServerError('')

      const { error } = await authClient.signIn.username({
        username: value.username,
        password: value.password,
      })

      if (error) {
        setServerError(
          error.message ?? 'Erro ao entrar. Verifique seus dados.'
        )
        return
      }

      router.push('/dashboard')
    },
  })

  if (isPending || session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

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
            <form.Field
              name="username"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? 'Número da conta é obrigatório' : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="username">Número da Conta</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu número"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? 'Senha é obrigatória' : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {serverError && (
              <p className="text-center text-sm text-destructive">
                {serverError}
              </p>
            )}

            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando...' : 'Entrar'}
                </Button>
              )}
            </form.Subscribe>

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
