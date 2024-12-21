"use client";

import { Clock1 } from "lucide-react";
import { DialogEditDetailsHours } from "./dialog-edit-details-hours";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export function TotalBank() {
  const { data: detailHours } = useQuery<{
    data: {
      detailsHours: {
        totalHoursWorked: string;
      };
    };
  }>({
    queryKey: ["detail-hours"],
    queryFn: async () => await api.get(`/details-hours`),
    staleTime: 1000,
  });

  return (
    <div className="hidden md:flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Clock1 />
        <span className="text-sm">Total Bank:</span>
      </div>
      <span className="font-bold">
        {detailHours?.data.detailsHours.totalHoursWorked}
      </span>
      <DialogEditDetailsHours />
    </div>
  );
}
