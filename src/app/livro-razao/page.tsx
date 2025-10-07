"use client";
import { normalizeAccounts } from "@/lib/normalizers";
import { supabase } from "@/lib/supabaseClient";
import type { Account } from "@/types";
import { useEffect, useState } from "react";
// 1. IMPORTANDO O TIPO 'Entry' DIRETAMENTE DO ARQUIVO DE COLUNAS
import { columns, type Entry } from "@/components/Columns-LivroRazao";
import { DataTable } from "@/components/Data-Table";
import { BookMarked } from "lucide-react";

export default function LivroRazao() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [code, setCode] = useState("1.0.1");
  // 2. O ESTADO AGORA USA O TIPO 'Entry' IMPORTADO
  const [history, setHistory] = useState<Entry[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const isLoading = isLoadingAccounts || isLoadingHistory;

  type FetchedEntry = {
    id: string;
    date: string;
    description: string;
    debito: number;
    credito: number;
    account_id: string;
    transaction_id: string;
    accounts: { code_and_name: string } | null;
  };

  useEffect(() => {
    async function loadAccounts() {
      setIsLoadingAccounts(true);
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("code");

      if (error) {
        console.error("Erro ao buscar contas:", error.message);
        setIsLoadingAccounts(false);
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
      const selectedAccount = accounts.find((a) => a.code === code);
      if (!selectedAccount || accounts.length === 0) return;

      setIsLoadingHistory(true);

      const { data: transactionIdsData, error: txIdError } = await supabase
        .from("journal_entries")
        .select("transaction_id")
        .eq("account_id", selectedAccount.id);

      if (txIdError) {
        // ... tratamento de erro
        return;
      }

      const transactionIds = transactionIdsData.map((t) => t.transaction_id);

      if (transactionIds.length === 0) {
        setHistory([]);
        setIsLoadingHistory(false);
        return;
      }

      const { data: allEntries, error: entriesError } = await supabase
        .from("journal_entries")
        .select("*, accounts(code_and_name)")
        .in("transaction_id", transactionIds)
        .order("date");

      if (entriesError) {
        // ... tratamento de erro
        return;
      }

      const entriesByTransaction = allEntries.reduce(
        (acc, entry) => {
          const key = entry.transaction_id;
          if (!acc[key]) acc[key] = [];
          acc[key].push(entry);
          return acc;
        },
        {} as Record<string, typeof allEntries>,
      );

      const finalHistory: Entry[] = [];

      for (const transactionId in entriesByTransaction) {
        const transactionEntries = entriesByTransaction[transactionId];

        // CORREÇÃO APLICADA AQUI
        const mainEntry = transactionEntries.find(
          (e: FetchedEntry) => e.account_id === selectedAccount.id,
        );

        // E AQUI
        const contraEntry = transactionEntries.find(
          (e: FetchedEntry) => e.account_id !== selectedAccount.id,
        );

        if (mainEntry) {
          finalHistory.push({
            date: new Date(mainEntry.date),
            description: mainEntry.description,
            debito: mainEntry.debito,
            credito: mainEntry.credito,
            accountCodeAndName:
              contraEntry?.accounts?.code_and_name ||
              "Contrapartida não encontrada",
          });
        }
      }

      setHistory(finalHistory);
      setIsLoadingHistory(false);
    }

    loadHistory();
  }, [code, accounts]);

  return (
    // Seu JSX permanece o mesmo e agora funcionará sem erros de tipo
    <main className="from-background via-background to-muted/30 min-h-screen bg-gradient-to-br">
      <div className="bg-card/50 border-border/50 border-b backdrop-blur-sm">
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
        <DataTable
          columns={columns}
          data={history}
          code={code}
          setCode={setCode}
          accounts={accounts}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
