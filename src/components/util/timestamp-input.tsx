import { cn } from '@/lib/utils'
import { Input } from 'antd'
import { Timestamp } from 'firebase/firestore'
import { Controller, UseControllerProps } from 'react-hook-form'

export default function TimestampInput({
  name,
  control,
  label,
}: UseControllerProps<any> & {
  label: string
}) {
  return (
    <>
      <label htmlFor={name} className="mb-2 block">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input
              id={name}
              type="datetime-local"
              value={dateToInputFormat(field.value?.toDate())}
              className={cn(
                'relative [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:size-full',
                error && '!border-red-500'
              )}
              onChange={(e) =>
                field.onChange(
                  Timestamp.fromDate(new Date(e.target.value))
                )
              }
            />
            <div className="text-red-500">{error?.message || '\xa0'}</div>
          </>
        )}
      />
    </>
  )
}

function dateToInputFormat(date: Date | undefined) {
  if (!date) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const h = pad(date.getHours())
  const min = pad(date.getMinutes())
  return `${y}-${m}-${d}T${h}:${min}`
}
