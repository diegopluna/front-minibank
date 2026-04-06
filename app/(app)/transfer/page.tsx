'use client'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { $api, fetchClient } from '@/lib/api/client'
import { formatCurrency, maskAccountInput, parseBrlToInt, extractApiError } from '@/lib/utils'

export default function TransferPage() {
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const { data: balanceData, isLoading: balanceLoading } = $api.useQuery(
    'get',
    '/api/accounts/balance',
  )

  const form = useForm({
    defaultValues: {
      toAccountNumber: '',
      amount: '',
    },
    onSubmit: async ({ value }) => {
      setServerError('')
      setSuccess('')

      const accountNumber = Number(value.toAccountNumber)
      if (Number.isNaN(accountNumber) || accountNumber <= 0) {
        setServerError('Número da conta destino inválido.')
        return
      }

      const amountCents = parseBrlToInt(value.amount)
      if (amountCents === null) {
        setServerError('Valor deve ser maior que zero.')
        return
      }

      const { data, error } = await fetchClient.POST('/api/transfers', {
        body: { toAccountNumber: accountNumber, amount: amountCents },
      })

      if (error) {
        setServerError(extractApiError(error))
        return
      }

      setSuccess(
        `Transferência realizada! Novo saldo: ${formatCurrency(data?.fromBalance ?? 0)}`,
      )
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['get', '/api/accounts/balance'] })
      queryClient.invalidateQueries({ queryKey: ['get', '/api/transfers'] })
    },
  })

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <h1 className="text-2xl font-bold">Transferência</h1>
      <p className="text-sm text-muted-foreground">
        Saldo atual:{' '}
        {balanceLoading ? (
          <Skeleton className="inline-block h-4 w-24 align-middle" />
        ) : (
          <span className="font-medium text-foreground">
            {formatCurrency(balanceData?.balance ?? 0)}
          </span>
        )}
      </p>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="flex flex-col gap-5"
          >
            <form.Field
              name="toAccountNumber"
              validators={{
                onSubmit: ({ value }) =>
                  !value ? 'Número da conta é obrigatório' : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="toAccountNumber">Número da Conta Destino</Label>
                  <Input
                    id="toAccountNumber"
                    type="text"
                    placeholder="Digite o número da conta"
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(maskAccountInput(e.target.value))
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
              name="amount"
              validators={{
                onSubmit: ({ value }) => {
                  if (!value) return 'Valor é obrigatório'
                  const parsed = parseFloat(value.replace(',', '.'))
                  if (Number.isNaN(parsed) || parsed <= 0)
                    return 'Valor deve ser maior que zero'
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0,00"
                    value={field.state.value}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9.,]/g, '')
                      field.handleChange(v)
                    }}
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
              <p className="text-center text-sm text-destructive">{serverError}</p>
            )}
            {success && (
              <p className="text-center text-sm font-medium text-emerald-600">{success}</p>
            )}

            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Transferindo...' : 'Transferir'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
