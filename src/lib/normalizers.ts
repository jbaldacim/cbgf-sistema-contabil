import { Account } from "@/types";

// Interface para descrever a estrutura do dado vindo diretamente do Supabase
interface RawAccount {
  id: string;
  code: string;
  name: string;
  account_group: string; // Mantém o padrão snake_case do banco
  subgroup1: string | null;
  subgroup2: string | null;
  balance: number;
}

// A função agora espera um array de RawAccount
export function normalizeAccounts(data: RawAccount[]): Account[] {
  return (data ?? []).map((a) => ({
    id: a.id,
    code: a.code,
    name: a.name,
    accountGroup: a.account_group,
    // CORREÇÃO APLICADA AQUI:
    // Converte qualquer valor nulo para uma string vazia
    subgroup1: a.subgroup1 ?? "",
    subgroup2: a.subgroup2 ?? "",
    codeAndName: `${a.code} - ${a.name}`,
    balance: a.balance,
    history: [],
  }));
}
