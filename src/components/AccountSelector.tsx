"use client";

import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
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
import type { Account } from "@/types";
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
  accounts: Account[];
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
  accounts,
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
        "hover:bg-background flex w-full min-w-0 items-center justify-between gap-2",
        className,
      )}
    >
      <span className="block min-w-0 truncate font-normal">
        {selected
          ? selected.code + " - " + selected.name
          : "Selecione uma conta"}
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
                    keywords={[
                      account.name.toLowerCase(),
                      account.accountGroup.toLowerCase(),
                    ]}
                    onSelect={(val) => onChange(val)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === account.code ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {account.code + " - " + account.name}
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
      <div className="flex w-full items-center gap-3">
        <div className="min-w-0 flex-1">
          <Popover>
            <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
            <PopoverContent className="popover-content-width-full min-w-0 p-0">
              {commandList}
            </PopoverContent>
          </Popover>
        </div>

        <div className="w-32 flex-shrink-0">
          <AmountInput value={amount} onChange={onAmountChange} />
        </div>

        <div className="flex-shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={showRemoveButton ? 0 : -1}>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onRemove}
                  disabled={!showRemoveButton}
                  aria-label="Remover conta"
                  className="hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {showRemoveButton ? (
                "Remover conta"
              ) : (
                <div className="max-w-xs text-center text-xs">
                  Impossível remover conta: pelo menos uma conta de débito e uma
                  de crédito devem ser selecionadas
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  }

  // mobile: trigger (flex-1) | amount (fixed) | remove (fixed)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  return (
    <div className="flex w-full items-center gap-3">
      <div className="min-w-0 flex-1">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild onClick={() => setIsDrawerOpen(true)}>
            {triggerButton}
          </DrawerTrigger>
          <DrawerContent className="min-w-0 p-4">
            <Command
              filter={(value, search, keywords) => {
                const extendedValue = value + " " + keywords?.join(" ");
                return extendedValue
                  .toLowerCase()
                  .includes(search.toLowerCase())
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
                            keywords={[
                              account.name.toLowerCase(),
                              account.accountGroup.toLowerCase(),
                            ]}
                            onSelect={(val) => {
                              onChange(val);
                              setIsDrawerOpen(false); // Fecha o Drawer ao selecionar
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                value === account.code
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {account.code + " - " + account.name}
                          </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandSeparator />
                  </React.Fragment>
                ))}
              </CommandList>
            </Command>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="w-32 flex-shrink-0">
        <AmountInput value={amount} onChange={onAmountChange} />
      </div>

      <div className="flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={showRemoveButton ? 0 : -1}>
              <Button
                size="icon"
                variant="ghost"
                onClick={onRemove}
                disabled={!showRemoveButton}
                aria-label="Remover conta"
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {showRemoveButton ? "Remover conta" : "Impossível remover conta"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default AccountSelector;
