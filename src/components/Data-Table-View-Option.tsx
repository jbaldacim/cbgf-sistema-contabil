"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import type { Table } from "@tanstack/react-table";
import { Settings2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function DataTableViewOptions<TData>({
  table,
}: {
  table: Table<TData>;
}) {
  const columnLabels: Record<string, string> = {
    date: "Data",
    description: "Descrição",
    debito: "Débito",
    credito: "Crédito",
    transactionNumber: "Transação",
    accountCodeAndName: "Conta",
  };

  const visibleCount = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    )
    .filter((column) => column.getIsVisible()).length;

  const totalCount = table
    .getAllColumns()
    .filter(
      (column) =>
        typeof column.accessorFn !== "undefined" && column.getCanHide(),
    ).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="group ml-auto hidden h-11 gap-2 bg-transparent shadow-sm transition-all hover:shadow-md lg:flex"
        >
          <Settings2 className="h-4 w-4 transition-transform group-hover:rotate-90" />
          <span className="font-medium">Colunas</span>
          <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-semibold">
            {visibleCount}/{totalCount}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-card/95 w-56 shadow-lg backdrop-blur-sm"
      >
        <DropdownMenuLabel className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold">
          <Eye className="text-muted-foreground h-4 w-4" />
          Visibilidade das Colunas
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[300px] overflow-y-auto px-1 py-1">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide(),
            )
            .map((column) => {
              const isVisible = column.getIsVisible();
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="group hover:bg-muted/50 focus:bg-muted/50 cursor-pointer rounded-md px-3 py-2.5 text-sm transition-colors [&>span:first-child]:hidden"
                  checked={isVisible}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  <span className="flex items-center gap-2.5">
                    {isVisible ? (
                      <Eye className="text-primary h-3.5 w-3.5" />
                    ) : (
                      <EyeOff className="text-muted-foreground/50 h-3.5 w-3.5" />
                    )}
                    <span
                      className={
                        isVisible ? "font-medium" : "text-muted-foreground"
                      }
                    >
                      {columnLabels[column.id] ?? column.id}
                    </span>
                  </span>
                </DropdownMenuCheckboxItem>
              );
            })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
