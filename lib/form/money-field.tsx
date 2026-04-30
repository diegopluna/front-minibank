'use client'

import { TextField } from './text-field'

const allowed = /[^0-9.,]/g

export function MoneyField({ label }: { label: string }) {
  return (
    <TextField
      label={label}
      inputProps={{ inputMode: 'decimal', placeholder: '0,00' }}
      transform={(raw) => raw.replace(allowed, '')}
    />
  )
}
