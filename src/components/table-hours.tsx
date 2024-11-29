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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, getAllDaysOfMonh } from "@/lib/utils";
import { format, getDay } from "date-fns";
import { Button } from "./ui/button";
import { Clock } from "lucide-react";

export type HoursProps = {
  date: Date;
};

export function TableHours() {
  const data = getAllDaysOfMonh(2024, 10).map((value) => ({
    date: value,
  }));

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
        id: "register-hours",
        cell: () => {
          return (
            <div>
              <Button
                variant="outline"
                className="border-green-400 rounded text-green-400 hover:text-green-200"
              >
                <Clock className="size-6" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
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
        </Table>
      </div>
    </div>
  );
}
