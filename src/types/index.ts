export interface Account {
  id: string;
  code: string;
  name: string;
  accountGroup: string;
  subgroup1: string;
  subgroup2: string;
  codeAndName: string;
  balance: number;
}

export type AccountGroup =
  | "Ativo"
  | "Passivo"
  | "Patrimônio Líquido"
  | "Despesas"
  | "Receitas"
  | "Apuração do Resultado";

export type JournalEntry = {
  id: string;
  accountId: string;
  amount: number;
  type: "debito" | "credito";
};

export interface CompleteTransaction {
  id?: string;
  date: Date;
  description: string;
  referenceNumber?: string;
  journalEntries: JournalEntry[];
  totalAmount: number;
}

export interface TransactionFormData {
  date: Date;
  description: string;
  referenceNumber?: string;
  debits: Array<{
    accountId: string;
    amount: number;
  }>;
  credits: Array<{
    accountId: string;
    amount: number;
  }>;
}

export type BalanceSheetSection = {
  title: string;
  accounts: {
    code: string;
    name: string;
    balance: number;
  }[];
  total: number;
};

export type BalanceSheet = {
  date: Date;
  ativo: {
    circulante: BalanceSheetSection;
    naoCirculante: {
      realizavelLongoPrazo: BalanceSheetSection;
      investimentos: BalanceSheetSection;
      imobilizado: BalanceSheetSection;
      intangivel: BalanceSheetSection;
    };
    total: number;
  };
  passivo: {
    circulante: BalanceSheetSection;
    naoCirculante: BalanceSheetSection;
    total: number;
  };
  patrimonioLiquido: {
    accounts: {
      code: string;
      name: string;
      balance: number;
    }[];
    total: number;
  };
};
