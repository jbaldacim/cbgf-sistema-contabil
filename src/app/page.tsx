// Puxar conta diretamente ao invés de puxar código e chamar função
"use client";
import CreditAccountSelector from "@/components/CreditAccountSelector";
import DebitAccountSelector from "@/components/DebitAccountSelector";
import DescriptionInput from "@/components/DescriptionInput";
import { getAccountByCode } from "@/lib/contas";
import { useState } from "react";

export default function Home() {
  const [debitAccount, setDebitAccount] = useState("");
  const [creditAccount, setCreditAccount] = useState("");
  const [description, setDescription] = useState("");

  return (
    //  bg-zinc-900
    <div className="h-screen w-screen flex flex justify-center gap-6 bg-muted p-6">
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <DebitAccountSelector value={debitAccount} onChange={setDebitAccount} />
        <CreditAccountSelector
          value={creditAccount}
          onChange={setCreditAccount}
        />
        <DescriptionInput value={description} onChange={setDescription} />
      </div>
      {/* <div className="border-l-2 border-white pl-2">
        <p>
          <span className="font-bold">Nome: </span>
          {getAccountByCode(debitAccount)?.name}
        </p>
        <p>
          <span className="font-bold">Código: </span>
          {getAccountByCode(debitAccount)?.code}
        </p>
        <p>
          <span className="font-bold">Grupo Contábil: </span>
          {getAccountByCode(debitAccount)?.accountGroup}
        </p>
        <p>
          <span className="font-bold">Subgrupo 1: </span>
          {getAccountByCode(debitAccount)?.subgroup1}
        </p>
        <p>
          <span className="font-bold">Subgrupo 2: </span>
          {getAccountByCode(debitAccount)?.subgroup2}
        </p>
        <p>
          <span className="font-bold">Código e Nome: </span>
          {getAccountByCode(debitAccount)?.codeAndName}
        </p>
      </div> */}
    </div>
  );
}
