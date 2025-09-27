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
    <div>
      <Card>
        <CardHeader className="bg-zinc-300 -mt-6 rounded-t-xl py-4">
          <CardTitle>Detalhes do lançamento</CardTitle>
          <CardDescription className="text-zinc-800">
            Insira aqui os detalhes do lançamento
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col">
          <div className="flex flex-col p-1">
            <Label className="font-semibold mb-1 px-1" htmlFor="description">
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
    </div>
  );
}
