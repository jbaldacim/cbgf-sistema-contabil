"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerOverlay,
} from "@/components/ui/drawer";
import { EntriesCard } from "@/components/EntriesCard";
import { DetailsCard } from "@/components/DetailsCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { normalizeAccounts } from "@/lib/normalizers";
import { formatarMoeda, cn } from "@/lib/utils";
import type { Account } from "@/types";
import { v4 as uuid } from "uuid";

interface JournalEntryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function JournalEntryModal({
  isOpen,
  onOpenChange,
}: JournalEntryModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
    isAccountDuplicated,
    validationErrors,
  } = useJournalEntries();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadAccounts() {
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .order("code");

      if (error) {
        console.error("Erro ao buscar contas:", error.message);
        return;
      }

      setAccounts(normalizeAccounts(data ?? []));
    }

    if (isOpen) loadAccounts();
  }, [isOpen]);

  const handleSave = async () => {
    if (!isFormValid || saving) return;
    setSaving(true);
    try {
      const { data: transaction, error: transError } = await supabase
        .from("transactions")
        .insert({})
        .select()
        .single();
      if (transError) throw transError;

      const journalEntries = entries.map((entry) => {
        const accountId = accounts.find((a) => a.code === entry.accountId)?.id;
        if (!accountId)
          throw new Error(`Conta não encontrada: ${entry.accountId}`);
        return {
          id: uuid(),
          account_id: accountId,
          transaction_id: transaction.id,
          debito: entry.type === "debito" ? entry.amount : 0,
          credito: entry.type === "credito" ? entry.amount : 0,
          description,
          date: date.toISOString(),
        };
      });

      const { error: insertError } = await supabase
        .from("journal_entries")
        .insert(journalEntries);
      if (insertError) throw insertError;

      resetEntries();
      onOpenChange(false);
    } catch (err: unknown) {
      // CORREÇÃO APLICADA AQUI
      let errorMessage = "Ocorreu um erro desconhecido ao salvar o lançamento.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Erro ao salvar lançamento:", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const ModalContent = () => (
    <div className="grid max-h-[70vh] gap-6 p-1 pr-4">
      <div className="grid grid-cols-1 gap-6">
        <EntriesCard
          type="debito"
          title="Débitos"
          description="Contas a debitar"
          entries={debitEntries}
          addEntry={addEntry}
          updateEntry={updateEntry}
          removeEntry={removeEntry}
          isAccountDuplicated={isAccountDuplicated}
          total={totals.totalDebit}
        />
        <EntriesCard
          type="credito"
          title="Créditos"
          description="Contas a creditar"
          entries={creditEntries}
          addEntry={addEntry}
          updateEntry={updateEntry}
          removeEntry={removeEntry}
          isAccountDuplicated={isAccountDuplicated}
          total={totals.totalCredit}
        />
      </div>

      <DetailsCard
        description={description}
        onDescriptionChange={setDescription}
        date={date}
        onDateChange={setDate}
      />

      <Card className={cn(isBalanced ? "border-green-200" : "border-red-200")}>
        <CardHeader className="flex-row items-center justify-between space-y-0 p-4">
          <div>
            <p className="text-sm font-medium">Balanço da Transação</p>
            <p className="text-muted-foreground text-xs">
              A soma dos débitos deve ser igual à soma dos créditos.
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
              isBalanced
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {isBalanced ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            {isBalanced ? "Balanceado" : "Não Balanceado"}
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4 p-4 pt-0">
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Total Débitos</p>
            <p className="text-destructive text-lg font-bold">
              {formatarMoeda(totals.totalDebit)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Diferença</p>
            <p className="text-lg font-bold">
              {formatarMoeda(Math.abs(totals.totalDebit - totals.totalCredit))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground text-xs">Total Créditos</p>
            <p className="text-success text-lg font-bold">
              {formatarMoeda(totals.totalCredit)}
            </p>
          </div>
        </CardContent>
      </Card>

      {validationErrors.length > 0 && (
        <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-4">
          <h4 className="text-destructive mb-2 flex items-center gap-2 text-sm font-semibold">
            <AlertCircle size={16} /> Problemas Encontrados
          </h4>
          <ul className="text-destructive list-disc pl-5 text-sm">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const FooterButtons = (
    <>
      <Button variant="ghost" onClick={resetEntries}>
        Limpar Formulário
      </Button>
      <Button onClick={handleSave} disabled={!isFormValid || saving}>
        {saving ? "Salvando..." : "Salvar Lançamento"}
      </Button>
    </>
  );

  return isDesktop ? (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="xs:max-w-none w-[80vw] max-w-none sm:max-w-none">
        <DialogHeader>
          <DialogTitle>Novo Lançamento Contábil</DialogTitle>
          <DialogDescription>
            Insira as informações de débito e crédito para registrar a
            transação.
          </DialogDescription>
        </DialogHeader>

        <ModalContent />

        <DialogFooter className="pt-4">{FooterButtons}</DialogFooter>
      </DialogContent>
    </Dialog>
  ) : (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerOverlay />
      <DrawerContent className="w-full max-w-none">
        <DrawerHeader>
          <DrawerTitle>Novo Lançamento Contábil</DrawerTitle>
          <DrawerDescription>
            Insira as informações de débito e crédito para registrar a
            transação.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4">
          <ModalContent />
        </div>

        <DrawerFooter className="flex justify-between gap-2">
          <Button variant="ghost" onClick={resetEntries} className="w-full">
            Limpar Formulário
          </Button>

          <DrawerClose asChild>
            <Button
              onClick={handleSave}
              disabled={!isFormValid || saving}
              className="w-full"
            >
              {saving ? "Salvando..." : "Salvar Lançamento"}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
