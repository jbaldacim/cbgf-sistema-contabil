"use client";
import AccountSelector from "@/components/AccountSelector";
import { getAccountByCode } from "@/lib/contas";
import { supabase } from "@/lib/supabaseClient";
import { JournalEntry } from "@/types";
import { useEffect, useState } from "react";
// import { useState } from "react";

export default function Home() {
  // const [account, setAccount] = useState("");
  const code = "1.0.1";
  const account = getAccountByCode(code);
  const [history, setHistory] = useState<JournalEntry[]>([]);

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
        .eq("account_id", account?.[0].id)
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
    console.log(history);
    console.log(account);
  }, []);

  return (
    <main className="min-h-screen max-w-screen flex justify-center items-start gap-6 bg-muted p-6">
      <article className="flex flex-col justify-center items-start">
        <h1 className="text-center font-bold text-4xl">Livro Razão</h1>
        <div className="flex flex-col">
          {history?.map((entry) => (
            <div className="bg-red h-12">a</div>
          ))}
        </div>
        {/* <AccountSelector value={account} onChange={setAccount} /> */}
      </article>
    </main>
  );
}
