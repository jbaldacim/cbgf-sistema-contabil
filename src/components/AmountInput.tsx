import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = { value: string; onChange: (value: string) => void };

const AmountInput = ({ value, onChange }: Props) => {
  return (
    <div className="grow">
      <Label className="font-semibold mb-1">Valor</Label>
      <Input
        type="number"
        placeholder="R$ 0,00"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          console.log(e.target.value);
        }}
        step="0.01"
        min="0"
        className="bg-background"
      />
    </div>
  );
};

export default AmountInput;
