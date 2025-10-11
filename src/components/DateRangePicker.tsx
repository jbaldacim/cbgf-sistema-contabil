"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useEffect, useState } from "react"

interface DateRangePickerProps {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  className?: string
}

export function DateRangePicker({ date, setDate }: DateRangePickerProps) {
  const [maxDate, setMaxDate] = useState<Date | undefined>(undefined)
  useEffect(() => {
    setMaxDate(new Date())
  }, [])

  const CustomWeekNumber = ({ week, ...props }: any) => {
    const handleClick = () => {
      const minDate = new Date(2025, 0, 1)

      // Get all dates from the week
      const allDates = week.days.map((day: any) => day.date)

      // Filter to only include enabled dates
      const enabledDates = allDates.filter((date: Date) => {
        const isAfterMin = date >= minDate
        const isBeforeMax = !maxDate || date <= maxDate
        return isAfterMin && isBeforeMax
      })

      // If no enabled dates in this week, do nothing
      if (enabledDates.length === 0) {
        return
      }

      // Select from first to last enabled date
      const weekStart = enabledDates[0]
      const weekEnd = enabledDates[enabledDates.length - 1]

      setDate({
        from: weekStart,
        to: weekEnd,
      })
    }

    const minDate = new Date(2025, 0, 1)
    const allDates = week.days.map((day: any) => day.date)
    const hasEnabledDates = allDates.some((date: Date) => {
      const isAfterMin = date >= minDate
      const isBeforeMax = !maxDate || date <= maxDate
      return isAfterMin && isBeforeMax
    })

    return (
      <td
        {...props}
        onClick={hasEnabledDates ? handleClick : undefined}
        className={cn(
          "text-[0.8rem] select-none text-muted-foreground rdp-week_number",
          hasEnabledDates ? "cursor-pointer hover:bg-accent" : "cursor-not-allowed opacity-50",
        )}
      >
        <div className="flex size-(--cell-size) items-center justify-center text-center">{week.weekNumber}</div>
      </td>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal sm:w-[300px]", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "dd/MM/yyyy", { locale: ptBR })} - {format(date.to, "dd/MM/yyyy", { locale: ptBR })}
              </>
            ) : (
              format(date.from, "dd/MM/yyyy", { locale: ptBR })
            )
          ) : (
            <span>Selecione o período</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          disabled={{
            before: new Date(2025, 0, 1),
            after: maxDate || undefined,
          }}
          numberOfMonths={2}
          locale={ptBR}
          captionLayout="dropdown"
          showOutsideDays={false}
          showWeekNumber
          components={{
            WeekNumber: CustomWeekNumber,
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
