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

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export default function SignUpPage() {
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
      name: '',
      cpf: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: ({ value }) => {
        if (value.password !== value.confirmPassword) {
          return {
            fields: {
              confirmPassword: 'As senhas não coincidem.',
            },
          }
        }
        return undefined
      },
    },
    onSubmit: async ({ value }) => {
      setServerError('')

      const cpfDigits = value.cpf.replace(/\D/g, '')

      const { error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
        cpf: cpfDigits,
        address: value.address,
      })

      if (error) {
        setServerError(
          error.message ?? 'Erro ao criar conta. Tente novamente.'
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
    <div className="flex min-h-screen flex-col items-center justify-center py-8">
      <Card className="flex w-full max-w-md flex-col gap-5 p-8">
        <CardTitle className="flex flex-col items-center gap-2">
          <MiniBankLogo />
          <h1 className="text-xl font-bold text-card-foreground">
            Criar Conta
          </h1>
          <p className="text-sm font-normal text-muted-foreground">
            Preencha seus dados para abrir sua conta
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
              name="name"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? 'Nome é obrigatório' : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome completo"
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
              name="cpf"
              validators={{
                onSubmit: ({ value }) => {
                  const digits = value.replace(/\D/g, '')
                  if (digits.length !== 11) return 'CPF deve conter 11 dígitos'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(formatCpf(e.target.value))
                    }
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
              name="address"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? 'Endereço é obrigatório' : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Seu endereço"
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
              name="email"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) return 'E-mail é obrigatório'
                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                    return 'E-mail inválido'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
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
                onSubmit: ({ value }) => {
                  if (!value) return 'Senha é obrigatória'
                  if (value.length < 8)
                    return 'Senha deve ter no mínimo 8 caracteres'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Crie uma senha"
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
              name="confirmPassword"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? 'Confirme sua senha' : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
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

            <div className="rounded-lg bg-primary/10 px-4 py-2.5 text-center text-sm font-medium text-primary">
              Bônus de R$ 50,00 para novas contas!
            </div>

            {serverError && (
              <p className="text-center text-sm text-destructive">
                {serverError}
              </p>
            )}

            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              )}
            </form.Subscribe>

            <p className="text-center text-sm text-muted-foreground">
              Já tem conta?{' '}
              <Link
                href="/sign-in"
                className="text-foreground underline underline-offset-4"
              >
                Faça login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
