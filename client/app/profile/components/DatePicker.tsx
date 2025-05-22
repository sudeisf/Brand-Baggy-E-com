import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"

import { DateRange } from "react-day-picker"

type Props = {
  onDateChange: (range: DateRange | undefined) => void
  value?: DateRange
}

export function DatePickerWithRange({ onDateChange, value }: Props) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)

  const handleChange = (range: DateRange | undefined) => {
    setDate(range)
    onDateChange(range)
  }

  const formattedLabel = date?.from
    ? date.to
      ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
      : format(date.from, "LLL dd, y")
    : "Pick a date range"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className="w-[250px] justify-start text-left font-normal"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formattedLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          selected={date}
          onSelect={handleChange}
          initialFocus
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
