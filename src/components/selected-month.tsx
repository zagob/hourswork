"use client";

import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { useDateContext } from "@/contexts/date-provider";

export function SelectedMonth() {
  const { onChangeMonth, date } = useDateContext();
  
  const currentMonth = format(date, "MMMM", { locale: pt });

  const months = Array.from({ length: 12 }).map((_, index) => ({
    number: index.toString().padStart(2, "0"),
    month: format(new Date(0, index), "MMMM", { locale: pt }),
  }));

  return (
    <Select
      onValueChange={(value) => onChangeMonth(Number(value))}
      value={currentMonth}
    >
      <SelectTrigger className="border w-[180px] border-zinc-800 capitalize rounded text-2xl">
        {currentMonth}
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={2}
        className="bg-zinc-900 shadow-lg text-zinc-100 rounded border-zinc-800"
      >
        {months.map(({ month, number }) => (
          <SelectItem key={month} value={number}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
