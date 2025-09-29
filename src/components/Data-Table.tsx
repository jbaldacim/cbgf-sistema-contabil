import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { DataTablePagination } from "./Data-Table-Pagination";
import { DataTableViewOptions } from "./Data-Table-View-Option";
import AccountSelectorStandalone from "./AccountSelectorStandalone";
import { Account } from "@/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  code: string;
  setCode: (value: string) => void;
  accounts: Account[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  code,
  setCode,
  accounts,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-2">
        <div className="flex items-center gap-2 justify-between w-full md:w-1/5 md:max-xl:grow">
          <span className="font-semibold">Conta:</span>
          <AccountSelectorStandalone
            value={code}
            onChange={setCode}
            accounts={accounts}
            className="shrink"
          />
        </div>
        <div className="flex items-center gap-2 grow justify-between flex-col md:flex-row">
          <span className="font-semibold">Busca:</span>
          <Input
            placeholder="Insira seu filtro"
            className="bg-background"
            value={
              (table.getColumn("description")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("description")?.setFilterValue(e.target.value)
            }
          />
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <div className="overflow-hidden rounded-md border my-2">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próxima
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div> */}
    </div>
  );
}
