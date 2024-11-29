"use client";

import { useDateContext } from "@/contexts/date-provider";
import { intlFormatDistance } from "date-fns";
import { ptBR } from "date-fns/locale";

export function DistanceDate() {
  const { date } = useDateContext();

  return (
    <h2 className="text-xl font-medium capitalize">
      {intlFormatDistance(date, new Date(), {
        unit: "day",
        locale: "pt-br",
      })}
    </h2>
  );
}
