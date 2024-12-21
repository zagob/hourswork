"use client";

import * as React from "react";
import { format, startOfToday } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function DatePicker() {
  const { date } = useDateContext();
  const form = useFormContext();

  const { data: disabledDays } = useQuery<Array<Date>>({
    queryKey: ["disable-days-month"],
    queryFn: async () => {
      const { data } = await api.get("/disable-days-month");

      if (!data.disabledDays) return [];

      return data?.disabledDays.map((date: string) => new Date(date));
    },
  });

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
                "w-full sm:w-[280px] justify-start text-left font-normal bg-zinc-800 border-zinc-600 hover:bg-zinc-600 hover:text-zinc-300",
                !field.value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(field.value, "PPP", {
                  locale: pt,
                })
              ) : (
                <span>Select day</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-zinc-700">
            <Calendar
              mode="single"
              required
              disableNavigation
              disabled={[
                {
                  dayOfWeek: [0, 6],
                },
                ...(disabledDays ?? []),
                {
                  after: startOfToday(),
                },
              ]}
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
