'use client'

import { TextField } from './text-field'

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
}

export function CpfField({ label }: { label: string }) {
  return (
    <TextField
      label={label}
      inputProps={{ inputMode: 'numeric', placeholder: '000.000.000-00' }}
      transform={formatCpf}
    />
  )
}
