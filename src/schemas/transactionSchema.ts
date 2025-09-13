import { accounts } from "@/lib/contas";
import { z } from "zod";

const validCodes = accounts.map((account) => account.code);

const journalEntrySchema = z.object({
  accountId: z
    .string()
    .min(1, "Conta é obrigatória")
    .refine((value) => validCodes.includes(value), "Conta inválida"),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine(
      (value) => !isNaN(Number(value)) && Number(value) > 0,
      "Valor deve ser maior que zero"
    ),
});

export const transactionSchema = z
  .object({
    date: z
      .date()
      .refine((val) => val instanceof Date && !isNaN(val.getTime()), {
        message: "Data inválida",
      }),
    description: z.string().min(1, "Descrição é obrigatória"),
    referenceNumber: z.string().optional(),
    debits: z
      .array(journalEntrySchema)
      .min(1, "Pelo menos um débito é obrigatório"),
    credits: z
      .array(journalEntrySchema)
      .min(1, "Pelo menos um crédito é obrigatório"),
  })
  .refine(
    (data) => {
      const allAccounts = [
        ...data.debits.map((debit) => debit.accountId),
        ...data.credits.map((credit) => credit.accountId),
      ];
      return new Set(allAccounts);
    },
    {
      message: "Não é possível usar a mesma conta mais de uma vez",
      path: ["debits"],
    }
  )
  .refine(
    (data) => {
      const totalAmountDebit = data.debits.reduce(
        (sum, d) => sum + Number(d.amount),
        0
      );
      const totalAmountCredit = data.credits.reduce(
        (sum, d) => sum + Number(d.amount),
        0
      );

      return Math.abs(totalAmountCredit - totalAmountDebit);
    },
    {
      message: "Total de débitos deve ser igual ao total de créditos",
      path: ["credits"],
    }
  );
