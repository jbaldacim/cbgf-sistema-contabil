"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Trash2 } from "lucide-react";

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transactionNumber: number | null;
}

export function DeleteTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  transactionNumber,
}: DeleteTransactionModalProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const isConfirmEnabled = confirmationText === "excluir";

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm();
      setConfirmationText("");
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="space-y-3">
          <div className="bg-destructive/10 mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <Trash2 className="text-destructive h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Você tem certeza que deseja excluir a transação número{" "}
            <span className="text-foreground font-semibold">
              {transactionNumber}
            </span>
            ?
            <br />
            <span className="text-destructive mt-2 inline-block font-medium">
              Esta ação não pode ser desfeita.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 border-border rounded-lg border p-4">
            <div className="mb-3 flex items-start gap-2">
              <AlertCircle className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
              <Label
                htmlFor="confirm-delete"
                className="text-sm leading-relaxed"
              >
                Para confirmar, digite{" "}
                <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-sm font-semibold">
                  excluir
                </code>{" "}
                abaixo:
              </Label>
            </div>
            <Input
              id="confirm-delete"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="excluir"
              autoComplete="off"
              className="font-mono"
              aria-label="Digite 'excluir' para confirmar"
            />
            {confirmationText && !isConfirmEnabled && (
              <p className="text-destructive mt-2 text-xs">
                O texto não corresponde. Digite exatamente "excluir".
              </p>
            )}
            {isConfirmEnabled && (
              <p className="text-success mt-2 text-xs font-medium">
                ✓ Confirmação válida
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 bg-transparent sm:flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
            className="flex-1 sm:flex-1"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Deletar Transação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
