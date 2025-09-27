"use client";
import { DetailsCard } from "@/components/DetailsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { cn, formatarMoeda } from "@/lib/utils";
import { EntriesCard } from "@/components/EntriesCard";
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
  const [saving, setSaving] = useState(false);

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
  const handleSave = async () => {
    if (!isFormValid || saving) return;
    setSaving(true);

    try {
      console.log("Salvando", { entries, description, totals, date });

      // Monta os lançamentos com debito/credito separados
      const historyEntries = entries.map((entry) => {
        const accountId = accounts.find((a) => a.code === entry.accountId)?.id;
        if (!accountId)
          throw new Error(`Conta não encontrada: ${entry.accountId}`);

        return {
          id: uuid(),
          account_id: accountId,
          debito: entry.type === "debito" ? entry.amount : 0,
          credito: entry.type === "credito" ? entry.amount : 0,
          description: description,
          date: date.toISOString(),
        };
      });

      // Insere no banco
      const { error: insertError } = await supabase
        .from("journal_entries")
        .insert(historyEntries);

      if (insertError) throw insertError;

      resetEntries();

      console.log("Lançamento salvo com sucesso!");
    } catch (err: any) {
      console.error("Erro ao salvar lançamento:", err.message);
    } finally {
      setSaving(false);
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
            disabled={!isFormValid || saving}
            className="flex-1"
          >
            Salvar Lançamento
          </Button>
        </div>
      </div>
    </div>
  );
}
