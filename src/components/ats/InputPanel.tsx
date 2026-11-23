import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  min: number;
}

export function InputPanel({ id, label, hint, value, onChange, error, min }: Props) {
  const len = value.trim().length;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="font-serif text-lg font-semibold text-primary">
          {label}
        </Label>
        <span
          id={`${id}-count`}
          className={len > 0 && len < min ? "text-xs text-review" : "text-xs text-muted-foreground"}
        >
          {value.length.toLocaleString("pt-BR")} caracteres
          {len > 0 && len < min ? ` · mínimo ${min}` : ""}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{hint}</p>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={`${id}-count${error ? ` ${id}-error` : ""}`}
        spellCheck={false}
        className="min-h-[320px] resize-y bg-card font-mono text-[13px] leading-relaxed"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm font-medium text-missing">
          {error}
        </p>
      )}
    </div>
  );
}
