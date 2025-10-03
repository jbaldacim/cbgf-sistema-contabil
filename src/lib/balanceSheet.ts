// lib/balanceSheet.ts
import { Account, BalanceSheet } from "@/types";

export function calculateBalanceSheet(
  accounts: Account[],
  referenceDate?: Date,
): BalanceSheet {
  const date = referenceDate || new Date();

  // Função helper para calcular saldo de um grupo
  const getAccountsByGroup = (
    accountGroup: string,
    subgroup1?: string,
    subgroup2?: string,
  ) => {
    return accounts
      .filter((a) => {
        if (subgroup2) {
          return (
            a.accountGroup === accountGroup &&
            a.subgroup1 === subgroup1 &&
            a.subgroup2 === subgroup2
          );
        }
        if (subgroup1) {
          return a.accountGroup === accountGroup && a.subgroup1 === subgroup1;
        }
        return a.accountGroup === accountGroup;
      })
      .map((a) => ({
        code: a.code,
        name: a.name,
        balance: a.balance,
      }));
  };

  const sumBalances = (
    accounts: { code: string; name: string; balance: number }[],
  ) => {
    return accounts.reduce((sum, acc) => sum + acc.balance, 0);
  };

  // ATIVO CIRCULANTE
  const ativoCirculante = getAccountsByGroup("Ativo", "Ativo Circulante");
  const totalAtivoCirculante = sumBalances(ativoCirculante);

  // ATIVO NÃO CIRCULANTE
  const realizavelLongoPrazo = getAccountsByGroup(
    "Ativo",
    "Ativo Não Circulante",
    "Realizável a Longo Prazo",
  );
  const investimentos = getAccountsByGroup(
    "Ativo",
    "Ativo Não Circulante",
    "Investimentos",
  );
  const imobilizado = getAccountsByGroup(
    "Ativo",
    "Ativo Não Circulante",
    "Imobilizado",
  );
  const intangivel = getAccountsByGroup(
    "Ativo",
    "Ativo Não Circulante",
    "Intangível",
  );

  const totalRealizavelLP = sumBalances(realizavelLongoPrazo);
  const totalInvestimentos = sumBalances(investimentos);
  const totalImobilizado = sumBalances(imobilizado);
  const totalIntangivel = sumBalances(intangivel);
  const totalAtivoNaoCirculante =
    totalRealizavelLP + totalInvestimentos + totalImobilizado + totalIntangivel;

  const totalAtivo = totalAtivoCirculante + totalAtivoNaoCirculante;

  // PASSIVO CIRCULANTE
  const passivoCirculante = getAccountsByGroup("Passivo", "Passivo Circulante");
  const totalPassivoCirculante = sumBalances(passivoCirculante);

  // PASSIVO NÃO CIRCULANTE
  const passivoNaoCirculante = getAccountsByGroup(
    "Passivo",
    "Passivo Não Circulante",
  );
  const totalPassivoNaoCirculante = sumBalances(passivoNaoCirculante);

  const totalPassivo = totalPassivoCirculante + totalPassivoNaoCirculante;

  // PATRIMÔNIO LÍQUIDO
  const patrimonioLiquido = getAccountsByGroup("Patrimônio Líquido");
  const totalPatrimonioLiquido = sumBalances(patrimonioLiquido);

  return {
    date,
    ativo: {
      circulante: {
        title: "Ativo Circulante",
        accounts: ativoCirculante,
        total: totalAtivoCirculante,
      },
      naoCirculante: {
        realizavelLongoPrazo: {
          title: "Realizável a Longo Prazo",
          accounts: realizavelLongoPrazo,
          total: totalRealizavelLP,
        },
        investimentos: {
          title: "Investimentos",
          accounts: investimentos,
          total: totalInvestimentos,
        },
        imobilizado: {
          title: "Imobilizado",
          accounts: imobilizado,
          total: totalImobilizado,
        },
        intangivel: {
          title: "Intangível",
          accounts: intangivel,
          total: totalIntangivel,
        },
      },
      total: totalAtivo,
    },
    passivo: {
      circulante: {
        title: "Passivo Circulante",
        accounts: passivoCirculante,
        total: totalPassivoCirculante,
      },
      naoCirculante: {
        title: "Passivo Não Circulante",
        accounts: passivoNaoCirculante,
        total: totalPassivoNaoCirculante,
      },
      total: totalPassivo,
    },
    patrimonioLiquido: {
      accounts: patrimonioLiquido,
      total: totalPatrimonioLiquido,
    },
  };
}
