import { Loader2 } from 'lucide-react'
import { Button, ButtonProps } from '@/components/ui/button'

interface SpinnerButtonProps extends ButtonProps {
  /** Whether the button is in loading state */
  isLoading: boolean
  /** Button label text */
  label: string
}

export function SpinnerButton({
  isLoading,
  label,
  ...props
}: SpinnerButtonProps) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>{label}</span>
        </div>
      ) : (
        <span>{label}</span>
      )}
    </Button>
  )
}