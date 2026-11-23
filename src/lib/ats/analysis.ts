import { CONCEPTS, detectConcepts, type Concept } from "./concepts";
import { normalize, splitSnippets, tokenize } from "./normalize";

export type Category = "obrigatorio" | "desejavel" | "responsabilidade" | "nao-classificado";
export type Status = "evidencia" | "transferivel" | "nao-identificado" | "revisao";

export interface Requirement {
  id: string;
  text: string;
  category: Category;
  concepts: string[];
}

export interface MatrixRow {
  requirement: Requirement;
  status: Status;
  /** Trecho literal do currículo, quando houver. */
  evidence: string | null;
  note: string;
}

export interface CoverageGroup {
  total: number;
  evidenced: number;
}

export interface AnalysisResult {
  requirements: Requirement[];
  matrix: MatrixRow[];
  coverage: {
    reliable: boolean;
    all: CoverageGroup;
    obrigatorio: CoverageGroup;
    desejavel: CoverageGroup;
    percent: number | null;
  };
  missingMandatory: MatrixRow[];
  keywordsFound: string[];
  keywordsToCheck: string[];
  structured: boolean;
}

const HEADERS: { re: RegExp; cat: Category }[] = [
  {
    re: /^(requisitos? )?(obrigatorios?|essenciais?|indispensaveis?|imprescindiveis?)\b|^requisitos?:?$|^o que (buscamos|esperamos)|^qualificacoes:?$/,
    cat: "obrigatorio",
  },
  {
    re: /^(requisitos? )?(desejaveis?|diferenciais?)|^sera um diferencial|^(e )?um plus|^nice to have/,
    cat: "desejavel",
  },
  {
    re: /^(responsabilidades|atribuicoes|atividades|principais atividades|o que voce vai fazer)/,
    cat: "responsabilidade",
  },
  {
    re: /^(beneficios|sobre a empresa|sobre nos|local|salario|remuneracao|regime|como se candidatar)/,
    cat: "nao-classificado",
  },
];

