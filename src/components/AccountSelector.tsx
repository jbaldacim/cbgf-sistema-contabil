// AccountSelector.tsx
"use client";

import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { accounts } from "@/lib/contas";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Account } from "@/types";
import AmountInput from "./AmountInput";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

type Props = {
  value: string;
  onChange: (value: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  excludeAccounts?: string[];
  className?: string;
  /** new: chamada quando clicar em remover */
  onRemove?: () => void;
  /** new: se o botão deve estar habilitado/visível */
  showRemoveButton?: boolean;
};

const AccountSelector = ({
  value,
  onChange,
  amount,
  onAmountChange,
  excludeAccounts = [],
  className,
  onRemove,
  showRemoveButton = true,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selected = accounts.find((a) => a.code === value);

  const grouped = accounts.reduce<Record<string, Account[]>>((acc, accnt) => {
    acc[accnt.accountGroup] = acc[accnt.accountGroup] || [];
    acc[accnt.accountGroup].push(accnt);
    return acc;
  }, {});

  const triggerButton = (
    <Button
      variant="outline"
      role="combobox"
      className={cn(
        // ocupa todo o espaço disponível na coluna esquerda; truncate evita que cresça
        "w-full flex items-center justify-between gap-2 min-w-0",
        className
      )}
    >
      <span className="truncate block min-w-0 font-normal">
        {selected ? selected.codeAndName : "Selecione uma conta"}
      </span>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const commandList = (
    <Command
      filter={(value, search, keywords) => {
        const extendedValue = value + " " + keywords?.join(" ");
        return extendedValue.toLowerCase().includes(search.toLowerCase())
          ? 1
          : 0;
      }}
    >
      <CommandInput placeholder="Buscar conta..." />
      <CommandList>
        <CommandEmpty>Nenhuma conta encontrada.</CommandEmpty>

        {Object.entries(grouped).map(([group, items]) => (
          <React.Fragment key={group}>
            <CommandGroup heading={group}>
              {items
                .filter((a) => !excludeAccounts.includes(a.code))
                .map((account) => (
                  <CommandItem
                    key={account.code}
                    value={account.code}
                    keywords={[account.name.toLowerCase()]}
                    onSelect={(val) => onChange(val)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === account.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {account.codeAndName}
                  </CommandItem>
                ))}
            </CommandGroup>
            <CommandSeparator />
          </React.Fragment>
        ))}
      </CommandList>
    </Command>
  );

  if (isDesktop) {
    return (
      // layout: [ trigger (flex-1) | amount (fixed) | remove (fixed) ]
      <div className="flex flex-1 gap-2 items-center min-w-0">
        <div className="flex-1 min-w-0">
          <Popover>
            <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
            <PopoverContent className="p-0 min-w-0">
              {commandList}
            </PopoverContent>
          </Popover>
        </div>

        {/* largura fixa para amount — evita que amount mude de tamanho */}
        <div className="flex-shrink-0 min-w-0 w-20">
          <AmountInput value={amount} onChange={onAmountChange} />
        </div>

        {/* remove button dentro do mesmo componente, largura fixa */}
        <div className="flex-shrink-0 min-w-0 w-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="inline-block w-full">
                <Button
                  size="icon"
                  variant="outline"
                  className="w-full"
                  onClick={onRemove}
                  disabled={!showRemoveButton}
                  aria-label="Remover conta"
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {showRemoveButton ? (
                "Remover conta"
              ) : (
                <div className="text-center">
                  Impossível remover conta: pelo menos uma conta de débito
                  <br></br> e uma de crédito devem ser selecionadas
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  // mobile: trigger (flex-1) | amount (fixed) | remove (fixed)
  return (
    <div className="flex flex-1 gap-2 items-center min-w-0">
      <div className="flex-1 min-w-0">
        <Drawer>
          <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
          <DrawerContent className="p-4 min-w-0">{commandList}</DrawerContent>
        </Drawer>
      </div>

      <div className="flex-shrink-0 min-w-0 w-20">
        <AmountInput value={amount} onChange={onAmountChange} />
      </div>

      <div className="flex-shrink-0 min-w-0 w-10">
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-block w-full">
              <Button
                size="icon"
                variant="ghost"
                className="w-full"
                onClick={onRemove}
                disabled={!showRemoveButton}
                aria-label="Remover conta"
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {showRemoveButton ? "Remover conta" : "Impossível remover conta"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default AccountSelector;
