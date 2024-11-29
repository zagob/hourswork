"use client";

import * as React from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn, getAllDaysOfMonh } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormField } from "./ui/form";
import { useFormContext } from "react-hook-form";
import { useDateContext } from "@/contexts/date-provider";

export function DatePicker() {
  const { date} = useDateContext();
  //   const [date, setDate] = React.useState<Date>();
  const form = useFormContext();

//   const datesMonthDisabled = getAllDaysOfMonh(
//     Number(year),
//     Number(month) - 1
//   ).filter((value) => value.getDay() === 0 && value.getDay() === 6);

  //   console.log(datesMonth);
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[280px] justify-start text-left font-normal bg-zinc-800 border-zinc-600 hover:bg-zinc-600 hover:text-zinc-300",
                !field.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, "PPP", {
                  locale: pt,
                })
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-zinc-700">
            <Calendar
              mode="single"
              required
              disableNavigation
              disabled={{
                dayOfWeek: [0, 6],
              }}
              month={new Date(date.getFullYear(), date.getMonth())}
              className="bg-zinc-800 text-zinc-100 border border-zinc-600"
              selected={field.value}
              onSelect={field.onChange}
              initialFocus
              locale={pt}
            />
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
