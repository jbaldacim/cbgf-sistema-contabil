import { Account } from "@/types";

export function normalizeAccounts(data: any[]): Account[] {
  return (data ?? []).map((a) => ({
    id: a.id,
    code: a.code,
    name: a.name,
    accountGroup: a.account_group, // converte snake_case -> camelCase
    subgroup1: a.subgroup1,
    subgroup2: a.subgroup2,
    codeAndName: `${a.code} - ${a.name}`,
    balance: a.balance,
    history: [], // se não está buscando lançamentos agora
  }));
}
