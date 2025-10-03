// components/Columns-LivroDiario.tsx

"use client";

import { formatarMoeda } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./Data-Table-Column-Header";

export type Entry = {
  date: Date;
  transactionNumber: number;
  accountCodeAndName: string;
  description: string;
  debito: number;
  credito: number;
};

export const getColumns = (
  deleteHandler: (transactionNumber: number) => void,
): ColumnDef<Entry>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="text-left whitespace-nowrap">
          {date.toLocaleDateString("pt-BR")}
        </div>
      );
    },
    size: 100,
  },
  {
    accessorKey: "transactionNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transação" />
    ),
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right font-mono text-sm font-medium">
        {row.getValue("transactionNumber")}
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "accountCodeAndName",
    header: () => <div className="text-left font-medium">Conta</div>,
    cell: ({ row }) => (
      <div className="text-left font-medium break-words whitespace-normal">
        {row.getValue("accountCodeAndName")}
      </div>
    ),
    size: 250,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left font-medium">Descrição</div>,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-left break-words whitespace-normal">
        {row.getValue("description")}
      </div>
    ),
    size: 300,
  },
  {
    accessorKey: "debito",
    header: () => <div className="text-right font-medium">Débito</div>,
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("debito"));
      const formatted = value > 0 ? formatarMoeda(value) : "—";
      return (
        <div className="text-destructive text-right font-medium whitespace-nowrap">
          {formatted}
        </div>
      );
    },
    size: 130,
  },
  {
    accessorKey: "credito",
    header: () => <div className="text-right font-medium">Crédito</div>,
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("credito"));
      const formatted = value > 0 ? formatarMoeda(value) : "—";
      return (
        <div className="text-success text-right font-medium whitespace-nowrap">
          {formatted}
        </div>
      );
    },
    size: 130,
  },
  {
    id: "actions",
    header: () => <div className="text-center font-medium">Ações</div>,
    cell: ({ row }) => {
      const transactionNumber = row.original.transactionNumber;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-muted h-8 w-8 p-0"
                aria-label="Abrir menu de ações"
              >
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs font-medium">
                Ações
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onClick={() => deleteHandler(transactionNumber)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar transação
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 80,
  },
];
