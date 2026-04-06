'use client'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useQueryClient } from '@tanstack/react-query'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { fetchClient } from '@/lib/api/client'
import { parseBrlToInt, formatCurrency, extractApiError } from '@/lib/utils'

export default function LoansPage() {
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm({
    defaultValues: {
      amount: '',
      reason: '',
    },
    onSubmit: async ({ value }) => {
      setServerError('')
      setSuccess('')

      const amountCents = parseBrlToInt(value.amount)
      if (amountCents === null) {
        setServerError('Valor deve ser maior que zero.')
        return
      }

      const { data, error } = await fetchClient.POST('/api/loans', {
        body: { amount: amountCents, reason: value.reason },
      })

      if (error) {
        setServerError(extractApiError(error))
        return
      }

      setSuccess(
        `Empréstimo solicitado! Valor: ${formatCurrency(data?.amount ?? 0)} — Status: ${data?.status}`,
      )
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['get', '/api/accounts/balance'] })
    },
  })

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      <h1 className="text-2xl font-bold">Solicitar Empréstimo</h1>

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
                  <Label htmlFor="amount">Valor Desejado (R$)</Label>
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

            <form.Field
              name="reason"
              validators={{
                onSubmit: ({ value }) =>
                  !value.trim() ? 'Motivo é obrigatório' : undefined,
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="reason">Motivo</Label>
                  <Textarea
                    id="reason"
                    placeholder="Descreva o motivo do empréstimo"
                    rows={4}
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
              <p className="text-center text-sm text-destructive">{serverError}</p>
            )}
            {success && (
              <p className="text-center text-sm font-medium text-emerald-600">
                {success}
              </p>
            )}

            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Solicitando...' : 'Solicitar Empréstimo'}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
