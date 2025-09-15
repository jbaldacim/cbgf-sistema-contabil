"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
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

type Props = {
  value: string;
  onChange: (value: string) => void;
  amount: string;
  onAmountChange: (value: string) => void;
  excludeAccounts?: string[];
  className?: string;
};

const DebitAccountSelector = ({
  value,
  onChange,
  amount,
  onAmountChange,
  excludeAccounts = [],
  className,
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const selected = accounts.find((a) => a.code === value);

  const availableAccounts = accounts.filter(
    (account) => !excludeAccounts.includes(account.code)
  );

  // Arrumar e entender esse grouped
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
        "w-full justify-between font-normal transition-[width,height]",
        className
      )}
    >
      {selected ? selected.codeAndName : "Selecione uma conta"}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const commandList = (
    <Command
      filter={(value, search, keywords) => {
        const extendedValue = value + " " + keywords?.join(" ");
        if (extendedValue.toLowerCase().includes(search.toLowerCase()))
          return 1;
        return 0;
      }}
    >
      <CommandInput placeholder="Buscar conta..." />
      <CommandList>
        <CommandEmpty>Nenhuma conta encontrada.</CommandEmpty>

        {Object.entries(grouped).map(([group, items]) => (
          <>
            <CommandGroup key={group} heading={group} className="">
              {items.map((account) => (
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
          </>
        ))}
      </CommandList>
    </Command>
  );

  // Arrumar opções estourando a tela: faltava <CommandList>
  // Arrumar styling
  if (isDesktop) {
    return (
      <div className="flex gap-2">
        <div className="w-3/4">
          <Popover>
            <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
            <PopoverContent className="grow p-0">{commandList}</PopoverContent>
          </Popover>
        </div>
        <AmountInput value={amount} onChange={onAmountChange} />
      </div>
    );
  }

  // Arrumar subgrupos cortados no
  // TODO: arrumar opções ultrapassando o tamanho do componente no mobile
  return (
    <div className="flex flex-row gap-2">
      <div className="w-3/4">
        <Drawer>
          <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
          <DrawerContent className="p-4">{commandList}</DrawerContent>
        </Drawer>
      </div>
      <AmountInput value={amount} onChange={onAmountChange} />
    </div>
  );
};

export default DebitAccountSelector;
