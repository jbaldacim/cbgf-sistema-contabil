"use client";
import { formatarMoeda } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

export type Entry = {
  date: Date;
  accountCodeAndName: string;
  description: string;
  debito: number;
  credito: number;
};

export const columns: ColumnDef<Entry>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return (
        <div className="min-w-[110px] text-left whitespace-normal break-words">
          {date.toLocaleDateString("pt-BR")}
        </div>
      );
    },
    size: 120,
  },
  {
    accessorKey: "description",
    header: () => <div className="text-center">Descrição</div>,
    cell: ({ row }) => (
      <div className="min-w-[200px] text-left whitespace-normal break-words">
        {row.getValue("description")}
      </div>
    ),
    size: 400,
  },
  {
    accessorKey: "debito",
    header: () => <div className="text-right">Débito</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("debito"));
      const formatted = value > 0 ? formatarMoeda(value) : "—";

      return (
        <div className="min-w-[120px] text-right whitespace-normal break-words">
          {formatted}
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "credito",
    header: () => <div className="text-right">Crédito</div>,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("credito"));
      const formatted = value > 0 ? formatarMoeda(value) : "—";

      return (
        <div className="min-w-[120px] text-right whitespace-normal break-words">
          {formatted}
        </div>
      );
    },
    size: 150,
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const entry = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() =>
  //               navigator.clipboard.writeText(entry.debito.toString())
  //             }
  //           >
  //             Copiar valor do débito
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
