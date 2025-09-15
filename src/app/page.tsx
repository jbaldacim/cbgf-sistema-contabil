// Puxar conta diretamente ao invés de puxar código e chamar função
"use client";
import DescriptionInput from "@/components/DescriptionInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useJournalEntries } from "@/hooks/useJournalEntries";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EntriesCard } from "@/components/EntriesCard";
import { DatePicker } from "@/components/DatePicker";

export default function Home() {
  const {
    // Estado
    entries,

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

  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (isFormValid) {
      console.log("Salvando", { entries, description, totals });
      resetEntries();
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex justify-center gap-6 bg-muted p-6">
      <div className="flex flex-col gap-6 w-full max-w-4xl">
        <DatePicker />
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
        {/* <Card className="">
          <CardHeader className="bg-zinc-300 -mt-6 rounded-t-xl py-4">
            <CardTitle>Crédito</CardTitle>
            <CardDescription className="text-zinc-800">
              Insira aqui as contas a creditar
            </CardDescription>
            <CardAction className="self-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => addEntry("credito")}>
                    <Plus className="size-4 text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar conta</p>
                </TooltipContent>
              </Tooltip>
            </CardAction>
          </CardHeader>

          <CardContent className="flex flex-col gap-2">
            {creditEntries.map((entry, index) => {
              const originalIndex = entries.findIndex((e) => e === entry);
              const duplicated = isAccountDuplicated(entry.accountId);
              return (
                <div
                  key={originalIndex}
                  className="flex gap-2 items-start entry-item starting:opacity-40 transition-all duration-200 ease-in-out opacity-100 starting:-translate-y-20 transition-discrete"
                >
                  <div className="flex-1">
                    <CreditAccountSelector
                      value={entry.accountId}
                      onChange={(value) => {
                        updateEntry(entry.id, "accountId", value);
                        console.log(entry, entry.id, index);
                      }}
                      amount={entry.amount.toString()}
                      onAmountChange={(value) =>
                        updateEntry(entry.id, "amount", parseFloat(value) || 0)
                      }
                      className={cn(
                        isAccountDuplicated(entry.accountId) &&
                          "border-destructive"
                      )}
                    />
                    {duplicated && entry.accountId && (
                      <p className="text-destructive text-xs my-1">
                        Conta duplicada
                      </p>
                    )}
                  </div>
                  {creditEntries.length > 1 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          onClick={() => removeEntry(entry.id)}
                          className={cn(
                            "remove-button",
                            creditEntries.length <= 1 && "hidden"
                          )}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remover conta</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card> */}

        <DescriptionInput value={description} onChange={setDescription} />

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
              <span>
                Total Débitos:{" "}
                <strong>R$ {totals.totalDebit.toFixed(2)}</strong>
              </span>
              <span className="text-center font-bold text-lg text-black">
                {isBalanced
                  ? "✓ Lançamento Balanceado"
                  : "⚠ Lançamento Não Balanceado"}
              </span>
              <span>
                Total Créditos:{" "}
                <strong>R$ {totals.totalCredit.toFixed(2)}</strong>
              </span>
            </div>
            {/* <div className="text-center font-semibold text-black">
              {isBalanced
                ? "✓ Lançamento Balanceado"
                : "⚠ Lançamento Não Balanceado"}
            </div> */}
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
