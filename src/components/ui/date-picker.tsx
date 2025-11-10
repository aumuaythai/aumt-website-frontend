// import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Button, Input } from 'antd'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DayPicker } from 'react-day-picker'

type DatePickerProps = React.ComponentProps<typeof DayPicker>

export function DatePicker({
  selected,
  className,
  ...props
}: DatePickerProps & { mode: 'single' }) {
  return (
    // <Popover>
    //   <PopoverTrigger asChild>
    //     <Button
    //       type="default"
    //       data-empty={!selected}
    //       className={cn(
    //         'data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal',
    //         className
    //       )}
    //     >
    //       <CalendarIcon className="size-4" />
    //       {selected ? format(selected, 'PPP') : <span>Pick a date</span>}
    //     </Button>
    //   </PopoverTrigger>
    //   <PopoverContent className="w-auto p-0">
    //     <Calendar selected={selected} captionLayout="dropdown" {...props} />
    //   </PopoverContent>
    // </Popover>
    <Input
      type="datetime-local"
      data-empty={!selected}
      className={cn(
        'data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal',
        className
      )}
    >
      {/* <CalendarIcon className="size-4" /> */}
      {/* {selected ? format(selected, 'PPP') : <span>Pick a date</span>} */}
    </Input>
  )
}
