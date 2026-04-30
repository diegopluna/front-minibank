'use client'

import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { Card, CardContent } from '@/components/ui/card'
import { $api } from '@/lib/api/client'
import { useAppForm } from '@/lib/form'
import { extractApiError, formatCurrency, parseBrlToInt } from '@/lib/utils'

const schema = z.object({
  amount: z
    .string()
    .refine((v) => parseBrlToInt(v) !== null, 'Valor deve ser maior que zero'),
  reason: z.string().min(1, 'Motivo é obrigatório'),
})

export default function LoansPage() {
  const queryClient = useQueryClient()
  const balanceOpts = $api.queryOptions('get', '/api/accounts/balance')

  const loanMutation = $api.useMutation('post', '/api/loans', {
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: balanceOpts.queryKey }),
  })

  const form = useAppForm({
    defaultValues: { amount: '', reason: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value, formApi }) => {
      const amountCents = parseBrlToInt(value.amount)
      if (amountCents === null) return
      await loanMutation.mutateAsync({
        body: { amount: amountCents, reason: value.reason },
      })
      formApi.reset()
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
            <form.AppField name="amount">
              {(f) => <f.MoneyField label="Valor Desejado (R$)" />}
            </form.AppField>

            <form.AppField name="reason">
              {(f) => (
                <f.TextareaField
                  label="Motivo"
                  textareaProps={{
                    rows: 4,
                    placeholder: 'Descreva o motivo do empréstimo',
                  }}
                />
              )}
            </form.AppField>

            {loanMutation.isError && (
              <p className="text-center text-sm text-destructive">
                {extractApiError(loanMutation.error as unknown)}
              </p>
            )}
            {loanMutation.isSuccess && (
              <p className="text-center text-sm font-medium text-emerald-600">
                Empréstimo solicitado! Valor:{' '}
                {formatCurrency(loanMutation.data.amount)} — Status:{' '}
                {loanMutation.data.status}
              </p>
            )}

            <form.AppForm>
              <form.SubmitButton
                label="Solicitar Empréstimo"
                pendingLabel="Solicitando..."
              />
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
