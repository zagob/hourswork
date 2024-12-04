/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateTotalWorkTime, cn, timeStringToMinutes } from "@/lib/utils";
import { format, getDay, getMonth, getYear } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useDateContext } from "@/contexts/date-provider";

export type HoursProps = {
  date: Date;
  id: null | string;
  times: null | Array<{ name: string; entry: string; exit: string }>;
  createdAt: null | string;
  user: {
    detailsHours: {
      totalHours: string;
    };
  };
};

export function TableHours() {
  const { date } = useDateContext();

  const { data: registerHours } = useQuery<{
    data: {
      hours: HoursProps[];
    };
  }>({
    queryKey: ["register-hours", getMonth(date), getYear(date)],
    queryFn: async () => {
      return await api.get("/register-hours", {
        params: {
          year: getYear(date),
          month: getMonth(date),
        },
      });
    },
    staleTime: Infinity,
  });

  const columns: ColumnDef<HoursProps>[] = React.useMemo(
    () => [
      {
        header: "Date",
        cell: ({ row }) => {
          const { date } = row.original;

          return (
            <div
              className={cn({
                "opacity-40": getDay(date) === 0 || getDay(date) === 6,
              })}
            >
              {format(date, "dd/MM/yyyy")}
            </div>
          );
        },
      },
      {
        header: "Time 1",
        cell: ({ row }) => {
          const { times } = row.original;
          if (!times) return <div className="opacity-50">00:00</div>;
          return <div>{times[0]?.entry}</div>;
        },
      },
      {
        header: "Time 2",
        cell: ({ row }) => {
          const { times } = row.original;
          if (!times) return <div className="opacity-50">00:00</div>;
          return <div>{times[0]?.exit}</div>;
        },
      },
      {
        header: "Time 3",
        cell: ({ row }) => {
          const { times } = row.original;
          if (!times) return <div className="opacity-50">00:00</div>;
          return <div>{times[1]?.entry}</div>;
        },
      },
      {
        header: "Time 4",
        cell: ({ row }) => {
          const { times } = row.original;
          if (!times) return <div className="opacity-50">00:00</div>;
          return <div>{times[1]?.exit}</div>;
        },
      },
      {
        header: "Total hours",
        cell: ({ row }) => {
          const { times, user } = row.original;
          if (!times) return <div className="opacity-50">00:00</div>;

          const timesCalculate = calculateTotalWorkTime(times);

          const isHoursPositive =
            timeStringToMinutes(timesCalculate) >
            timeStringToMinutes(user.detailsHours.totalHours);
          const isHoursEqual =
            timeStringToMinutes(timesCalculate) ===
            timeStringToMinutes(user.detailsHours.totalHours);
          const isHoursNegative =
            timeStringToMinutes(timesCalculate) <
            timeStringToMinutes(user.detailsHours.totalHours);

          return (
            <div className="flex items-center gap-2">
              {timesCalculate}
              {isHoursNegative && (
                <div className="size-2 rounded-full bg-red-500" />
              )}
              {isHoursEqual && (
                <div className="size-2 rounded-full bg-zinc-500" />
              )}
              {isHoursPositive && (
                <div className="size-2 rounded-full bg-green-500" />
              )}
            </div>
          );
        },
        footer: ({ table, column }) => {
          console.log('table',table.getFilteredRowModel().rows.map(({ original }) => original))
          return <div>test</div>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: registerHours?.data.hours ?? [],
    // data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full ">
      <div className="rounded-md border border-zinc-600 bg-zinc-800 h-[calc(100vh-180px)] overflow-auto">
        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="border-zinc-600" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-zinc-700/80">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow className="border-zinc-700/80" key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableHead className="text-zinc-200 bg-zinc-800" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
