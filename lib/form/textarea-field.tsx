'use client'

import { useId, type ComponentProps } from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useFieldContext } from './contexts'

type Props = {
  label: string
  textareaProps?: Omit<ComponentProps<typeof Textarea>, 'value' | 'onChange' | 'onBlur' | 'id'>
}

export function TextareaField({ label, textareaProps }: Props) {
  const id = useId()
  const field = useFieldContext<string>()
  const error = field.state.meta.errors[0]

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={Boolean(error) || undefined}
        {...textareaProps}
      />
      {error && <p className="text-xs text-destructive">{String(error)}</p>}
    </div>
  )
}
