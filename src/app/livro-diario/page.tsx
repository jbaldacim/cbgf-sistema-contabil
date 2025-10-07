"use client";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { getColumns, type Entry } from "@/components/Columns-LivroDiario";
import { DataTable } from "@/components/Data-Table";
import { DeleteTransactionModal } from "@/components/DeleteTransactionModal";
import { BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LivroDiario() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<number | null>(
    null,
  );

  async function fetchEntries() {
    setIsLoading(true);
    const { data, error } = await supabase.rpc("get_journal_entries");
    if (error) {
      console.error("Erro ao buscar lançamentos:", error);
      toast.error("Não foi possível carregar os lançamentos.");
    } else if (data) {
      setEntries(data);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleOpenDeleteModal = (transactionNumber: number) => {
    setSelectedTransaction(transactionNumber);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  // --- FUNÇÃO MODIFICADA ---
  // Recriada sem usar toast.promise
  const handleDeleteTransaction = async () => {
    if (selectedTransaction === null) return;

    // 1. Mostra um toast de carregamento e guarda seu ID
    const toastId = toast.loading("Deletando transação...");

    try {
      // 2. Tenta executar a operação no banco de dados
      const { error } = await supabase.rpc("delete_transaction", {
        p_transaction_number: selectedTransaction,
      });

      // Se a operação no banco retornar um erro, lança-o para o bloco catch
      if (error) {
        throw error;
      }

      // 3. Se for bem-sucedido, atualiza o toast para sucesso
      toast.success(`Transação #${selectedTransaction} deletada com sucesso!`, {
        id: toastId,
      });

      handleCloseModal();
      fetchEntries(); // Recarrega os dados
    } catch (error) {
      // 4. Se qualquer erro ocorrer, atualiza o toast para erro
      console.error("Erro ao deletar transação:", error);
      toast.error("Falha ao deletar a transação.", {
        id: toastId,
      });
    }
  };

  const columns = getColumns(handleOpenDeleteModal);

  return (
    <>
      <main className="from-background via-background to-muted/30 min-h-screen bg-gradient-to-br">
        <div className="bg-card/50 border-border/50 border-b backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
                <BookOpen className="text-primary h-6 w-6" />
              </div>
              <div>
                <h1 className="text-foreground text-3xl font-bold tracking-tight">
                  Livro Diário
                </h1>
                <p className="text-muted-foreground mt-1">
                  Registro cronológico de todas as transações contábeis
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-6 py-8">
          <DataTable columns={columns} data={entries} isLoading={isLoading} />
        </div>
      </main>
      <DeleteTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleDeleteTransaction}
        transactionNumber={selectedTransaction}
      />
    </>
  );
}
