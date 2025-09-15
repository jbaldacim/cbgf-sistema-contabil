import { useId } from "react";
import { Input } from "./ui/input";

type Props = { value: string; onChange: (value: string) => void };

const AmountInput = ({ value, onChange }: Props) => {
  const inputId = useId();

  return (
    <div className="w-full">
      <Input
        type="number"
        placeholder="R$ 0,00"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          console.log(e.target.value);
        }}
        step="any"
        min="0"
        className="bg-background"
        id={inputId}
      />
    </div>
  );
};

export default AmountInput;
