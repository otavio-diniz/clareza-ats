import type { Category, Status } from "@/lib/ats/analysis";
import { cn } from "@/lib/utils";

const STATUS: Record<Status, { label: string; cls: string }> = {
  evidencia: { label: "Evidência textual", cls: "bg-evidence-soft text-evidence border-evidence/30" },
  transferivel: { label: "Aderência transferível", cls: "bg-transfer-soft text-transfer border-transfer/30" },
  revisao: { label: "Revisão necessária", cls: "bg-review-soft text-review border-review/30" },
  "nao-identificado": { label: "Não identificado", cls: "bg-missing-soft text-missing border-missing/30" },
};
const CATEGORY: Record<Category, string> = {
  obrigatorio: "Obrigatório",
  desejavel: "Desejável",
  responsabilidade: "Responsabilidade",
  "nao-classificado": "Não classificado",
};

export function StatusBadge({ status }: { status: Status }) {
  const s = STATUS[status];
  return <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", s.cls)}>{s.label}</span>;
}

export function CategoryTag({ category }: { category: Category }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        category === "obrigatorio" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
      )}
    >
      {CATEGORY[category]}
    </span>
  );
}