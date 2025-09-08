import { Account, AccountGroup } from "@/types";

export const accounts: Account[] = [
  {
    code: "1.0.1",
    name: "Caixa",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Circulante",
    subgroup2: "",
    codeAndName: "1.0.1 - Caixa",
  },
  {
    code: "1.0.2",
    name: "Bancos Conta Movimento",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Circulante",
    subgroup2: "",
    codeAndName: "1.0.2 - Bancos Conta Movimento",
  },
  {
    code: "1.0.3",
    name: "Clientes",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Circulante",
    subgroup2: "",
    codeAndName: "1.0.3 - Clientes",
  },
  {
    code: "1.0.4",
    name: "Estoques",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Circulante",
    subgroup2: "",
    codeAndName: "1.0.4 - Estoques",
  },
  {
    code: "1.0.5",
    name: "Despesas Antecipadas",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Circulante",
    subgroup2: "",
    codeAndName: "1.0.5 - Despesas Antecipadas",
  },
  {
    code: "2.0.1",
    name: "Clientes - Longo Prazo",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Realizável a Longo Prazo",
    codeAndName: "2.0.1 - Clientes - Longo Prazo",
  },
  {
    code: "2.0.2",
    name: "Depósitos Judiciais",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Realizável a Longo Prazo",
    codeAndName: "2.0.2 - Depósitos Judiciais",
  },
  {
    code: "2.1.1",
    name: "Participações Societárias",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Investimentos",
    codeAndName: "2.1.1 - Participações Societárias",
  },
  {
    code: "2.1.2",
    name: "Imóveis para Renda",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Investimentos",
    codeAndName: "2.1.2 - Imóveis para Renda",
  },
  {
    code: "2.2.1",
    name: "Máquinas e Equipamentos",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Imobilizado",
    codeAndName: "2.2.1 - Máquinas e Equipamentos",
  },
  {
    code: "2.2.2",
    name: "Veículos",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Imobilizado",
    codeAndName: "2.2.2 - Veículos",
  },
  {
    code: "2.2.3",
    name: "Móveis e Utensílios",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Imobilizado",
    codeAndName: "2.2.3 - Móveis e Utensílios",
  },
  {
    code: "2.2.4",
    name: "Depreciação Acumulada",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Imobilizado",
    codeAndName: "2.2.4 - Depreciação Acumulada",
  },
  {
    code: "2.3.1",
    name: "Softwares",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Intangível",
    codeAndName: "2.3.1 - Softwares",
  },
  {
    code: "2.3.2",
    name: "Marcas e Patentes",
    accountGroup: "Ativo" as AccountGroup,
    subgroup1: "Ativo Não Circulante",
    subgroup2: "Intangível",
    codeAndName: "2.3.2 - Marcas e Patentes",
  },
  {
    code: "3.0.1",
    name: "Fornecedores",
    accountGroup: "Passivo" as AccountGroup,
    subgroup1: "Passivo Circulante",
    subgroup2: "",
    codeAndName: "3.0.1 - Fornecedores",
  },
  {
    code: "3.0.2",
    name: "Salários a Pagar",
    accountGroup: "Passivo" as AccountGroup,
    subgroup1: "Passivo Circulante",
    subgroup2: "",
    codeAndName: "3.0.2 - Salários a Pagar",
  },
  {
    code: "3.0.3",
    name: "Impostos a Recolher",
    accountGroup: "Passivo" as AccountGroup,
    subgroup1: "Passivo Circulante",
    subgroup2: "",
    codeAndName: "3.0.3 - Impostos a Recolher",
  },
  {
    code: "3.0.4",
    name: "Empréstimos Bancários CP",
    accountGroup: "Passivo" as AccountGroup,
    subgroup1: "Passivo Circulante",
    subgroup2: "",
    codeAndName: "3.0.4 - Empréstimos Bancários CP",
  },
  {
    code: "3.0.5",
    name: "Contas a Pagar",
    accountGroup: "Passivo" as AccountGroup,
    subgroup1: "Passivo Circulante",
    subgroup2: "",
    codeAndName: "3.0.5 - Contas a Pagar",
  },
  {
    code: "3.1.1",
    name: "Empréstimos Bancários LP",
    accountGroup: "Passivo" as AccountGroup,
    subgroup1: "Passivo Não Circulante",
    subgroup2: "",
    codeAndName: "3.1.1 - Empréstimos Bancários LP",
  },
  {
    code: "3.1.2",
    name: "Provisões Trabalhistas",
    accountGroup: "Passivo" as AccountGroup,
    subgroup1: "Passivo Não Circulante",
    subgroup2: "",
    codeAndName: "3.1.2 - Provisões Trabalhistas",
  },
  {
    code: "3.1.3",
    name: "Contas a Pagar LP",
    accountGroup: "Passivo" as AccountGroup,
    subgroup1: "Passivo Não Circulante",
    subgroup2: "",
    codeAndName: "3.1.3 - Contas a Pagar LP",
  },
  {
    code: "4.0.1",
    name: "Capital Social",
    accountGroup: "Patrimônio Líquido" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "4.0.1 - Capital Social",
  },
  {
    code: "4.0.2",
    name: "Reservas de Lucros",
    accountGroup: "Patrimônio Líquido" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "4.0.2 - Reservas de Lucros",
  },
  {
    code: "4.0.3",
    name: "Lucros Acumulados",
    accountGroup: "Patrimônio Líquido" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "4.0.3 - Lucros Acumulados",
  },
  {
    code: "5.0.1",
    name: "CMV",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.0.1 - CMV",
  },
  {
    code: "5.0.2",
    name: "CPV",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.0.2 - CPV",
  },
  {
    code: "5.0.3",
    name: "CSP",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.0.3 - CSP",
  },
  {
    code: "5.1.1",
    name: "Despesa com Salários",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.1.1 - Despesa com Salários",
  },
  {
    code: "5.1.2",
    name: "Despesa com Aluguel",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.1.2 - Despesa com Aluguel",
  },
  {
    code: "5.1.3",
    name: "Despesa com Energia Elétrica",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.1.3 - Despesa com Energia Elétrica",
  },
  {
    code: "5.1.4",
    name: "Despesa Financeira",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.1.4 - Despesa Financeira",
  },
  {
    code: "5.1.5",
    name: "Despesa com Material de Escritório",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.1.5 - Despesa com Material de Escritório",
  },
  {
    code: "5.2.1",
    name: "Despesa com Depreciação",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.2.1 - Despesa com Depreciação",
  },
  {
    code: "5.3.0",
    name: "Despesa com IRPJ",
    accountGroup: "Despesas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "5.3.0 - Despesa com IRPJ",
  },
  {
    code: "6.0.1",
    name: "Receita de Vendas",
    accountGroup: "Receitas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "6.0.1 - Receita de Vendas",
  },
  {
    code: "6.0.2",
    name: "Receita de Serviços",
    accountGroup: "Receitas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "6.0.2 - Receita de Serviços",
  },
  {
    code: "6.0.3",
    name: "Receita Financeira",
    accountGroup: "Receitas" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "6.0.3 - Receita Financeira",
  },
  {
    code: "7.0.1",
    name: "Resultado do Exercício",
    accountGroup: "Apuração do Resultado" as AccountGroup,
    subgroup1: "",
    subgroup2: "",
    codeAndName: "7.0.1 - Resultado do Exercício",
  },
];

export const getAccountByGroup = (accountGroup: AccountGroup) => {
  return accounts.filter((account) => account.accountGroup === accountGroup);
};

export const getAccountsAtivo = () => {
  return accounts.filter((account) => account.accountGroup === "Ativo");
};

export const getAccountsPassivo = () => {
  return accounts.filter((account) => account.accountGroup === "Passivo");
};

export const getAccountsPatrimonioLiquido = () => {
  return accounts.filter(
    (account) => account.accountGroup === "Patrimônio Líquido"
  );
};

export const getAccountsReceitas = () => {
  return accounts.filter((account) => account.accountGroup === "Receitas");
};

export const getAccountsDespesas = () => {
  return accounts.filter((account) => account.accountGroup === "Despesas");
};

export const getAccountsApuracaoDoResultado = () => {
  return accounts.filter(
    (account) => account.accountGroup === "Apuração do Resultado"
  );
};

export const getAccountByCode = (code: string) => {
  return accounts.find((account) => account.code === code);
};
