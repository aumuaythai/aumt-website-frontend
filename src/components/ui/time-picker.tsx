import { cn } from '@/lib/utils'
import { Input } from 'antd'

export default function TimePicker({ className }: { className?: string }) {
  return (
    <Input
      type="time"
      id="time-picker"
      step="1"
      defaultValue="10:30:00"
      className={cn(
        'bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none',
        className
      )}
    />
  )
}
