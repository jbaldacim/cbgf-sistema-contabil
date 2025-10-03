"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
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
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { DataTablePagination } from "./Data-Table-Pagination";
import { DataTableViewOptions } from "./Data-Table-View-Option";
import AccountSelectorStandalone from "./AccountSelectorStandalone";
import type { Account } from "@/types";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  code?: string;
  setCode?: (value: string) => void;
  accounts?: Account[];
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  code,
  setCode,
  accounts,
  isLoading,
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

  const showAccountSelector =
    code !== undefined && setCode !== undefined && accounts !== undefined;

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row lg:items-center lg:justify-between">
          {showAccountSelector && (
            <div className="flex items-center gap-3 transition-all md:w-1/5 md:max-xl:grow">
              <span className="text-muted-foreground text-sm font-medium">
                Conta:
              </span>
              <AccountSelectorStandalone
                value={code}
                onChange={setCode}
                accounts={accounts}
                className="h-11 shrink shadow-sm focus-visible:ring-2"
              />
            </div>
          )}
          <div
            className={`flex items-center gap-3 ${showAccountSelector ? "flex-1 lg:max-w-2xl" : "w-full"}`}
          >
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Buscar por descrição..."
                className="h-11 pl-10 shadow-sm transition-all focus-visible:ring-2"
                value={
                  (table
                    .getColumn("description")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("description")?.setFilterValue(e.target.value)
                }
              />
            </div>
            <DataTableViewOptions table={table} />
          </div>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border shadow-lg">
        <div className="overflow-x-auto">
          <Table className="min-w-full table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted/50 hover:bg-muted/50 border-b"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className="text-muted-foreground h-12 px-6 font-semibold whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-64 text-center"
                  >
                    <div className="text-muted-foreground flex flex-col items-center justify-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="text-sm font-medium">Carregando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(
                        "group hover:bg-muted/50 border-b transition-colors",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{ width: cell.column.getSize() }}
                          className="px-6 py-4 text-sm transition-colors"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-64 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-muted rounded-full p-4">
                        <Search className="text-muted-foreground/50 h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-foreground text-sm font-medium">
                          Nenhum resultado encontrado
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Tente ajustar seus filtros de busca
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mt-4">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
