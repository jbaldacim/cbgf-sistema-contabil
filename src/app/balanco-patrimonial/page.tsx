"use client";
import { normalizeAccounts } from "@/lib/normalizers";
import type React from "react";

import { supabase } from "@/lib/supabaseClient";
import { formatarMoeda } from "@/lib/utils";
import type { Account } from "@/types";
import { useEffect, useState } from "react";
import { calculateBalanceSheet } from "@/lib/balanceSheet";
import { CalendarIcon, Loader2, Scale } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// 1. DEFINIÇÃO DOS TIPOS PARA O BALANÇO PATRIMONIAL
interface BalanceSheetAccount {
  code: string;
  name: string;
  balance: number;
}

interface BalanceSheetSection {
  accounts: BalanceSheetAccount[];
  total: number;
}

interface AtivoNaoCirculante {
  realizavelLongoPrazo: BalanceSheetSection;
  investimentos: BalanceSheetSection;
  imobilizado: BalanceSheetSection;
  intangivel: BalanceSheetSection;
}

interface Ativo {
  circulante: BalanceSheetSection;
  naoCirculante: AtivoNaoCirculante;
  total: number;
}

interface Passivo {
  circulante: BalanceSheetSection;
  naoCirculante: BalanceSheetSection;
  total: number;
}

interface BalanceSheet {
  ativo: Ativo;
  passivo: Passivo;
  patrimonioLiquido: BalanceSheetSection;
}

