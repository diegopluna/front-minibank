'use client'

import { TextField } from './text-field'

const ACCOUNT_LENGTH = 8

export function AccountField({ label }: { label: string }) {
  return (
    <TextField
      label={label}
      inputProps={{ inputMode: 'numeric', placeholder: 'Digite o número da conta' }}
      transform={(raw) => raw.replace(/\D/g, '').slice(0, ACCOUNT_LENGTH)}
    />
  )
}
