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
import type { Account } from "@/types";
import { v4 as uuid } from "uuid";
import {
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Modern header with better typography and spacing */}
      <div className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Lançamentos Contábeis
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie débitos e créditos com precisão
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Status</div>
                <div
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium",
                    isBalanced ? "text-success" : "text-destructive"
                  )}
                >
                  {isBalanced ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {isBalanced ? "Balanceado" : "Não Balanceado"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Débitos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Contas a debitar • {formatarMoeda(totals.totalDebit)}
                </p>
              </div>
            </div>
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
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Créditos
                </h2>
                <p className="text-sm text-muted-foreground">
                  Contas a creditar • {formatarMoeda(totals.totalCredit)}
                </p>
              </div>
            </div>
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
          </div>
        </div>

        <div className="space-y-6">
          <DetailsCard
            description={description}
            onDescriptionChange={setDescription}
            date={date}
            onDateChange={setDate}
          />

          <Card
            className={cn(
              "glass-effect transition-all duration-300",
              isBalanced
                ? "border-success/30 shadow-success/5"
                : "border-destructive/30 shadow-destructive/5"
            )}
          >
            <CardHeader
              className={cn(
                "balance-indicator rounded-t-xl transition-all duration-500",
                isBalanced
                  ? "bg-gradient-to-r from-success/10 via-success/5 to-success/10 balanced"
                  : "bg-gradient-to-r from-destructive/10 via-destructive/5 to-destructive/10"
              )}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="text-center md:text-left">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Total Débitos
                  </div>
                  <div className="text-2xl font-bold text-destructive">
                    {formatarMoeda(totals.totalDebit)}
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                      isBalanced
                        ? "bg-success/20 text-success border border-success/30"
                        : "bg-destructive/20 text-destructive border border-destructive/30"
                    )}
                  >
                    {isBalanced ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    {isBalanced
                      ? "Lançamento Balanceado"
                      : "Lançamento Não Balanceado"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Diferença:{" "}
                    {formatarMoeda(
                      Math.abs(totals.totalDebit - totals.totalCredit)
                    )}
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-sm font-medium text-muted-foreground mb-1">
                    Total Créditos
                  </div>
                  <div className="text-2xl font-bold text-success">
                    {formatarMoeda(totals.totalCredit)}
                  </div>
                </div>
              </div>
            </CardHeader>

            {validationErrors.length > 0 && (
              <CardContent className="pt-6">
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <h4 className="font-medium text-destructive">
                      Problemas encontrados
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {validationErrors.map((error, index) => (
                      <li
                        key={index}
                        className="text-sm text-destructive flex items-start gap-2"
                      >
                        <span className="text-destructive/60 mt-1">•</span>
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={resetEntries}
              className="flex-1 h-12 text-base font-medium hover:bg-muted/50 transition-all duration-200 bg-transparent"
            >
              Limpar Formulário
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || saving}
              className={cn(
                "flex-1 h-12 text-base font-medium transition-all duration-200",
                isFormValid
                  ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              {saving ? "Salvando..." : "Salvar Lançamento"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
