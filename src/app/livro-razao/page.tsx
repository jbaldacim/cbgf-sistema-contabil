"use client";
import AccountSelectorStandalone from "@/components/AccountSelectorStandalone";
import { normalizeAccounts } from "@/lib/normalizers";
import { supabase } from "@/lib/supabaseClient";
import { formatarMoeda } from "@/lib/utils";
import { Account } from "@/types";
import { useEffect, useState } from "react";

import { columns, Entry } from "@/components/Columns";
import { DataTable } from "@/components/Data-Table";

export default function Home() {
  // const [account, setAccount] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [code, setCode] = useState("1.0.1");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Carrega contas apenas no mount
    async function loadAccounts() {
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
    }

    loadAccounts();
  }, []);

  useEffect(() => {
    // Carrega histórico sempre que 'code' muda
    async function loadHistory() {
      const account = accounts.find((a) => a.code === code);
      if (!account) return;

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
    }

    loadHistory();
  }, [code, accounts]);

  return (
    <main className="min-h-screen max-w-screen flex justify-center items-start gap-6 bg-muted p-6">
      <article className="flex flex-col justify-center w-full">
        <h1 className="text-center font-bold text-4xl">Livro Razão</h1>
        {/* <div className="flex items-center justify-center">
          <div className="w-[400px]">
            <AccountSelectorStandalone
              value={code}
              onChange={setCode}
              accounts={accounts}
            />
          </div>
        </div> */}
        <DataTable
          columns={columns}
          data={history}
          code={code}
          setCode={setCode}
          accounts={accounts}
        />
      </article>
    </main>
  );
}
