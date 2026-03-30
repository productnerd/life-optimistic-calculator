import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  description?: string;
}

function formatWithCommas(n: number): string {
  return n.toLocaleString("en-US");
}

function parseFormatted(s: string): string {
  return s.replace(/,/g, "");
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  description,
}: NumberFieldProps) {
  const [display, setDisplay] = useState(String(value));
  const [focused, setFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setDisplay(raw);
    const cleaned = parseFormatted(raw);
    const num = Number(cleaned);
    if (cleaned !== "" && !isNaN(num)) {
      onChange(num);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    const cleaned = parseFormatted(display);
    if (cleaned === "" || isNaN(Number(cleaned))) {
      setDisplay(String(min ?? 0));
      onChange(min ?? 0);
    } else {
      setDisplay(String(Number(cleaned)));
    }
  };

  const handleFocus = () => {
    setFocused(true);
    setDisplay(String(value));
  };

  // When not focused, show formatted value with commas
  const shown = focused ? display : formatWithCommas(value);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}
        <Input
          type="text"
          inputMode="numeric"
          value={shown}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className={prefix ? "pl-8" : suffix ? "pr-12" : ""}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
