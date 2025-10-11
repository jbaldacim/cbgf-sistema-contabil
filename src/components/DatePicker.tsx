// TODO Traduzir dias do mês - Resolvido!
"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { ptBR } from "date-fns/locale"; // 1. Importe a localidade pt-BR

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

type Props = { date: Date; onDateChange: (value: Date) => void };

export function DatePicker({ date = new Date(), onDateChange }: Props) {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));

  // Sincroniza o estado interno se a prop externa mudar
  React.useEffect(() => {
    setValue(formatDate(date));
    setMonth(date);
  }, [date]);

  return (
    <div className="flex flex-col p-1">
      <Label htmlFor="date" className="mb-1 px-1 font-semibold">
        Data
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder="dd/mm/aaaa"
          className="bg-background pr-10"
          onChange={(e) => {
            setValue(e.target.value);
            // Tenta converter o texto para uma data válida no formato brasileiro
            const parts = e.target.value.split("/");
            if (parts.length === 3) {
              const [day, month, year] = parts.map(Number);
              if (
                day > 0 &&
                day <= 31 &&
                month > 0 &&
                month <= 12 &&
                year > 1000
              ) {
                const newDate = new Date(year, month - 1, day);
                if (isValidDate(newDate)) {
                  onDateChange(newDate);
                  setMonth(newDate);
                }
              }
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 p-0"
            >
              <CalendarIcon className="size-4" />
              <span className="sr-only">Selecione a data</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              locale={ptBR} // 2. Passe a localidade para o componente
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  onDateChange(selectedDate);
                  setValue(formatDate(selectedDate));
                }
                setOpen(false);
              }}
              month={month}
              onMonthChange={setMonth}
              captionLayout="dropdown"
              startMonth={new Date(1900,0)}
              endMonth={new Date()}
              disabled={{after: new Date()}}
              showOutsideDays={false}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
