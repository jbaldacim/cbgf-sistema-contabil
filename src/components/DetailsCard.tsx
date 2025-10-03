"use client";

import { DatePicker } from "./DatePicker";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  description: string;
  onDescriptionChange: (value: string) => void;
  date: Date;
  onDateChange: (value: Date) => void;
};

export function DetailsCard({
  description,
  onDescriptionChange,
  date,
  onDateChange,
}: Props) {
  return (
    <Card className="">
      <CardHeader className="bg-accent -mt-6 rounded-t-xl py-4">
        <CardTitle className="text-lg">Detalhes do lançamento</CardTitle>
        <CardDescription>Insira aqui os detalhes do lançamento</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col">
        <div className="flex flex-col p-1">
          <Label className="mb-1 px-1 font-semibold" htmlFor="description">
            Descrição
          </Label>
          <Input
            type="text"
            placeholder="Descrição do lançamento"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="bg-background"
            id="description"
          />
        </div>
        <DatePicker date={date} onDateChange={onDateChange} />
      </CardContent>
    </Card>
  );
}
