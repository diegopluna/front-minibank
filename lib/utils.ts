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

export function maskAccountInput(value: string) {
  if (/[a-zA-Z]/.test(value)) return value.replace(/[^a-zA-Z]/g, '')
  return value.replace(/\D/g, '').slice(0, ACCOUNT_LENGTH)
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

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}
