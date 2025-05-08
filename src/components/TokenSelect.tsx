
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TokenSelectProps {
  tokens: Array<{ symbol: string; mint: string; decimals: number }>;
  value: string;
  onChange: (symbol: string) => void;
  exclude?: string;
}

export function TokenSelect({ tokens, value, onChange, exclude }: TokenSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Token" />
      </SelectTrigger>
      <SelectContent>
        {tokens.filter(token => token.symbol !== exclude).map(token => (
          <SelectItem key={token.symbol} value={token.symbol}>
            {token.symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
