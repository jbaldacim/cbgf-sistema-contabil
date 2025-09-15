import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = { value: string; onChange: (value: string) => void };

const DescriptionInput = ({ value, onChange }: Props) => {
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
          <Label className="font-semibold mb-1" htmlFor="description">
            Descrição
          </Label>
          <Input
            type="text"
            placeholder="Descrição do lançamento"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-background"
            id="description"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DescriptionInput;
