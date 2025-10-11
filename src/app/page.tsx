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
  PenSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const {
    entries,
    description,
    setDescription,
    date,
    setDate,
    addEntry,
    removeEntry,
    updateEntry,
    resetEntries,
    debitEntries,
    creditEntries,
    totals,
    isBalanced,
    isFormValid,
    validationErrors,
    isAccountDuplicated,
  } = useJournalEntries();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [saving, setSaving] = useState(false);
  // **NOVO ESTADO PARA ARMAZENAR O ID DO USUÁRIO**
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      // **1. BUSCA O USUÁRIO LOGADO**
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        // Lida com o caso em que não há usuário (embora o AuthGuard deva prevenir isso)
        toast.error("Usuário não autenticado.");
        return;
      }

      // **2. BUSCA AS CONTAS DO USUÁRIO (A SEGURANÇA RLS FILTRA AUTOMATICAMENTE)**
      const { data: accountData, error } = await supabase
        .from("accounts")
        .select("*")
        .order("code");

      if (error) {
        console.error("Erro ao buscar contas:", error.message);
        toast.error("Não foi possível carregar as contas");
        return;
      }

      const normalized = normalizeAccounts(accountData ?? []);
      setAccounts(normalized);
    }

    loadInitialData();
  }, []);

  const handleSave = async () => {
    // Garante que temos o ID do usuário antes de salvar
    if (!isFormValid || saving || !userId) return;
    setSaving(true);

    try {
      // **3. ENVIA O USER_ID AO CRIAR A TRANSAÇÃO**
      // O campo transaction_number é omitido, pois o banco de dados cuidará disso.
      const { data: transaction, error: transError } = await supabase
        .from("transactions")
        .insert({ user_id: userId }) // **MUDANÇA ESSENCIAL AQUI**
        .select()
        .single();

      if (transError) throw transError;

      const transactionId = transaction.id;
      const transactionNumber = transaction.transaction_number;

      const historyEntries = entries.map((entry) => {
        const accountId = accounts.find((a) => a.code === entry.accountId)?.id;
        if (!accountId)
          throw new Error(`Conta não encontrada: ${entry.accountId}`);

        return {
          id: uuid(),
          account_id: accountId,
          transaction_id: transactionId,
          debito: entry.type === "debito" ? entry.amount : 0,
          credito: entry.type === "credito" ? entry.amount : 0,
          description: description,
          date: date.toISOString(),
        };
      });

      const { error: insertError } = await supabase
        .from("journal_entries")
        .insert(historyEntries);

      if (insertError) throw insertError;

      toast.success(`Transação #${transactionNumber} salva com sucesso!`);
      resetEntries();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erro ao salvar lançamento:", err.message);
        toast.error("Não foi possível salvar o lançamento");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="from-background via-background to-muted/30 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <div className="bg-card/50 border-border/50 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <PenSquare className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  Lançamentos Contábeis
                </h1>
                <p className="text-muted-foreground mt-1">
                  Registre débitos e créditos com precisão
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground text-sm">Status</div>
              <div
                className={cn(
                  "flex items-center justify-end gap-2 text-sm font-medium",
                  isBalanced ? "text-green-600" : "text-destructive",
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

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
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
              "border-border transition-all duration-300",
              // isBalanced
              //   ? "border-green-600/30 shadow-green-600/5"
              //   : "border-destructive/30 shadow-destructive/5",
            )}
          >
            <CardHeader className="bg-accent -mt-6 rounded-t-xl py-6">
              <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                <div className="text-center md:text-left">
                  <div className="text-muted-foreground mb-1 text-sm font-medium">
                    Total Débitos
                  </div>
                  <div className="flex items-center justify-center gap-2 md:justify-start">
                    <div className="text-foreground text-2xl font-bold tabular-nums">
                      {formatarMoeda(totals.totalDebit)}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                      isBalanced
                        ? "border border-green-600/30 bg-green-600/20 text-green-600"
                        : "border-destructive/30 bg-destructive/20 text-destructive border",
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
                  <div className="text-muted-foreground mt-2 text-xs">
                    Diferença:{" "}
                    {formatarMoeda(
                      Math.abs(totals.totalDebit - totals.totalCredit),
                    )}
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-muted-foreground mb-1 text-sm font-medium">
                    Total Créditos
                  </div>
                  <div className="flex items-center justify-center gap-2 md:justify-end">
                    <div className="text-foreground text-2xl font-bold tabular-nums">
                      {formatarMoeda(totals.totalCredit)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            {validationErrors.length > 0 && (
              <CardContent
                className={cn(
                  "pt-6",
                  validationErrors.length === 0 && "!m-0 !p-0",
                )}
              >
                {/* classes da div abaixo className="border-destructive/20 bg-destructive/5 rounded-lg border p-4" */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <AlertCircle className="text-destructive h-4 w-4" />
                    <h4 className="text-destructive font-medium">
                      Problemas encontrados
                    </h4>
                  </div>
                  <ul className="list-inside list-disc space-y-2">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-destructive text-sm">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              variant="outline"
              onClick={resetEntries}
              className="hover:bg-muted/50 h-12 flex-1 bg-transparent text-base font-medium transition-all duration-200"
            >
              Limpar Formulário
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || saving}
              className={cn(
                "h-12 flex-1 text-base font-medium transition-all duration-200",
                isFormValid && !saving
                  ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
                  : "cursor-not-allowed opacity-50",
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
