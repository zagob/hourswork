import {
  ColumnDef,
  flexRender,
  Table as TableProps,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { HoursProps } from "./table-hours";

interface TableLoadingProps {
  table: TableProps<HoursProps>;
  columns: ColumnDef<HoursProps>[];
}

export function TableLoading({ table, columns }: TableLoadingProps) {
  return (
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
          {[...Array(5)].map((_, rowIndex) => (
            <TableRow className="hover:bg-transparent" key={rowIndex}>
              {columns.map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <div className="h-4 w-full bg-zinc-600 animate-pulse rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
