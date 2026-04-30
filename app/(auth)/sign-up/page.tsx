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

const schema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    cpf: z
      .string()
      .refine((v) => v.replace(/\D/g, '').length === 11, 'CPF deve conter 11 dígitos'),
    address: z.string().min(1, 'Endereço é obrigatório'),
    email: z.email('E-mail inválido'),
    password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem.',
  })

export default function SignUpPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    if (session) router.replace('/dashboard')
  }, [session, router])

  const form = useAppForm({
    defaultValues: {
      name: '',
      cpf: '',
      address: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setServerError('')
      const { error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
        cpf: value.cpf.replace(/\D/g, ''),
        address: value.address,
      })
      if (error) {
        setServerError(error.message ?? 'Erro ao criar conta. Tente novamente.')
        return
      }
      router.push('/dashboard')
    },
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-8">
      <Card className="flex w-full max-w-md flex-col gap-5 p-8">
        <CardTitle className="flex flex-col items-center gap-2">
          <MiniBankLogo />
          <h1 className="text-xl font-bold text-card-foreground">Criar Conta</h1>
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
            <form.AppField name="name">
              {(f) => (
                <f.TextField
                  label="Nome Completo"
                  inputProps={{ placeholder: 'Seu nome completo' }}
                />
              )}
            </form.AppField>

            <form.AppField name="cpf">
              {(f) => <f.CpfField label="CPF" />}
            </form.AppField>

            <form.AppField name="address">
              {(f) => (
                <f.TextField
                  label="Endereço"
                  inputProps={{ placeholder: 'Seu endereço' }}
                />
              )}
            </form.AppField>

            <form.AppField name="email">
              {(f) => (
                <f.TextField
                  label="E-mail"
                  inputProps={{ type: 'email', placeholder: 'seu@email.com' }}
                />
              )}
            </form.AppField>

            <form.AppField name="password">
              {(f) => (
                <f.TextField
                  label="Senha"
                  inputProps={{ type: 'password', placeholder: 'Crie uma senha' }}
                />
              )}
            </form.AppField>

            <form.AppField name="confirmPassword">
              {(f) => (
                <f.TextField
                  label="Confirmar Senha"
                  inputProps={{ type: 'password', placeholder: 'Confirme sua senha' }}
                />
              )}
            </form.AppField>

            <div className="rounded-lg bg-primary/10 px-4 py-2.5 text-center text-sm font-medium text-primary">
              Bônus de R$ 50,00 para novas contas!
            </div>

            {serverError && (
              <p className="text-center text-sm text-destructive">{serverError}</p>
            )}

            <form.AppForm>
              <form.SubmitButton label="Criar Conta" pendingLabel="Criando conta..." />
            </form.AppForm>

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
