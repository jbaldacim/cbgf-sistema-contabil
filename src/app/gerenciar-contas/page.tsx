"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { normalizeAccounts } from "@/lib/normalizers";
import { Account } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Plus, Trash2, FolderTree } from "lucide-react";
import AccountSelectorStandalone from "@/components/AccountSelectorStandalone";
import { DeleteAccountModal } from "@/components/DeleteAccountModal";
import { toast } from "sonner";

export default function GerenciarContas() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado para adicionar conta
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountGroup, setNewAccountGroup] = useState<string>("");
  const [newAccountSubgroup1, setNewAccountSubgroup1] = useState("");
  const [newAccountSubgroup2, setNewAccountSubgroup2] = useState("");

  // Estado para remover conta
  const [selectedAccountToDelete, setSelectedAccountToDelete] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Opções de grupos e subgrupos
  const accountGroups = [
    "Ativo",
    "Passivo",
    "Patrimônio Líquido",
    "Receitas",
    "Despesas",
  ];

  const subgroup1Options: Record<string, string[]> = {
    Ativo: ["Ativo Circulante", "Ativo Não Circulante"],
    Passivo: ["Passivo Circulante", "Passivo Não Circulante"],
    "Patrimônio Líquido": [],
    Receitas: [],
    Despesas: [],
  };

  const subgroup2Options: Record<string, string[]> = {
    "Ativo Não Circulante": [
      "Realizável a Longo Prazo",
      "Investimentos",
      "Imobilizado",
      "Intangível",
    ],
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .order("code");

    if (error) {
      console.error("Erro ao buscar contas:", error.message);
      toast.error("Não foi possível carregar as contas");
      setIsLoading(false);
      return;
    }

    const normalized = normalizeAccounts(data ?? []);
    setAccounts(normalized);
    setIsLoading(false);
  }

  // Gera o próximo código baseado no grupo
  function generateNextCode(
    group: string,
    subgroup1: string,
    subgroup2: string,
  ): string {
    // Determina o prefixo baseado no grupo principal
    let prefix = "";
    if (group === "Ativo") {
      if (subgroup1 === "Ativo Circulante") prefix = "1.0";
      else if (subgroup1 === "Ativo Não Circulante") {
        if (subgroup2 === "Realizável a Longo Prazo") prefix = "2.0";
        else if (subgroup2 === "Investimentos") prefix = "2.1";
        else if (subgroup2 === "Imobilizado") prefix = "2.2";
        else if (subgroup2 === "Intangível") prefix = "2.3";
      }
    } else if (group === "Passivo") {
      if (subgroup1 === "Passivo Circulante") prefix = "3.0";
      else if (subgroup1 === "Passivo Não Circulante") prefix = "3.1";
    } else if (group === "Patrimônio Líquido") {
      prefix = "4.0";
    } else if (group === "Despesas") {
      prefix = "5";
    } else if (group === "Receitas") {
      prefix = "6.0";
    }

    // Busca contas com o mesmo prefixo
    const similarAccounts = accounts.filter((a) => a.code.startsWith(prefix));

    if (similarAccounts.length === 0) {
      return `${prefix}.1`;
    }

    // Pega o último número e incrementa
    const lastCode = similarAccounts[similarAccounts.length - 1].code;
    const lastNumber = parseInt(lastCode.split(".").pop() || "0");
    return `${prefix}.${lastNumber + 1}`;
  }

  async function handleAddAccount() {
    if (!newAccountName || !newAccountGroup) {
      toast.error("Preencha nome e grupo da conta");
      return;
    }

    // Valida subgrupos obrigatórios
    if (newAccountGroup === "Ativo" || newAccountGroup === "Passivo") {
      if (!newAccountSubgroup1) {
        toast.error("Selecione o subgrupo 1");
        return;
      }
    }

    if (
      newAccountSubgroup1 === "Ativo Não Circulante" &&
      !newAccountSubgroup2
    ) {
      toast.error("Selecione o subgrupo 2");
      return;
    }

    setIsSubmitting(true);

    try {
      const code = generateNextCode(
        newAccountGroup,
        newAccountSubgroup1,
        newAccountSubgroup2,
      );

      const { error } = await supabase.from("accounts").insert({
        code,
        name: newAccountName,
        account_group: newAccountGroup,
        subgroup1: newAccountSubgroup1 || "",
        subgroup2: newAccountSubgroup2 || "",
        code_and_name: `${code} - ${newAccountName}`,
        balance: 0,
      });

      if (error) throw error;

      toast.success(`Conta ${code} criada com sucesso!`);

      // Limpa o formulário
      setNewAccountName("");
      setNewAccountGroup("");
      setNewAccountSubgroup1("");
      setNewAccountSubgroup2("");

      // Recarrega contas
      await loadAccounts();
    } catch (err: any) {
      console.error("Erro ao adicionar conta:", err.message);
      toast.error("Não foi possível adicionar a conta");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteAccount() {
    const account = accounts.find((a) => a.code === selectedAccountToDelete);
    if (!account) return;

    setIsSubmitting(true);

    try {
      // Verifica se há transações vinculadas
      const { data: entries, error: checkError } = await supabase
        .from("journal_entries")
        .select("id")
        .eq("account_id", account.id)
        .limit(1);

      if (checkError) throw checkError;

      if (entries && entries.length > 0) {
        toast.error(
          "Esta conta possui transações vinculadas e não pode ser removida",
        );
        setIsSubmitting(false);
        setIsDeleteModalOpen(false);
        return;
      }

      // Deleta a conta
      const { error: deleteError } = await supabase
        .from("accounts")
        .delete()
        .eq("id", account.id);

      if (deleteError) throw deleteError;

      toast.success(`Conta ${account.codeAndName} foi removida com sucesso`);

      setSelectedAccountToDelete("");
      setIsDeleteModalOpen(false);
      await loadAccounts();
    } catch (err: any) {
      console.error("Erro ao remover conta:", err.message);
      toast.error("Não foi possível remover a conta");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="from-background via-background to-muted/30 min-h-screen bg-gradient-to-br">
      {/* Header */}
      <div className="bg-card/50 border-border/50 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <FolderTree className="text-primary h-6 w-6" />
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-bold tracking-tight">
                Gerenciar Contas
              </h1>
              <p className="text-muted-foreground mt-1">
                Adicione ou remova contas do plano de contas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="bg-card border-border flex min-h-[400px] items-center justify-center rounded-xl border shadow-sm">
            <div className="text-muted-foreground flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">Carregando contas...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Adicionar Conta */}
              <Card className="border-border shadow-sm transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Adicionar Conta
                  </CardTitle>
                  <CardDescription>
                    Crie uma nova conta contábil. O código será gerado
                    automaticamente.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Nome da Conta *</Label>
                    <Input
                      id="account-name"
                      placeholder="Ex: Caixa Pequeno"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-group">Grupo *</Label>
                    <Select
                      value={newAccountGroup}
                      onValueChange={(value) => {
                        setNewAccountGroup(value);
                        setNewAccountSubgroup1("");
                        setNewAccountSubgroup2("");
                      }}
                    >
                      <SelectTrigger id="account-group">
                        <SelectValue placeholder="Selecione o grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {newAccountGroup &&
                    subgroup1Options[newAccountGroup]?.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="subgroup1">Subgrupo 1 *</Label>
                        <Select
                          value={newAccountSubgroup1}
                          onValueChange={(value) => {
                            setNewAccountSubgroup1(value);
                            setNewAccountSubgroup2("");
                          }}
                        >
                          <SelectTrigger id="subgroup1">
                            <SelectValue placeholder="Selecione o subgrupo 1" />
                          </SelectTrigger>
                          <SelectContent>
                            {subgroup1Options[newAccountGroup].map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  {newAccountSubgroup1 &&
                    subgroup2Options[newAccountSubgroup1]?.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="subgroup2">Subgrupo 2 *</Label>
                        <Select
                          value={newAccountSubgroup2}
                          onValueChange={setNewAccountSubgroup2}
                        >
                          <SelectTrigger id="subgroup2">
                            <SelectValue placeholder="Selecione o subgrupo 2" />
                          </SelectTrigger>
                          <SelectContent>
                            {subgroup2Options[newAccountSubgroup1].map(
                              (sub) => (
                                <SelectItem key={sub} value={sub}>
                                  {sub}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                  {newAccountGroup && newAccountName && (
                    <div className="bg-muted/50 border-border rounded-lg border p-3">
                      <p className="text-muted-foreground text-sm">
                        Código que será gerado:
                      </p>
                      <p className="mt-1 font-mono font-semibold">
                        {generateNextCode(
                          newAccountGroup,
                          newAccountSubgroup1,
                          newAccountSubgroup2,
                        )}{" "}
                        - {newAccountName}
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleAddAccount}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adicionando...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Conta
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Remover Conta */}
              <Card className="border-border shadow-sm transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Remover Conta
                  </CardTitle>
                  <CardDescription>
                    Selecione uma conta para remover. Contas com transações não
                    podem ser removidas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Conta a Remover</Label>
                    <AccountSelectorStandalone
                      value={selectedAccountToDelete}
                      onChange={setSelectedAccountToDelete}
                      accounts={accounts}
                      placeholder="Selecione a conta"
                    />
                  </div>

                  {selectedAccountToDelete && (
                    <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-3">
                      <p className="text-destructive text-sm">
                        Esta ação não pode ser desfeita. A conta será removida
                        permanentemente.
                      </p>
                    </div>
                  )}

                  <Button
                    variant="destructive"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={!selectedAccountToDelete || isSubmitting}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover Conta
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Contas */}
            <Card className="border-border mt-6 shadow-sm">
              <CardHeader>
                <CardTitle>Contas Cadastradas ({accounts.length})</CardTitle>
                <CardDescription>
                  Lista de todas as contas contábeis no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-[400px] overflow-y-auto">
                  <div className="space-y-1">
                    {accounts.map((account) => (
                      <div
                        key={account.id}
                        className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 text-sm transition-colors"
                      >
                        <span className="font-mono">{account.codeAndName}</span>
                        <span className="text-muted-foreground text-xs">
                          {account.accountGroup}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        accountName={
          accounts.find((a) => a.code === selectedAccountToDelete)
            ?.codeAndName || ""
        }
      />
    </main>
  );
}
