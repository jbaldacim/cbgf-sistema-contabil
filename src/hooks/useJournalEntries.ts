import { useMemo, useState } from "react";
import { JournalEntry } from "@/types";
import { v4 as uuid } from "uuid";

export const useJournalEntries = () => {
  // Estado para armazenar as entradas
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: uuid(),
      accountId: "",
      amount: 0,
      type: "debito",
    },
    {
      id: uuid(),
      accountId: "",
      amount: 0,
      type: "credito",
    },
  ]);

  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());

  // Função para adicionar nova entrada
  const addEntry = (type: "debito" | "credito") => {
    setEntries((prev) => [
      ...prev,
      {
        id: uuid(),
        accountId: "",
        amount: 0,
        type: type,
      },
    ]);
  };

  // Função para remover entrada por índice
  const removeEntry = (id: string) => {
    if (entries.length > 2) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    }
  };

  // Função para atualizar qualquer campo de qualquer entrada
  const updateEntry = (
    id: string,
    field: keyof JournalEntry,
    value: string | number
  ) => {
    setEntries((prev) =>
      prev.map((entry, i) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  // Função para limpar as entradas
  const resetEntries = () => {
    setEntries([
      {
        id: uuid(),
        accountId: "",
        amount: 0,
        type: "debito",
      },
      {
        id: `credito-${Date.now()}-${Math.random()}`,
        accountId: "",
        amount: 0,
        type: "credito",
      },
    ]);
  };

  const isAccountDuplicated = (accountId: string) => {
    const result = duplicateAccounts.includes(accountId);
    // console.log(`🔍 isAccountDuplicated("${accountId}"):`, result);
    // console.log("📋 duplicateAccounts:", duplicateAccounts);
    return result;
  };

  // Valores computados (useMemo para performance)
  // Valores recalculados só quando "entries" mudar
  const debitEntries = useMemo(
    () => entries.filter((entry) => entry.type === "debito"),
    [entries]
  );

  const creditEntries = useMemo(
    () => entries.filter((entry) => entry.type === "credito"),
    [entries]
  );

  const totals = useMemo(() => {
    const totalDebit = debitEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    const totalCredit = creditEntries.reduce(
      (sum, entry) => sum + entry.amount,
      0
    );
    return { totalDebit, totalCredit };
  }, [debitEntries, creditEntries]);

  const isBalanced = useMemo(
    () => totals.totalDebit === totals.totalCredit && totals.totalDebit !== 0,
    [totals]
  );

  // Validação de contas duplicadas
  const duplicateAccounts = useMemo(() => {
    const accountIds = entries
      .filter((entry) => entry.accountId.trim() !== "")
      .map((entry) => entry.accountId);

    // console.log("🏦 Contas preenchidas:", accountIds);

    const duplicates = accountIds.filter(
      (accountId, index) => accountIds.indexOf(accountId) !== index
    );

    const uniqueDuplicates = [...new Set(duplicates)];
    // console.log("🔄 Contas duplicadas encontradas:", uniqueDuplicates);

    return uniqueDuplicates;
  }, [entries]);

  const hasDuplicates = duplicateAccounts.length > 0;

  const validationErrors = useMemo(() => {
    const errors: string[] = [];

    if (!isBalanced && (totals.totalCredit > 0 || totals.totalDebit > 0)) {
      errors.push("Os valores de crédito e debito devem ser iguais");
    }

    if (hasDuplicates) {
      errors.push("Não é possível usar a mesma conta mais de uma vez");
    }

    const emptyAccounts = entries.filter(
      (entry) => entry.accountId.trim() === ""
    ).length;

    if (emptyAccounts > 0) {
      errors.push("Todos os campos de contas devem ser preenchidos");
    }

    const zeroAmounts = entries.filter((entry) => entry.amount === 0).length;
    if (zeroAmounts > 0) {
      errors.push("Todos os campos de valores devem ser preenchidos");
    }

    const hasDescription = description !== "";
    if (!hasDescription) {
      errors.push("Todo lançamento deve ter uma descrição");
    }

    return errors;
  }, [
    entries,
    isBalanced,
    hasDuplicates,
    duplicateAccounts,
    totals,
    description,
  ]);

  const isFormValid = useMemo(() => {
    const hasAllAccountIds = entries.every(
      (entry) => entry.accountId.trim() !== ""
    );
    const hasValidAmounts = entries.every((entry) => entry.amount > 0);
    const hasDescription = description !== "";
    return (
      isBalanced &&
      hasAllAccountIds &&
      hasValidAmounts &&
      hasDescription &&
      !hasDuplicates
    );
  }, [entries, isBalanced, description]);

  // console.log("📊 Estado atual dos entries:", entries);

  return {
    // Estado
    entries,
    description,
    setDescription,
    date,
    setDate,

    // Manipulação
    addEntry,
    removeEntry,
    updateEntry,
    resetEntries,

    // Listas filtradas
    debitEntries,
    creditEntries,

    // Valores computados
    totals,
    isBalanced,
    isFormValid,

    // Validação
    hasDuplicates,
    duplicateAccounts,
    isAccountDuplicated,
    validationErrors,
  };
};
