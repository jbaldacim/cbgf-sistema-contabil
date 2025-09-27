"use client";
import AccountSelector from "@/components/AccountSelector";
import { getAccountByCode } from "@/lib/contas";
import { useEffect } from "react";
// import { useState } from "react";

export default function Home() {
  // const [account, setAccount] = useState("");
  const account = getAccountByCode("1.0.1");
  const history = account?.history;
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
