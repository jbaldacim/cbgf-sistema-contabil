import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = { value: string; onChange: (value: string) => void };

const DescriptionInput = ({ value, onChange }: Props) => {
  return (
    <div>
      <Label className="font-semibold mb-1">Descrição</Label>
      <Input
        type="text"
        placeholder="Descrição do lançamento"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background"
      />
    </div>
  );
};

export default DescriptionInput;
