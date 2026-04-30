'use client'

import { Button } from '@/components/ui/button'
import { useFormContext } from './contexts'

type Props = {
  label: string
  pendingLabel?: string
  className?: string
}

export function SubmitButton({ label, pendingLabel, className }: Props) {
  const form = useFormContext()
  return (
    <form.Subscribe selector={(s) => s.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          className={className ?? 'w-full'}
          disabled={isSubmitting}
        >
          {isSubmitting ? (pendingLabel ?? `${label}...`) : label}
        </Button>
      )}
    </form.Subscribe>
  )
}
