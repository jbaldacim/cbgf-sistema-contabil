"use client";
import { DetailsCard } from "@/components/DetailsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { cn, formatarMoeda } from "@/lib/utils";
import { EntriesCard } from "@/components/EntriesCard";
import { accounts, getAccountByCode } from "@/lib/contas";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { normalizeAccounts } from "@/lib/normalizers";
import { Account } from "@/types";
import { v4 as uuid } from "uuid";

export default function Home() {
  const {
    // Estado
    entries,
    description,
    setDescription,
    date,
    setDate,

    // Manipulação
    addEntry,
    removeEntry,
    updateEntry,
    resetEntries,

    // Listas filtradas
    debitEntries,
    creditEntries,

    // Valores computados
    totals,
    isBalanced,
    isFormValid,

    // Validação
    hasDuplicates,
    duplicateAccounts,
    isAccountDuplicated,
    validationErrors,
  } = useJournalEntries();

  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    async function load() {
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

    load();
  }, []);

  // Fazer modificações de amount e history no banco
  // FIX: Valor sendo adicionado ao saldo é o total do lançamento e não o que entrou na conta
  const handleSave = async () => {
    if (isFormValid) {
      console.log("Salvando", { entries, description, totals, date });

      // Buscar os dados mais recentes do banco e atualizar o estado local
      const { data: freshAccounts, error: fetchError } = await supabase
        .from("accounts")
        .select("*")
        .order("code");

      if (fetchError) {
        console.error("Erro ao buscar contas atualizadas:", fetchError.message);
        return;
      }

      // Normaliza contas
      const normalizedFreshAccounts = normalizeAccounts(freshAccounts ?? []);

      // Atualiza estado
      setAccounts(normalizedFreshAccounts);

      const changedAccounts: {
        id: string;
        balance: number;
      }[] = [];

      const historyEntries: {
        id: string;
        account_id: string;
        amount: number;
        type: "debito" | "credito";
        date: string;
      }[] = [];

      entries.forEach((entry) => {
        const account = normalizedFreshAccounts.find(
          (account) => account.code === entry.accountId
        );

        if (!account) return;

        // Atualizar saldo local
        const newBalance = account.balance + entry.amount;

        changedAccounts.push({
          id: account.id,
          balance: newBalance,
        });

        historyEntries.push({
          id: uuid(),
          account_id: account.id,
          amount: entry.amount,
          type: entry.type,
          date: date.toISOString(),
        });

        console.log(
          `Conta: ${account.codeAndName}\nNovo saldo: ${formatarMoeda(
            newBalance
          )}`
        );
      });

      // Atualizar contas no banco
      const { error: updateError } = await supabase
        .from("accounts")
        .update(changedAccounts.map(({ id, balance }) => ({ balance })))
        .in(
          "id",
          changedAccounts.map(({ id }) => id)
        );

      if (updateError) {
        console.error("Erro ao atualizar contas: ", updateError.message);
        return;
      }

      const { error: insertError } = await supabase
        .from("journal_entries")
        .insert(historyEntries);

      if (insertError) {
        console.error("Erro ao inserir histórico: ", insertError.message);
        return;
      }

      console.log("Lançamento salvo com sucesso!");
      resetEntries();
    }
  };

  return (
    <div className="min-h-screen max-w-screen flex justify-center gap-6 bg-muted p-6">
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <EntriesCard
          type="debito"
          title="Débito"
          description="Insira aqui as contas a debitar"
          entries={debitEntries}
          addEntry={addEntry}
          updateEntry={updateEntry}
          removeEntry={removeEntry}
          isAccountDuplicated={isAccountDuplicated}
          total={totals.totalDebit}
        />
        <EntriesCard
          type="credito"
          title="Crédito"
          description="Insira aqui as contas a creditar"
          entries={creditEntries}
          addEntry={addEntry}
          updateEntry={updateEntry}
          removeEntry={removeEntry}
          isAccountDuplicated={isAccountDuplicated}
          total={totals.totalCredit}
        />
        <DetailsCard
          description={description}
          onDescriptionChange={setDescription}
          date={date}
          onDateChange={setDate}
        />
        <Card className={cn(validationErrors.length === 0 && "pb-0")}>
          {/* TODO: Ajustar header mobile */}
          <CardHeader
            className={cn(
              "bg-zinc-300 -mt-6 rounded-t-xl py-4",
              isBalanced ? "bg-green-500/30" : "bg-red-500/40",
              validationErrors.length === 0 && "rounded-b-xl"
            )}
          >
            <div className="flex justify-between text-sm items-center">
              <span className="text-center">
                Total Débitos:<br></br>
                <strong>{formatarMoeda(totals.totalDebit)}</strong>
              </span>
              <span className="text-center font-bold text-lg text-black">
                {isBalanced
                  ? "Lançamento Balanceado"
                  : "Lançamento Não Balanceado"}
              </span>
              <span className="text-center">
                Total Créditos:<br></br>
                <strong>{formatarMoeda(totals.totalCredit)}</strong>
              </span>
            </div>
          </CardHeader>
          {/* Lista de erros de validação */}
          {validationErrors.length > 0 && (
            <CardContent className="pt-0">
              <h4 className="text-red-800 font-medium text-sm mb-2">
                Problemas encontrados:
              </h4>
              <ul className="text-red-700 text-xs space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </CardContent>
          )}
        </Card>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetEntries} className="flex-1">
            Limpar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid}
            className="flex-1"
          >
            Salvar Lançamento
          </Button>
        </div>
      </div>
    </div>
  );
}
