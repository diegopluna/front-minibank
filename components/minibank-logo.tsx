import { LandmarkIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

export function MiniBankLogo() {
  return (
    <div className="flex flex-row items-center justify-center gap-2.5">
      <div className="flex size-9 items-center justify-center rounded-md bg-primary">
        <HugeiconsIcon icon={LandmarkIcon} className="text-background" />
      </div>
      <h2 className="text-2xl font-bold text-card-foreground">MiniBank</h2>
    </div>
  )
}
