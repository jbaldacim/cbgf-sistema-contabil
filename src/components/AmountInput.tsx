"use client";

import { useId } from "react";
import { Input } from "./ui/input";

type Props = { value: string; onChange: (value: string) => void };

const AmountInput = ({ value, onChange }: Props) => {
  const inputId = useId();

  return (
    <div className="relative w-full">
      <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-sm font-medium">
        R$
      </span>
      <Input
        type="number"
        placeholder="0,00"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        step="0.01"
        min="0"
        className="bg-background pl-10 tabular-nums"
        id={inputId}
        aria-label="Valor em reais"
      />
    </div>
  );
};

export default AmountInput;
