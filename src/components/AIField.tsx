import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Check } from "lucide-react";
import type { AIPricedItem } from "@/types";

interface AIFieldProps {
  label: string;
  placeholder: string;
  item: AIPricedItem;
  onChange: (item: AIPricedItem) => void;
  onEstimate: (description: string) => Promise<number>;
  optional?: boolean;
}

export function AIField({
  label,
  placeholder,
  item,
  onChange,
  onEstimate,
  optional,
}: AIFieldProps) {
  const [inputValue, setInputValue] = useState(item.description);

  const handleEstimate = async (force = false) => {
    if (!inputValue.trim()) return;
    // Skip if description hasn't changed and we already have a price (avoid re-triggering on blur)
    if (!force && inputValue === item.description && item.estimatedPrice !== null) return;
    onChange({ ...item, description: inputValue, isLoading: true });
    try {
      const price = await onEstimate(inputValue);
      onChange({
        ...item,
        description: inputValue,
        estimatedPrice: price,
        isLoading: false,
      });
    } catch {
      onChange({ ...item, description: inputValue, isLoading: false });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleEstimate(true);
    }
  };

  return (
    <div className="space-y-2">
      {(label || optional) && (
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">{label}</Label>
          {optional && (
            <Badge variant="secondary" className="text-xs">
              Optional
            </Badge>
          )}
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
        </div>
      )}
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => handleEstimate()}
          className="pr-10"
        />
        {item.isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {!item.isLoading && item.estimatedPrice !== null && item.description && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      {item.estimatedPrice !== null && item.description && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Estimated:</span>
          <span className="text-sm font-semibold text-green-700">
            €{item.estimatedPrice.toLocaleString()}
          </span>
          <button
            className="text-xs text-muted-foreground underline hover:text-foreground"
            onClick={() => {
              const manual = prompt("Enter price manually:", String(item.estimatedPrice));
              if (manual) {
                onChange({ ...item, estimatedPrice: Number(manual) });
              }
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
