"use client";

import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { useDateContext } from "@/contexts/date-provider";

const MONTHS = Array.from({ length: 12 }).map((_, index) => ({
  number: index.toString().padStart(2, "0"),
  name: format(new Date(0, index), "MMMM", { locale: pt }),
}));

export function SelectedMonth() {
  const { onChangeMonth, date } = useDateContext();

  const currentMonthName = format(date, "MMMM", { locale: pt });

  return (
    <Select
      onValueChange={(value) => onChangeMonth(Number(value))}
      value={currentMonthName}
    >
      <SelectTrigger className="w-[180px] border border-zinc-800 rounded text-2xl capitalize">
        {currentMonthName}
      </SelectTrigger>
      <SelectContent
        position="popper"
        sideOffset={2}
        className="bg-zinc-900 shadow-lg text-zinc-100 rounded border border-zinc-800"
      >
        {MONTHS.map(({ name, number }) => (
          <SelectItem key={number} value={number} className="capitalize">
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
