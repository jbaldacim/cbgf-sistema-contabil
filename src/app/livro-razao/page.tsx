"use client";
import AccountSelectorStandalone from "@/components/AccountSelectorStandalone";
import { normalizeAccounts } from "@/lib/normalizers";
import { supabase } from "@/lib/supabaseClient";
import { formatarMoeda } from "@/lib/utils";
import { Account, JournalEntry } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
  // const [account, setAccount] = useState("");
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [code, setCode] = useState("1.0.1");
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data: accounts, error: fetchError } = await supabase
        .from("accounts")
        .select("*")
        .order("code");

      if (fetchError) {
        console.error("Erro ao buscar contas:", fetchError.message);
        return;
      }

      const normalized = normalizeAccounts(accounts ?? []);

      setAccounts(normalized);

      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("code", code);

      if (accountError) {
        console.error("Erro ao buscar contas:", accountError.message);
        return;
      }

      const { data: entries, error: entriesError } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("account_id", account[0].id)
        .order("date");

      if (entriesError) {
        console.error("Erro ao buscar histórico:", entriesError.message);
        return;
      }

      setHistory(entries);
      console.log(entries);
    }

    load();
  }, []);

  useEffect(() => {
    async function load() {
      const { data: account, error: accountError } = await supabase
        .from("accounts")
        .select("id")
        .eq("code", code);

      if (accountError) {
        console.error("Erro ao buscar contas:", accountError.message);
        return;
      }

      const { data: entries, error: entriesError } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("account_id", account[0].id)
        .order("date");

      if (entriesError) {
        console.error("Erro ao buscar histórico:", entriesError.message);
        return;
      }
      setHistory(entries);
    }

    load();
    console.log(history);
    console.log(code);
  }, [code]);

  return (
    <main className="min-h-screen max-w-screen flex justify-center items-start gap-6 bg-muted p-6">
      <article className="flex flex-col justify-center w-full">
        <h1 className="text-center font-bold text-4xl">Livro Razão</h1>
        <div className="flex items-center justify-center">
          <div className="w-[400px]">
            <AccountSelectorStandalone
              value={code}
              onChange={setCode}
              accounts={accounts}
            />
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Débito</th>
              <th>Crédito</th>
            </tr>
          </thead>
          <tbody>
            {history?.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.date}</td>
                <td>{entry.description}</td>
                <td>{formatarMoeda(entry.debito)}</td>
                <td>{formatarMoeda(entry.credito)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </main>
  );
}
