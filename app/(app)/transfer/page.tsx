'use client'

import { useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { $api } from '@/lib/api/client'
import { useAppForm } from '@/lib/form'
import { extractApiError, formatCurrency, parseBrlToInt } from '@/lib/utils'

const schema = z.object({
  toAccountNumber: z.string().refine((v) => Number(v) > 0, 'Número da conta inválido'),
  amount: z
    .string()
    .refine((v) => parseBrlToInt(v) !== null, 'Valor deve ser maior que zero'),
})

export default function TransferPage() {
  const queryClient = useQueryClient()

  const balanceOpts = $api.queryOptions('get', '/api/accounts/balance')
  const transfersOpts = $api.queryOptions('get', '/api/transfers')

  const { data: balanceData, isLoading: balanceLoading } = $api.useQuery(
    'get',
    '/api/accounts/balance',
  )

  const transferMutation = $api.useMutation('post', '/api/transfers', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: balanceOpts.queryKey })
      queryClient.invalidateQueries({ queryKey: transfersOpts.queryKey })
    },
  })

  const form = useAppForm({
    defaultValues: { toAccountNumber: '', amount: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value, formApi }) => {
      const amountCents = parseBrlToInt(value.amount)
      if (amountCents === null) return
      await transferMutation.mutateAsync({
        body: {
          toAccountNumber: Number(value.toAccountNumber),
          amount: amountCents,
        },
      })
      formApi.reset()
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
            <form.AppField name="toAccountNumber">
              {(f) => <f.AccountField label="Número da Conta Destino" />}
            </form.AppField>

            <form.AppField name="amount">
              {(f) => <f.MoneyField label="Valor (R$)" />}
            </form.AppField>

            {transferMutation.isError && (
              <p className="text-center text-sm text-destructive">
                {extractApiError(transferMutation.error as unknown)}
              </p>
            )}
            {transferMutation.isSuccess && (
              <p className="text-center text-sm font-medium text-emerald-600">
                Transferência realizada! Novo saldo:{' '}
                {formatCurrency(transferMutation.data.fromBalance)}
              </p>
            )}

            <form.AppForm>
              <form.SubmitButton label="Transferir" pendingLabel="Transferindo..." />
            </form.AppForm>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
