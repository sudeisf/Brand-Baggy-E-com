"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ControllerRenderProps } from "react-hook-form"

type Props = {
  field: ControllerRenderProps<any, any>
}

export default function DatePicker({ field }: Props) {
  const currentYear = new Date().getFullYear()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full sm:w-[240px] justify-start text-left font-normal",
            !field.value && "text-muted-foreground",
            "hover:bg-gray-50 border border-gray-200 shadow-sm transition"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value ? new Date(field.value) : undefined}
          onSelect={field.onChange}
          fromYear={1900}
          toYear={currentYear}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          captionLayout="dropdown-buttons"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
