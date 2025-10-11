import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatarMoeda = (valor: number) => {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatarSaldoContabil = (
  balance: number,
  accountGroup: string,
): string => {
  if (balance >= 0) {
    return formatarMoeda(balance);
  }
  const isDebitNature = ["Ativo", "Despesas"].includes(accountGroup);

  const formattedValue = formatarMoeda(Math.abs(balance));

  if (isDebitNature) {
    return `${formattedValue} C`;
  } else {
    // Natureza Credora (Passivo, Patrimônio Líquido, Receitas)
    return `${formattedValue} D`;
  }
};
