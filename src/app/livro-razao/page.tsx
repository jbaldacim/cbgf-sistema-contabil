"use client";
import { normalizeAccounts } from "@/lib/normalizers";
import { supabase } from "@/lib/supabaseClient";
import type { Account } from "@/types";
import { useEffect, useState } from "react";
import { columns } from "@/components/Columns-LivroRazao";
import { DataTable } from "@/components/Data-Table";
import { BookMarked, Loader2 } from "lucide-react";

export default function LivroRazao() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [code, setCode] = useState("1.0.1");
  const [history, setHistory] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const isLoading = isLoadingAccounts || isLoadingHistory;

  useEffect(() => {
    async function loadAccounts() {
      setIsLoadingAccounts(true);
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("code");

      if (error) {
        console.error("Erro ao buscar contas:", error.message);
        return;
      }

      const normalized = normalizeAccounts(data ?? []);
      setAccounts(normalized);
      setIsLoadingAccounts(false);
    }

    loadAccounts();
  }, []);

  useEffect(() => {
    async function loadHistory() {
      const account = accounts.find((a) => a.code === code);
      if (!account) return;

      setIsLoadingHistory(true);

      const { data: entries, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("account_id", account.id)
        .order("date");

      if (error) {
        console.error("Erro ao buscar histórico:", error.message);
        return;
      }

      setHistory(entries ?? []);
      setIsLoadingHistory(false);
    }

    loadHistory();
  }, [code, accounts]);

  return (
    <main className="from-background via-background to-muted/30 min-h-screen bg-gradient-to-br">
      <div className="bg-card/50 border-border/50 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <BookMarked className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-bold tracking-tight">
                Livro Razão
              </h1>
              <p className="text-muted-foreground mt-1">
                Histórico detalhado por conta contábil
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="bg-card border-border flex min-h-[400px] items-center justify-center rounded-xl border shadow-sm">
            <div className="text-muted-foreground flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Carregando dados...</p>
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={history}
            code={code}
            setCode={setCode}
            accounts={accounts}
            isLoading={isLoading}
          />
        )}
      </div>
    </main>
  );
}