export default function BalancoPatrimonial() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // 2. APLICAÇÃO DO TIPO CORRETO NO ESTADO
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
  });

  useEffect(() => {
    async function loadData() {
      if (!dateRange?.from || !dateRange?.to) return;

      setIsLoading(true);

      const { data: accountsData, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .order("code");

      if (accountsError) {
        console.error("Erro ao buscar contas:", accountsError.message);
        setIsLoading(false);
        return;
      }

      const { data: entries, error: entriesError } = await supabase
        .from("journal_entries")
        .select("*")
        .gte("date", dateRange.from.toISOString())
        .lte("date", dateRange.to.toISOString());

      if (entriesError) {
        console.error("Erro ao buscar lançamentos:", entriesError.message);
        setIsLoading(false);
        return;
      }

      const accountsWithBalance = (accountsData ?? []).map((account) => {
        const accountEntries =
          entries?.filter((e) => e.account_id === account.id) ?? [];

        let balance = 0;
        accountEntries.forEach((entry) => {
          const debito = Number(entry.debito) || 0;
          const credito = Number(entry.credito) || 0;

          if (
            account.account_group === "Ativo" ||
            account.account_group === "Despesas"
          ) {
            balance += debito - credito;
          } else if (
            account.account_group === "Passivo" ||
            account.account_group === "Patrimônio Líquido" ||
            account.account_group === "Receitas"
          ) {
            balance += credito - debito;
          }
        });

        return {
          ...account,
          balance,
        };
      });

      const normalized = normalizeAccounts(accountsWithBalance);
      setAccounts(normalized);

      const balance = calculateBalanceSheet(normalized, dateRange.to);
      setBalanceSheet(balance);

      setIsLoading(false);
    }

    loadData();
  }, [dateRange]);

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="mb-4 text-lg font-bold">{children}</h3>
  );

  const SubsectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h4 className="text-muted-foreground mt-4 mb-2 text-sm font-semibold tracking-wide uppercase">
      {children}
    </h4>
  );

  const AccountLine = ({
    code,
    name,
    balance,
    indent = false,
  }: {
    code: string;
    name: string;
    balance: number;
    indent?: boolean;
  }) => (
    <div
      className={`hover:bg-muted/50 flex justify-between rounded-md py-2 transition-colors ${indent ? "pl-6" : "pl-2"}`}
    >
      <span className="text-sm">
        <span className="text-muted-foreground font-mono">{code}</span>
        <span className="ml-2">{name}</span>
      </span>
      <span className="text-sm font-medium tabular-nums">
        {formatarMoeda(balance)}
      </span>
    </div>
  );

  const TotalLine = ({
    label,
    value,
    bold = false,
    className = "",
  }: {
    label: string;
    value: number;
    bold?: boolean;
    className?: string;
  }) => (
    <div
      className={`border-border mt-3 flex justify-between border-t pt-3 ${className} ${
        bold ? "text-base font-bold" : "font-semibold"
      }`}
    >
      <span>{label}</span>
      <span className="tabular-nums">{formatarMoeda(value)}</span>
    </div>
  );

  return (
    <main className="from-background via-background to-muted/30 min-h-screen bg-gradient-to-br">
      <div className="bg-card/50 border-border/50 border-b backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <Scale className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  Balanço Patrimonial
                </h1>
                <p className="text-muted-foreground mt-1">
                  Demonstração da posição financeira e patrimonial
                </p>
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal sm:w-[300px]",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy", {
                          locale: ptBR,
                        })}{" "}
                        - {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                    )
                  ) : (
                    <span>Selecione o período</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  locale={ptBR}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {isLoading ? (
          <div className="bg-card border-border flex min-h-[400px] items-center justify-center rounded-xl border shadow-sm">
            <div className="text-muted-foreground flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm font-medium">
                Carregando balanço patrimonial...
              </p>
            </div>
          </div>
        ) : !balanceSheet ? (
          <div className="bg-card border-border flex min-h-[400px] items-center justify-center rounded-xl border shadow-sm">
            <p className="text-muted-foreground">
              Selecione um período para visualizar o balanço
            </p>
          </div>
        ) : (
          <>
            <div className="bg-primary/10 border-primary/20 mb-6 rounded-lg border p-4 text-center">
              <p className="text-muted-foreground text-lg font-medium">
                Posição de{" "}
                <span className="text-foreground font-semibold">
                  {format(
                    dateRange?.from || new Date(),
                    "dd 'de' MMMM 'de' yyyy",
                    {
                      locale: ptBR,
                    },
                  )}
                </span>{" "}
                até{" "}
                <span className="text-foreground font-semibold">
                  {format(
                    dateRange?.to || new Date(),
                    "dd 'de' MMMM 'de' yyyy",
                    {
                      locale: ptBR,
                    },
                  )}
                </span>
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* ATIVO */}
              <div className="bg-card border-border rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
                <SectionTitle>ATIVO</SectionTitle>

                <SubsectionTitle>Circulante</SubsectionTitle>
                {balanceSheet.ativo.circulante.accounts.map(
                  (
                    acc: BalanceSheetAccount, // 3. TIPO APLICADO NO MAP
                  ) => (
                    <AccountLine key={acc.code} {...acc} indent />
                  ),
                )}
                <TotalLine
                  label="Total Ativo Circulante"
                  value={balanceSheet.ativo.circulante.total}
                />

                <SubsectionTitle>Não Circulante</SubsectionTitle>

                {balanceSheet.ativo.naoCirculante.realizavelLongoPrazo.accounts
                  .length > 0 && (
                  <>
                    <p className="text-muted-foreground mt-2 pl-2 text-xs font-medium">
                      Realizável a Longo Prazo
                    </p>
                    {balanceSheet.ativo.naoCirculante.realizavelLongoPrazo.accounts.map(
                      (acc: BalanceSheetAccount) => (
                        <AccountLine key={acc.code} {...acc} indent />
                      ),
                    )}
                  </>
                )}

                {balanceSheet.ativo.naoCirculante.investimentos.accounts
                  .length > 0 && (
                  <>
                    <p className="text-muted-foreground mt-2 pl-2 text-xs font-medium">
                      Investimentos
                    </p>
                    {balanceSheet.ativo.naoCirculante.investimentos.accounts.map(
                      (acc: BalanceSheetAccount) => (
                        <AccountLine key={acc.code} {...acc} indent />
                      ),
                    )}
                  </>
                )}

                {balanceSheet.ativo.naoCirculante.imobilizado.accounts.length >
                  0 && (
                  <>
                    <p className="text-muted-foreground mt-2 pl-2 text-xs font-medium">
                      Imobilizado
                    </p>
                    {balanceSheet.ativo.naoCirculante.imobilizado.accounts.map(
                      (acc: BalanceSheetAccount) => (
                        <AccountLine key={acc.code} {...acc} indent />
                      ),
                    )}
                  </>
                )}

                {balanceSheet.ativo.naoCirculante.intangivel.accounts.length >
                  0 && (
                  <>
                    <p className="text-muted-foreground mt-2 pl-2 text-xs font-medium">
                      Intangível
                    </p>
                    {balanceSheet.ativo.naoCirculante.intangivel.accounts.map(
                      (acc: BalanceSheetAccount) => (
                        <AccountLine key={acc.code} {...acc} indent />
                      ),
                    )}
                  </>
                )}

                <TotalLine
                  label="Total Ativo"
                  value={balanceSheet.ativo.total}
                  bold
                />
              </div>

              {/* PASSIVO + PL */}
              <div className="bg-card border-border rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md">
                <SectionTitle>PASSIVO</SectionTitle>

                <SubsectionTitle>Circulante</SubsectionTitle>
                {balanceSheet.passivo.circulante.accounts.map(
                  (acc: BalanceSheetAccount) => (
                    <AccountLine key={acc.code} {...acc} indent />
                  ),
                )}
                <TotalLine
                  label="Total Passivo Circulante"
                  value={balanceSheet.passivo.circulante.total}
                />

                <SubsectionTitle>Não Circulante</SubsectionTitle>
                {balanceSheet.passivo.naoCirculante.accounts.map(
                  (acc: BalanceSheetAccount) => (
                    <AccountLine key={acc.code} {...acc} indent />
                  ),
                )}
                <TotalLine
                  label="Total Passivo Não Circulante"
                  value={balanceSheet.passivo.naoCirculante.total}
                />

                <TotalLine
                  label="Total Passivo"
                  value={balanceSheet.passivo.total}
                />

                <SectionTitle>PATRIMÔNIO LÍQUIDO</SectionTitle>
                {balanceSheet.patrimonioLiquido.accounts.map(
                  (acc: BalanceSheetAccount) => (
                    <AccountLine key={acc.code} {...acc} indent />
                  ),
                )}
                <TotalLine
                  label="Total Patrimônio Líquido"
                  value={balanceSheet.patrimonioLiquido.total}
                  bold
                />

                <div className="bg-primary/5 border-primary/20 mt-4 rounded-lg border p-4">
                  <TotalLine
                    label="Total Passivo + PL"
                    value={
                      balanceSheet.passivo.total +
                      balanceSheet.patrimonioLiquido.total
                    }
                    bold
                    className="!mt-0 !border-t-0 !pt-0"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
