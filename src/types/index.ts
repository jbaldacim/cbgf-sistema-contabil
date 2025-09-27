export interface Account {
  id: string;
  code: string;
  name: string;
  accountGroup: string;
  subgroup1: string;
  subgroup2: string;
  codeAndName: string;
  balance: number;
  history: (Omit<JournalEntry, "accountId"> & { date: Date })[];
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
