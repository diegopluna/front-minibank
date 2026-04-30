'use client'

import { useId, type ComponentProps } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFieldContext } from './contexts'

type Props = {
  label: string
  inputProps?: Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'onBlur' | 'id'>
  transform?: (raw: string) => string
}

export function TextField({ label, inputProps, transform }: Props) {
  const id = useId()
  const field = useFieldContext<string>()
  const error = field.state.meta.errors[0]

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={field.state.value}
        onChange={(e) =>
          field.handleChange(transform ? transform(e.target.value) : e.target.value)
        }
        onBlur={field.handleBlur}
        aria-invalid={Boolean(error) || undefined}
        {...inputProps}
      />
      {error && <p className="text-xs text-destructive">{String(error)}</p>}
    </div>
  )
}
