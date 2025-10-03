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

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountName: string;
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  accountName,
}: DeleteAccountModalProps) {
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogDescription>
            Você tem certeza que deseja excluir a conta{" "}
            <span className="font-bold">{accountName}</span>? Esta ação não pode
            ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="confirm-delete">
            Para confirmar, digite <strong>excluir</strong> abaixo:
          </Label>
          <Input
            id="confirm-delete"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="excluir"
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmEnabled}
          >
            Deletar Conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
