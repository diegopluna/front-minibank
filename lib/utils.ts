import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ACCOUNT_LENGTH = 8

export function formatAccountNumber(value: string) {
  if (/\D/.test(value)) return value
  return value.padStart(ACCOUNT_LENGTH, '0')
}

const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatCurrency(cents: number) {
  return brlFormatter.format(cents / 100)
}

export function formatShortDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export function parseBrlToInt(value: string): number | null {
  const clean = value.replace(/\s/g, '').replace(',', '.')
  const parsed = parseFloat(clean)
  if (Number.isNaN(parsed) || parsed <= 0) return null
  return Math.round(parsed * 100)
}

export function extractApiError(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Erro inesperado.'
  const err = error as Record<string, unknown>

  if (err.errors && typeof err.errors === 'object') {
    const errors = err.errors as { details?: { path?: string[]; message?: string }[] }
    if (Array.isArray(errors.details) && errors.details.length > 0) {
      return errors.details
        .map((d) => {
          const field = d.path?.join('.') ?? ''
          return field ? `${field}: ${d.message}` : (d.message ?? '')
        })
        .filter(Boolean)
        .join('; ')
    }
  }

  if (typeof err.message === 'string' && err.message !== 'Validation Failed') {
    return err.message
  }

  return 'Erro inesperado. Tente novamente.'
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
