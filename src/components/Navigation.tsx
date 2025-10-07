"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"; // Importe o hook useTheme
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ModeToggle } from "./ModeToggle";

const navLinks = [
  { href: "/", label: "Lançamentos" },
  { href: "/livro-diario", label: "Livro Diário" },
  { href: "/livro-razao", label: "Livro Razão" },
  { href: "/balanco-patrimonial", label: "Balanço Patrimonial" },
  { href: "/gerenciar-contas", label: "Gerenciar Contas" },
];

export function Navigation() {
  const pathname = usePathname();
  const { setTheme } = useTheme(); // Hook para controlar o tema

  return (
    // Modificado para alinhar o botão de tema ao lado
    <div className="flex w-full items-center justify-center gap-2 px-2 pt-4 sm:px-4">
      <Tabs value={pathname} className="w-full max-w-2xl">
        <TabsList
          className="bg-muted/40 scrollbar-hide flex w-full gap-1 overflow-x-auto rounded-lg border sm:grid sm:grid-cols-5"
          aria-label="Navegação principal"
        >
          {navLinks.map((link) => (
            <TabsTrigger
              key={link.href}
              value={link.href}
              asChild
              className="min-w-[130px] flex-1 px-3 py-2 text-sm font-medium whitespace-nowrap sm:min-w-0"
            >
              <Link href={link.href}>{link.label}</Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ModeToggle />
    </div>
  );
}