function headerCategory(line: string): Category | "ignorar" | null {
  const n = normalize(line)
    .replace(/[:\-–#*]+\s*$/g, "")
    .replace(/^[#*\s]+/, "")
    .trim();
  if (n.length > 60) return null;
  for (const h of HEADERS) {
    if (h.re.test(n)) {
      if (/^(beneficios|sobre|local|salario|remuneracao|regime|como se)/.test(n)) return "ignorar";
      return h.cat;
    }
  }
  return null;
}

const BULLET = /^\s*([-•*–·]|\d+[.)])\s+/;

export function extractRequirements(job: string): {
  requirements: Requirement[];
  structured: boolean;
} {
  const lines = job
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const reqs: Requirement[] = [];
  let current: Category | "ignorar" | null = null;
  let structured = false;
  const hasHeaders = lines.some((l) => headerCategory(l) !== null);

  for (const raw of lines) {
    const hc = headerCategory(raw);
    if (hc) {
      current = hc;
      structured = true;
      continue;
    }
    if (current === "ignorar") continue;
    const text = raw.replace(BULLET, "").trim();
    const n = normalize(text);
    const concepts = detectConcepts(n).map((c) => c.id);
    if (current) {
      if (tokenize(text).length === 0) continue;
      let cat: Category = current;
      if (current === "obrigatorio" && /desejavel|diferencial/.test(n)) cat = "desejavel";
      reqs.push({ id: `r${reqs.length + 1}`, text, category: cat, concepts });
    } else if (BULLET.test(raw) || (!hasHeaders && concepts.length > 0)) {
      // Vaga sem cabeçalhos: só considera bullets ou linhas com competências reconhecidas.
      if (concepts.length === 0 && tokenize(text).length < 2) continue;
      if (text.length > 220 && concepts.length === 0) continue;
      const cat: Category = /desejavel|diferencial|plus/.test(n)
        ? "desejavel"
        : /obrigatori|essencial|necessari|imprescindivel/.test(n)
          ? "obrigatorio"
          : "nao-classificado";
      reqs.push({ id: `r${reqs.length + 1}`, text, category: cat, concepts });
    }
  }
  return { requirements: reqs, structured };
}

function findSnippet(snippets: string[], re: RegExp): string | null {
  for (const s of snippets) if (re.test(normalize(s))) return s;
  return null;
}

function evaluateConcept(c: Concept, snippets: string[]): Omit<MatrixRow, "requirement"> {
  const ev = findSnippet(snippets, c.cv);
  if (ev)
    return { status: "evidencia", evidence: ev, note: `Trecho do currículo menciona ${c.label}.` };
  if (c.partial) {
    const p = findSnippet(snippets, c.partial.cv);
    if (p) return { status: "revisao", evidence: p, note: c.partial.note };
  }
  if (c.transfer) {
    const t = findSnippet(snippets, c.transfer.cv);
    if (t) return { status: "transferivel", evidence: t, note: c.transfer.note };
  }
  return {
    status: "nao-identificado",
    evidence: null,
    note: `${c.label} não consta no texto do currículo.`,
  };
}

function evaluateByTokens(text: string, snippets: string[]): Omit<MatrixRow, "requirement"> {
  const tokens = [...new Set(tokenize(text))];
  if (tokens.length === 0)
    return {
      status: "revisao",
      evidence: null,
      note: "Requisito genérico demais para comparar com segurança.",
    };
  let best: { s: string; ratio: number } | null = null;
  for (const s of snippets) {
    const st = new Set(tokenize(s));
    const hit = tokens.filter((t) => st.has(t)).length / tokens.length;
    if (!best || hit > best.ratio) best = { s, ratio: hit };
  }
  if (best && best.ratio === 1 && tokens.length >= 2)
    return {
      status: "evidencia",
      evidence: best.s,
      note: "Todos os termos relevantes aparecem no mesmo trecho do currículo.",
    };
  if (best && best.ratio >= 0.5)
    return {
      status: "revisao",
      evidence: best.s,
      note: "Parte dos termos aparece no currículo; confirme se o trecho realmente sustenta o requisito.",
    };
  return {
    status: "nao-identificado",
    evidence: null,
    note: "Não consta no texto do currículo (comparação por termos).",
  };
}

const RANK: Record<Status, number> = {
  "nao-identificado": 0,
  transferivel: 1,
  revisao: 2,
  evidencia: 3,
};

export function evaluateRequirement(req: Requirement, cv: string): MatrixRow {
  const snippets = splitSnippets(cv);
  if (req.concepts.length === 0)
    return { requirement: req, ...evaluateByTokens(req.text, snippets) };
  const parts = req.concepts.map((id) =>
    evaluateConcept(
      CONCEPTS.find((c) => c.id === id)!,
      snippets,
    ),
  );
  const worst = parts.reduce((a, b) => (RANK[b.status] < RANK[a.status] ? b : a));
  const anyEvidence = parts.some((p) => p.status === "evidencia");
  if (parts.length > 1 && worst.status !== "evidencia" && anyEvidence) {
    return {
      requirement: req,
      status: "revisao",
      evidence: parts.find((p) => p.status === "evidencia")!.evidence,
      note: "Evidência parcial: " + parts.map((p) => p.note).join(" "),
    };
  }
  return { requirement: req, ...worst, note: parts.map((p) => p.note).join(" ") };
}

function group(rows: MatrixRow[]): CoverageGroup {
  return { total: rows.length, evidenced: rows.filter((r) => r.status === "evidencia").length };
}

export function analyze(job: string, cv: string): AnalysisResult {
  const { requirements, structured } = extractRequirements(job);
  const matrix = requirements.map((r) => evaluateRequirement(r, cv));
  const counted = matrix.filter((r) => r.requirement.category !== "responsabilidade");
  const all = group(counted);
  const reliable = all.total >= 2;
  const nCv = normalize(cv);
  const jobConcepts = [...new Set(requirements.flatMap((r) => r.concepts))]
    .map((id) => CONCEPTS.find((c) => c.id === id)!)
    .filter(Boolean);
  const keywordsFound = jobConcepts.filter((c) => c.cv.test(nCv)).map((c) => c.label);
  const keywordsToCheck = jobConcepts.filter((c) => !c.cv.test(nCv)).map((c) => c.label);
  return {
    requirements,
    matrix,
    coverage: {
      reliable,
      all,
      obrigatorio: group(counted.filter((r) => r.requirement.category === "obrigatorio")),
      desejavel: group(counted.filter((r) => r.requirement.category === "desejavel")),
      percent: reliable ? Math.round((all.evidenced / all.total) * 100) : null,
    },
    missingMandatory: counted.filter(
      (r) => r.requirement.category === "obrigatorio" && r.status !== "evidencia",
    ),
    keywordsFound,
    keywordsToCheck,
    structured,
  };
}

export interface ValidationError {
  field: "job" | "cv";
  message: string;
}

export function validateInputs(job: string, cv: string): ValidationError[] {
  const errs: ValidationError[] = [];
  const j = job.trim();
  const c = cv.trim();
  if (!j) errs.push({ field: "job", message: "Cole a descrição da vaga para iniciar a análise." });
  else if (j.length < 80)
    errs.push({
      field: "job",
      message: `A descrição da vaga está curta demais (${j.length} caracteres). Cole pelo menos 80, incluindo os requisitos.`,
    });
  if (!c)
    errs.push({ field: "cv", message: "Cole o texto do seu currículo para iniciar a análise." });
  else if (c.length < 150)
    errs.push({
      field: "cv",
      message: `O currículo está curto demais (${c.length} caracteres). Cole pelo menos 150, com experiências e formação.`,
    });
  else if (c.split(/\n/).filter((l) => l.trim()).length < 3)
    errs.push({
      field: "cv",
      message:
        "O currículo parece incompleto: cole o texto com quebras de linha (nome, experiências, formação).",
    });
  return errs;
}
