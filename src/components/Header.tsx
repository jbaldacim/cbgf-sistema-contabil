// components/Header.tsx

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { UserMenu } from "./UserMenu";
import Link from "next/link";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/", label: "Lançamentos" },
  { href: "/livro-diario", label: "Livro Diário" },
  { href: "/livro-razao", label: "Livro Razão" },
  { href: "/balanco-patrimonial", label: "Balanço Patrimonial" },
  { href: "/gerenciar-contas", label: "Gerenciar Contas" },
];

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- LÓGICA CORRIGIDA AQUI ---
    // Usamos onAuthStateChange para ouvir o status do login de forma confiável.
    // Ele nos informa assim que a sessão do usuário é carregada.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Esta função "limpa" o listener quando o componente é desmontado,
    // o que é uma boa prática para evitar vazamentos de memória.
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Mantemos a lógica de não renderizar nada enquanto carrega ou se não houver usuário.
  if (loading || !user) {
    return null;
  }

  // Renderiza o header completo apenas se o usuário existir.
  return (
    <header className="bg-card/50 border-border/50 sticky top-0 z-20 border-b backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <nav className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} passHref>
                <Button variant="ghost">{link.label}</Button>
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <UserMenu displayName={user.user_metadata.display_name} />
        </div>
      </div>
    </header>
  );
}
