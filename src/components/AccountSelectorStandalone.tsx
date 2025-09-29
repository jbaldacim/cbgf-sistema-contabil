"use client";

import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Drawer, DrawerClose, DrawerContent, DrawerTrigger } from "./ui/drawer";
import type { Account } from "@/types";
import { PopoverClose } from "@radix-ui/react-popover";

type Props = {
  value: string;
  onChange: (value: string) => void;
  excludeAccounts?: string[];
  className?: string;
  placeholder?: string;
  accounts: Account[];
};

const AccountSelectorStandalone = ({
  value,
  onChange,
  excludeAccounts = [],
  className,
  placeholder = "Selecione uma conta",
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
        "w-full flex items-center justify-between gap-2 min-w-0",
        className
      )}
    >
      <span className="truncate block min-w-0 font-normal">
        {selected ? selected.code + " - " + selected.name : placeholder}
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
                        value === account.code ? "opacity-100" : "opacity-0"
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
      <Popover>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent className="p-0 min-w-0 popover-content-width-full">
          <PopoverClose asChild>{commandList}</PopoverClose>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent className="p-4 min-w-0">
        <DrawerClose asChild>{commandList}</DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default AccountSelectorStandalone;
