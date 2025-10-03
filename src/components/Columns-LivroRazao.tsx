// components/Columns-LivroRazao.tsx

"use client";
import { formatarMoeda } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./Data-Table-Column-Header";

export type Entry = {
  date: Date;
  accountCodeAndName: string;
  description: string;
  debito: number;
  credito: number;
};

export const columns: ColumnDef<Entry>[] = [
  {
    id: "rowIndex",
    header: () => <div className="text-right font-medium">#</div>,
    cell: ({ row }) => (
      <div className="text-muted-foreground text-right text-sm font-medium">
        {row.index + 1}
      </div>
    ),
    size: 50,
    minSize: 50,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        // Changed here to prevent text wrapping
        <div className="text-left whitespace-nowrap">
          {date.toLocaleDateString("pt-BR")}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-left font-medium">Descrição</div>,
    cell: ({ row }) => (
      <div className="text-left break-words whitespace-normal">
        {row.getValue("description")}
      </div>
    ),
    size: 400,
  },
  {
    accessorKey: "debito",
    header: () => <div className="text-right font-medium">Débito</div>,
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("debito"));
      const formatted = value > 0 ? formatarMoeda(value) : "—";

      return (
        <div className="text-destructive text-right font-medium break-words whitespace-normal">
          {formatted}
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "credito",
    header: () => <div className="text-right font-medium">Crédito</div>,
    cell: ({ row }) => {
      const value = Number.parseFloat(row.getValue("credito"));
      const formatted = value > 0 ? formatarMoeda(value) : "—";

      return (
        <div className="text-success text-right font-medium break-words whitespace-normal">
          {formatted}
        </div>
      );
    },
    size: 150,
  },
];
