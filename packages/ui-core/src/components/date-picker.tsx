"use client"

import { Button } from "./button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { cn } from "../lib/utils"
import { Calendar } from "./calendar"
import { addDays, format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import * as React from "react"
import { type DateRange } from "react-day-picker"

interface DateRangePickerProps {
  className?: string
  from?: Date
  to?: Date
  onSelect?: (range: { from: Date | undefined; to: Date | undefined }) => void
}

export default function DateRangePicker({
  className,
  from,
  to,
  onSelect,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: from || addDays(new Date(), -20),
    to: to || new Date(),
  })

  // Update internal state when props change
  React.useEffect(() => {
    setDate({ from, to })
  }, [from, to])

  const handleSelect = (newDate: DateRange | undefined) => {
    setDate(newDate)
    onSelect?.(newDate ? { from: newDate.from, to: newDate.to } : { from: undefined, to: undefined })
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the popover
    const clearedRange = { from: undefined, to: undefined }
    setDate(clearedRange)
    onSelect?.(clearedRange)
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
           <Button
             id="date"
             variant="outline"
             className={cn(
               "w-[260px] justify-start text-left font-normal pl-3 pr-2",
               !date && "text-muted-foreground"
             )}
           >
             <CalendarIcon className="mr-3 h-4 w-4" />
             <span className={date?.from ? "mr-1" : ""}>
               {date?.from ? (
                 date.to ? (
                   <>
                     {format(date.from, "LLL dd, y")} -{" "}
                     {format(date.to, "LLL dd, y")}
                   </>
                 ) : (
                   format(date.from, "LLL dd, y")
                 )
               ) : (
                 "Date range"
               )}
             </span>
               {date?.from && (
                 <div
                   onClick={handleClear}
                   className="ml-0.5 h-4 w-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer flex items-center justify-center"
                   role="button"
                   tabIndex={0}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                       e.preventDefault()
                       handleClear(e as any)
                     }
                   }}
                 >
                   <X className="h-3 w-3" />
                   <span className="sr-only">Clear date range</span>
                 </div>
               )}
           </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
           <Calendar
             autoFocus
             mode="range"
             defaultMonth={date?.from}
             selected={date}
             onSelect={handleSelect}
             numberOfMonths={2}
           />
        </PopoverContent>
      </Popover>
    </div>
  )
}