import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface SliderFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  prefix?: string;
  description?: string;
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = "",
  prefix = "",
  description,
}: SliderFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <span className="text-sm font-semibold tabular-nums text-primary">
          {prefix}
          {value.toLocaleString()}
          {unit}
        </span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <Slider
        value={[value]}
        onValueChange={(val) => onChange(Array.isArray(val) ? val[0] : val)}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {prefix}
          {min.toLocaleString()}
          {unit}
        </span>
        <span>
          {prefix}
          {max.toLocaleString()}
          {unit}
        </span>
      </div>
    </div>
  );
}
