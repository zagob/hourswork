/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
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
import { cn, minutesToTimeString, timeStringToMinutes } from "@/lib/utils";
import { format, getDay, getMonth, getYear } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useDateContext } from "@/contexts/date-provider";
import { TableLoading } from "./table-loading";

import { ColumnDeleteHours } from "@/app/(dashboard)/(table-hours)/column-delete-hours";

export type HoursProps = {
  date: Date;
  id: null | string;
  times: null | Array<{ name: string; entry: string; exit: string }>;
  createdAt: null | string;
  totalHoursTime?: string;
  totalHoursTimesToMinutes: number;
  workhoursStatus: "POSITIVE" | "EQUAL" | "NEGATIVE";
  user: {
    detailsHours: {
      totalHours: string;
    };
  };
};

export function TableHours() {
  const { date } = useDateContext();

  const [month, year] = useMemo(() => {
    const month = getMonth(date);
    const year = getYear(date);
    return [month, year];
  }, [date]);

  const { data: registerHours, isFetching: isLoadingRegisterHours } = useQuery<{
    data: {
      hours: HoursProps[];
    };
  }>({
    queryKey: ["register-hours", month, year],
    queryFn: async () => {
      console.log("Fetching data for:", { year, month });
      return await api.get("/register-hours", {
        params: { year, month },
      });
    },
    placeholderData: (data) => data,
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<HoursProps>[] = useMemo(() => {
    console.log("Recalculating columns");

    return [
      {
        header: "Date",
        cell: ({ row }) => {
          const { date, times } = row.original;

          return (
            <div
              className={cn({
                "opacity-40":
                  getDay(date) === 0 || getDay(date) === 6 || !times,
              })}
            >
              {format(date, "dd/MM/yyyy")}
            </div>
          );
        },
      },
      ...Array.from({ length: 4 }).map((_, i) => ({
        header: `Time ${i + 1}`,
        cell: ({ row }: { row: Row<HoursProps> }) => {
          const { times } = row.original;
          if (!times) return <div className="opacity-50">00:00</div>;

          const time = times.flatMap((time) => [time.entry, time.exit])[i];

          if (!time) return <div>-</div>;

          return <div>{time}</div>;
        },
      })),

      {
        header: "Total hours",
        cell: ({ row }) => {
          const { times, totalHoursTime, workhoursStatus } = row.original;
          if (!times || !totalHoursTime)
            return <div className="opacity-50">00:00</div>;

          const indicatorClasses = {
            POSITIVE: "bg-green-500",
            EQUAL: "bg-zinc-500",
            NEGATIVE: "bg-red-500",
          };

          return (
            <div className="flex items-center gap-2">
              {totalHoursTime}
              <div
                className={`size-2 rounded-full ${indicatorClasses[workhoursStatus]}`}
              />
            </div>
          );
        },
        footer: ({ table }) => {
          console.log(
            "table",
            table.getFilteredRowModel().rows.map(({ original }) => original)
          );

          const dataHours = table
            .getFilteredRowModel()
            .rows.map(({ original }) => original);

          const totalHoursBalance = dataHours.reduce((acc, value) => {
            if (!value.times) return acc;

            const hoursTotalDay = timeStringToMinutes(
              value.user.detailsHours.totalHours
            );

            const calculateRestHours = Math.abs(
              value.totalHoursTimesToMinutes - hoursTotalDay
            );

            if (value.workhoursStatus === "POSITIVE") {
              acc += calculateRestHours;
            }

            if (value.workhoursStatus === "NEGATIVE") {
              acc -= calculateRestHours;
            }

            console.log("acc", acc);

            return acc;
          }, 0);

          console.log({
            totalHoursBalance,
          });

          const statusTotalBalance = Math.sign(totalHoursBalance) as 1 | -1 | 0;

          const indicatorClasses = {
            "0": "bg-zinc-500",
            "1": "bg-green-500",
            "-1": "bg-red-500",
          };

          return (
            <div className="flex items-center gap-2">
              {minutesToTimeString(Math.abs(totalHoursBalance))}
              <div
                className={`size-2 rounded-full ${indicatorClasses[statusTotalBalance]}`}
              />
            </div>
          );
        },
      },

      {
        id: "actions",
        cell: ColumnDeleteHours,
      },
    ];
  }, []);

  const table = useReactTable({
    data: registerHours?.data.hours ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoadingRegisterHours) {
    return <TableLoading table={table} columns={columns} />;
  }

  return (
    <div className="w-full">
      <div className="rounded-md border border-zinc-600 bg-zinc-800 h-[calc(100vh-180px)] overflow-auto">
        <Table>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="border-zinc-600 hover:bg-transparent"
                key={headerGroup.id}
              >
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
              <TableRow
                key={row.id}
                className="border-zinc-700/80 hover:bg-zinc-700 h-[48.8px]"
              >
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
                  <TableHead
                    className="text-zinc-200 bg-zinc-800"
                    key={header.id}
                  >
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
