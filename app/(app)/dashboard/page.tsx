'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSession } from '@/lib/auth'
import { $api } from '@/lib/api/client'
import { formatCurrency, formatShortDate, formatAccountNumber } from '@/lib/utils'

export default function DashboardPage() {
  const { data: session } = useSession()
  const user = session?.user

  const { data: balanceData, isLoading: balanceLoading } = $api.useQuery(
    'get',
    '/api/accounts/balance',
  )

  const { data: transfersData, isLoading: transfersLoading } = $api.useQuery(
    'get',
    '/api/transfers',
  )

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <h1 className="text-2xl font-bold">
        Olá, {user?.name?.split(' ')[0]}!
      </h1>

      <Card className="flex flex-col gap-1 p-6">
        <span className="text-sm text-muted-foreground">Saldo Disponível</span>
        {balanceLoading ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          <span className="text-4xl font-bold tracking-tight">
            {formatCurrency(balanceData?.balance ?? 0)}
          </span>
        )}
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Movimentações Recentes</h2>

        {transfersLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !transfersData?.transfers?.length ? (
          <Card className="p-8 text-center text-muted-foreground">
            Nenhuma movimentação encontrada.
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfersData.transfers.map((t) => {
                const isSent = t.direction === 'SENT'
                return (
                  <TableRow key={t.transferId}>
                    <TableCell className="text-muted-foreground">
                      {formatShortDate(t.occurredAt)}
                    </TableCell>
                    <TableCell>
                      Transferência {isSent ? 'para' : 'de'} conta{' '}
                      {formatAccountNumber(String(t.otherAccountNumber))}
                    </TableCell>
                    <TableCell
                      className={`text-right font-medium ${isSent ? 'text-destructive' : 'text-emerald-600'}`}
                    >
                      {isSent ? '- ' : '+ '}
                      {formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={isSent ? 'destructive' : 'default'}
                        className={
                          isSent
                            ? ''
                            : 'bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        }
                      >
                        {isSent ? 'Enviado' : 'Recebido'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}
