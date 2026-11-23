import { createFileRoute } from "@tanstack/react-router";
import { Eraser, FlaskConical, RotateCcw, ScanSearch, ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
import { InputPanel } from "@/components/ats/InputPanel";
import { Coverage, Keywords, Matrix, PrintArea, ResumeEditor, Suggestions } from "@/components/ats/Results";
import { Button } from "@/components/ui/button";
import { analyze, validateInputs, type AnalysisResult, type ValidationError } from "@/lib/ats/analysis";
import { buildAtsResume, pdfDocumentTitle } from "@/lib/ats/resume";
import { SAMPLE_CV, SAMPLE_JOB } from "@/lib/ats/sample";
import { buildSuggestions } from "@/lib/ats/suggestions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clareza ATS — Currículo fiel. Match explicável." },
      { name: "description", content: "Compare seu currículo com uma vaga no próprio navegador, com evidências literais e sem inventar experiências." },
      { property: "og:title", content: "Clareza ATS — Currículo fiel. Match explicável." },
      { property: "og:description", content: "Matriz requisito × evidência, cobertura heurística e currículo reorganizado sem inventar nada." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const STEPS = [
  { t: "Cole a vaga", d: "Inclua os requisitos obrigatórios e desejáveis, de preferência em lista." },
  { t: "Cole seu currículo", d: "Texto simples com nome, experiências, formação e habilidades." },
  { t: "Revise as evidências", d: "Veja o que tem trecho comprobatório, o que falta e exporte o PDF." },
];

function Index() {
  const [job, setJob] = useState("");
  const [cv, setCv] = useState("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [resume, setResume] = useState("");
  const [restructured, setRestructured] = useState(false);
  const [version, setVersion] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const run = () => {
    const errs = validateInputs(job, cv);
    setErrors(errs);
    if (errs.length) {
      document.getElementById(errs[0]!.field === "job" ? "job" : "cv")?.focus();
      return;
    }
    const r = analyze(job, cv);
    const built = buildAtsResume(cv, r);
    setResult(r);
    setResume(built.text);
    setRestructured(built.restructured);
    setVersion((v) => v + 1);
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const clear = () => {
    setJob(""); setCv(""); setErrors([]); setResult(null); setResume("");
  };

  const print = () => {
    const prev = document.title;
    document.title = pdfDocumentTitle(version);
    window.print();
    document.title = prev;
  };

  const download = () => {
    const blob = new Blob([resume], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${pdfDocumentTitle(version)}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const err = (f: "job" | "cv") => errors.find((e) => e.field === f)?.message;

  return (
    <>
      <div className="no-print min-h-screen">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-xl font-semibold text-primary">Clareza ATS</span>
              <span className="hidden text-sm text-muted-foreground sm:inline">Currículo fiel. Match explicável.</span>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-evidence" aria-hidden />Tudo roda no seu navegador</span>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-5 pb-20">
          <section className="py-12 sm:py-16" aria-labelledby="hero-title">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-secondary">Currículo fiel. Match explicável.</p>
            <h1 id="hero-title" className="max-w-3xl text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              Veja o que seu currículo comprova para a vaga — e o que ainda não consta.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-foreground/80">
              Compare requisito por requisito com trechos literais do seu texto e receba uma versão organizada, sem nenhuma experiência inventada.
            </p>
            <p className="mt-5 inline-block rounded-md border border-accent/60 bg-accent/15 px-3 py-2 text-sm text-accent-foreground">
              A análise é heurística e não equivale à avaliação de um ATS de recrutamento.
            </p>
            <ol className="mt-10 grid gap-4 sm:grid-cols-3">
              {STEPS.map((s, i) => (
                <li key={s.t} className="rounded-lg border border-border bg-card p-5">
                  <span className="font-serif text-2xl text-accent">{i + 1}</span>
                  <h2 className="mt-1 text-base font-semibold text-primary">{s.t}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-label="Entrada de textos" className="rounded-xl border border-border bg-card/60 p-5 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <InputPanel id="job" label="Descrição da vaga" hint="Cole o anúncio completo, com os requisitos." value={job} onChange={setJob} error={err("job")} min={80} />
              <InputPanel id="cv" label="Seu currículo" hint="Cole o texto do currículo. Ele não sai deste navegador." value={cv} onChange={setCv} error={err("cv")} min={150} />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={run}><ScanSearch aria-hidden />{result ? "Reanalisar aderência" : "Analisar aderência"}</Button>
              <Button variant="outline" size="lg" onClick={() => { setJob(SAMPLE_JOB); setCv(SAMPLE_CV); setErrors([]); }}><FlaskConical aria-hidden />Carregar exemplo fictício</Button>
              <Button variant="ghost" size="lg" onClick={clear}><Eraser aria-hidden />Limpar</Button>
            </div>
            {job === SAMPLE_JOB && cv === SAMPLE_CV && (
              <p className="mt-3 text-sm text-muted-foreground">Exemplo 100% fictício: empresa, pessoa e dados inventados para demonstração.</p>
            )}
          </section>

          <div ref={resultRef} tabIndex={-1} aria-live="polite" className="mt-10 outline-none">
            {result && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-3xl font-semibold text-primary">Resultado da análise</h2>
                  <Button variant="outline" onClick={() => { clear(); document.getElementById("job")?.focus(); }}><RotateCcw aria-hidden />Nova análise</Button>
                </div>
                <Coverage r={result} />
                <Matrix r={result} />
                <Keywords r={result} />
                <ResumeEditor text={resume} onChange={setResume} restructured={restructured} onPrint={print} onDownload={download} canExport={resume.trim().length > 0} />
                <Suggestions items={buildSuggestions(result)} />
              </div>
            )}
          </div>
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto max-w-6xl space-y-2 px-5 py-8 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Privacidade:</strong> os textos ficam apenas na memória desta página e somem ao recarregar ou fechar. Nada é enviado, salvo ou rastreado.</p>
            <p>Projeto educacional de portfólio desenvolvido no contexto do bootcamp DIO com Santander. Não é produto oficial, nem afiliado ou endossado pela DIO ou pelo Santander, e não possui certificação de nenhum ATS.</p>
          </div>
        </footer>
      </div>
      {result && <PrintArea text={resume} />}
    </>
  );
}