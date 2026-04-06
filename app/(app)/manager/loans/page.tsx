'use client'

import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { $api, fetchClient } from '@/lib/api/client'
import { formatAccountNumber, formatCurrency, extractApiError } from '@/lib/utils'

type LoanStatus = 'PENDING' | 'ACEITO' | 'RECUSADO'

const PAGE_SIZE = 8

const statusLabel: Record<LoanStatus, string> = {
  PENDING: 'Pendente',
  ACEITO: 'Aceito',
  RECUSADO: 'Recusado',
}

const statusVariant: Record<LoanStatus, 'default' | 'outline' | 'destructive'> = {
  PENDING: 'outline',
  ACEITO: 'default',
  RECUSADO: 'destructive',
}

export default function ManagerLoansPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'ALL'>('ALL')
  const [page, setPage] = useState(0)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [actionError, setActionError] = useState('')

  const { data: loans, isLoading } = $api.useQuery('get', '/api/loans')

  const filtered = useMemo(() => {
    if (!loans) return []
    const list = Array.isArray(loans) ? loans : []
    return list.filter((loan) => {
      if (statusFilter !== 'ALL' && loan.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        const matchesName = loan.customerName.toLowerCase().includes(q)
        const matchesAccount = String(loan.accountNumber).includes(q)
        const matchesReason = loan.reason.toLowerCase().includes(q)
        if (!matchesName && !matchesAccount && !matchesReason) return false
      }
      return true
    })
  }, [loans, statusFilter, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  async function handleReview(id: string, decision: 'APPROVE' | 'REJECT') {
    setActionError('')
    setReviewingId(id)
    try {
      const { error } = await fetchClient.PATCH('/api/loans/{id}/review', {
        params: { path: { id } },
        body: { decision },
      })
      if (error) {
        setActionError(extractApiError(error))
        return
      }
      queryClient.invalidateQueries({ queryKey: ['get', '/api/loans'] })
    } finally {
      setReviewingId(null)
    }
  }

  const statusFilters: { value: LoanStatus | 'ALL'; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'PENDING', label: 'Pendente' },
    { value: 'ACEITO', label: 'Aceito' },
    { value: 'RECUSADO', label: 'Recusado' },
  ]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Solicitações de Empréstimo</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie todas as solicitações de empréstimo dos clientes
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="Buscar solicitações..."
          className="max-w-sm"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
        />
        <div className="ml-auto flex items-center gap-1">
          {statusFilters.map((f) => (
            <Button
              key={f.value}
              variant={statusFilter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setStatusFilter(f.value)
                setPage(0)
              }}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {actionError && (
        <p className="text-sm text-destructive">{actionError}</p>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Conta</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-48 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!isLoading && paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    Nenhuma solicitação encontrada.
                  </TableCell>
                </TableRow>
              )}

              {paginated.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-mono">
                    {formatAccountNumber(String(loan.accountNumber))}
                  </TableCell>
                  <TableCell>{loan.customerName}</TableCell>
                  <TableCell>{formatCurrency(loan.amount)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {loan.reason}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[loan.status]}>
                      {statusLabel[loan.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {loan.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={reviewingId === loan.id}
                          onClick={() => handleReview(loan.id, 'APPROVE')}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={reviewingId === loan.id}
                          onClick={() => handleReview(loan.id, 'REJECT')}
                        >
                          Recusar
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {loan.status === 'ACEITO' ? 'Aprovado' : 'Recusado'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Mostrando {filtered.length}{' '}
          {filtered.length === 1 ? 'solicitação' : 'solicitações'}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}
