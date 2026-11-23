import { AlertTriangle, CheckCircle2, Copy, Download, FileText, Lightbulb, Printer } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AnalysisResult, CoverageGroup } from "@/lib/ats/analysis";
import type { Suggestion } from "@/lib/ats/suggestions";
import { CategoryTag, StatusBadge } from "./StatusBadge";

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="rounded-lg border border-border bg-card p-5 sm:p-7">
      <h3 id={id} className="mb-4 text-xl font-semibold text-primary">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Count({ label, g }: { label: string; g: CoverageGroup }) {
  return (
    <div className="rounded-md border border-border bg-background p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-serif text-2xl text-primary">
        {g.evidenced} <span className="text-base text-muted-foreground">de {g.total}</span>
      </div>
      <div className="text-xs text-muted-foreground">com evidência textual</div>
    </div>
  );
}

export function Coverage({ r }: { r: AnalysisResult }) {
  const c = r.coverage;
  return (
    <Section title="Cobertura heurística de requisitos" id="sec-coverage">
      {c.reliable ? (
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <div>
            <div className="font-serif text-5xl font-semibold text-primary">{c.percent}%</div>
            <p className="mt-1 max-w-[16rem] text-sm text-muted-foreground">
              {c.all.evidenced} de {c.all.total} requisitos identificados têm evidência textual no currículo.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Count label="Obrigatórios" g={c.obrigatorio} />
            <Count label="Desejáveis" g={c.desejavel} />
          </div>
        </div>
      ) : (
        <p className="flex gap-2 rounded-md bg-review-soft p-4 text-sm text-review">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
          Não foi possível identificar requisitos com segurança nesta descrição. Por isso, nenhuma porcentagem é exibida. Tente
          colar a vaga com cabeçalhos como “Requisitos obrigatórios” e “Requisitos desejáveis”, em lista.
        </p>
      )}
      <p className="mt-5 border-t border-border pt-4 text-sm font-medium text-foreground">
        Não é nota de ATS nem previsão de contratação.
      </p>
      {!r.structured && c.reliable && (
        <p className="mt-2 text-sm text-muted-foreground">
          A vaga não tem cabeçalhos claros: os requisitos foram inferidos de listas e competências reconhecidas. Confira a matriz.
        </p>
      )}
      {r.missingMandatory.length > 0 && (
        <div className="mt-4 rounded-md border border-missing/30 bg-missing-soft p-4">
          <p className="text-sm font-semibold text-missing">Obrigatórios sem evidência textual ({r.missingMandatory.length})</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
            {r.missingMandatory.map((m) => (
              <li key={m.requirement.id}>{m.requirement.text}</li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}

export function Matrix({ r }: { r: AnalysisResult }) {
  return (
    <Section title="Matriz requisito × evidência" id="sec-matrix">
      <ul className="divide-y divide-border">
        {r.matrix.map((m) => (
          <li key={m.requirement.id} className="grid gap-2 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryTag category={m.requirement.category} />
                <StatusBadge status={m.status} />
              </div>
              <p className="font-medium text-foreground">{m.requirement.text}</p>
            </div>
            <div className="text-sm">
              {m.evidence ? (
                <blockquote className="border-l-2 border-secondary pl-3 italic text-foreground">“{m.evidence}”</blockquote>
              ) : (
                <p className="text-muted-foreground">Sem trecho correspondente — não consta no texto.</p>
              )}
              <p className="mt-1.5 text-muted-foreground">{m.note}</p>
            </div>
          </li>
        ))}
      </ul>
      {r.matrix.some((m) => m.requirement.category === "responsabilidade") && (
        <p className="mt-3 text-xs text-muted-foreground">Responsabilidades aparecem como contexto e não entram na cobertura.</p>
      )}
    </Section>
  );
}

export function Keywords({ r }: { r: AnalysisResult }) {
  const chip = "inline-flex rounded-full border px-3 py-1 text-sm";
  return (
    <Section title="Palavras-chave" id="sec-keywords">
      <p className="mb-4 text-sm text-muted-foreground">
        Presença de palavra não comprova competência — use a matriz acima para ver o contexto.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-evidence">Palavras-chave encontradas</h4>
          <div className="flex flex-wrap gap-2">
            {r.keywordsFound.length ? r.keywordsFound.map((k) => <span key={k} className={`${chip} border-evidence/30 bg-evidence-soft text-evidence`}>{k}</span>) : <span className="text-sm text-muted-foreground">Nenhuma reconhecida.</span>}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold text-missing">Palavras-chave a verificar</h4>
          <div className="flex flex-wrap gap-2">
            {r.keywordsToCheck.length ? r.keywordsToCheck.map((k) => <span key={k} className={`${chip} border-missing/30 bg-missing-soft text-missing`}>{k}</span>) : <span className="text-sm text-muted-foreground">Nenhuma.</span>}
          </div>
        </div>
      </div>
    </Section>
  );
}

export function Suggestions({ items }: { items: Suggestion[] }) {
  const label = { valorizar: "Valorizar", lacuna: "Lacuna", revisar: "Revisar", geral: "Lembrete" } as const;
  return (
    <Section title="Sugestões seguras" id="sec-suggestions">
      <ul className="space-y-3">
        {items.map((s, i) => (
          <li key={i} className="flex gap-3 text-sm">
            {s.kind === "valorizar" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-evidence" aria-hidden /> : <Lightbulb className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden />}
            <p><span className="font-semibold text-primary">{label[s.kind]}: </span>{s.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

interface EditorProps {
  text: string;
  onChange: (t: string) => void;
  restructured: boolean;
  onPrint: () => void;
  onDownload: () => void;
  canExport: boolean;
}

export function ResumeEditor({ text, onChange, restructured, onPrint, onDownload, canExport }: EditorProps) {
  const [copied, setCopied] = useState(false);
  return (
    <Section title="Currículo reorganizado para ATS" id="sec-resume">
      <p className="mb-3 text-sm text-muted-foreground">
        {restructured
          ? "Reorganizado com cabeçalhos simples e a mesma informação do seu texto. Nada foi acrescentado além de cabeçalhos e de uma linha com termos que já aparecem no seu currículo. Edite livremente antes de exportar."
          : "Não foi possível identificar seções com segurança, então mostramos seu texto original formatado, sem otimização automática. Use as sugestões para ajustar manualmente."}
      </p>
      <label htmlFor="resume-out" className="sr-only">Currículo ajustado (editável)</label>
      <Textarea id="resume-out" value={text} onChange={(e) => onChange(e.target.value)} className="min-h-[420px] bg-background font-mono text-[13px] leading-relaxed" />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={onPrint} disabled={!canExport}><Printer aria-hidden />Exportar PDF</Button>
        <Button variant="outline" disabled={!canExport} onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
          <Copy aria-hidden />{copied ? "Copiado!" : "Copiar currículo"}
        </Button>
        <Button variant="outline" onClick={onDownload} disabled={!canExport}><Download aria-hidden />Baixar .txt</Button>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><FileText className="size-3.5" aria-hidden />No diálogo de impressão, escolha “Salvar como PDF”. Revise o texto antes de enviar a recrutadores.</p>
    </Section>
  );
}

const TITLES = /^[A-ZÀ-Ú][A-ZÀ-Ú\s&]{3,}$/;
export function PrintArea({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div id="print-area" aria-hidden>
      {lines.map((l, i) => (
        <p key={i} className={i === 0 ? "pl-name" : TITLES.test(l.trim()) ? "pl-title" : undefined}>{l || "\u00a0"}</p>
      ))}
    </div>
  );
}