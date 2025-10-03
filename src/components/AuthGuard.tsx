// components/AuthGuard.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Se não há sessão E o usuário não está na página de autenticação,
      // redireciona para a página de autenticação.
      if (!session && pathname !== "/auth") {
        router.push("/auth");
        return; // Interrompe a execução
      }

      // Se há uma sessão E o usuário está na página de autenticação,
      // redireciona para a página inicial para evitar que ele se logue novamente.
      if (session && pathname === "/auth") {
        router.push("/");
        return; // Interrompe a execução
      }

      // Se nenhuma das condições acima for atendida, para de carregar.
      setLoading(false);
    }

    checkSession();
  }, [pathname, router]);

  // Enquanto a verificação estiver acontecendo, exibe um loader em tela cheia
  // para evitar que o conteúdo da página "pisque" para o usuário.
  if (loading) {
    return (
      <div className="from-background via-background to-muted/30 flex min-h-screen w-full items-center justify-center bg-gradient-to-br">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Se a verificação foi concluída, exibe o conteúdo da página.
  return <>{children}</>;
}
