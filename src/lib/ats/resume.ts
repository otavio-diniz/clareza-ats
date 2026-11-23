import type { AnalysisResult } from "./analysis";
import { CONCEPTS } from "./concepts";
import { normalize } from "./normalize";

const SECTION_DEFS: { key: string; title: string; re: RegExp }[] = [
  { key: "resumo", title: "RESUMO PROFISSIONAL", re: /^(resumo( profissional)?|perfil( profissional)?|sobre( mim)?|objetivo)$/ },
  { key: "experiencia", title: "EXPERIÊNCIA PROFISSIONAL", re: /^(experiencias?( profissionais?| profissional)?|historico profissional|atuacao profissional)$/ },
  { key: "formacao", title: "FORMAÇÃO ACADÊMICA", re: /^(formacao( academica)?|educacao|escolaridade)$/ },
  { key: "habilidades", title: "HABILIDADES", re: /^(habilidades|competencias|competencias tecnicas|conhecimentos|skills|ferramentas)$/ },
  { key: "cursos", title: "CURSOS E CERTIFICAÇÕES", re: /^(cursos|certificacoes|cursos e certificacoes|cursos complementares)$/ },
  { key: "idiomas", title: "IDIOMAS", re: /^(idiomas|linguas)$/ },
];
const ORDER = ["resumo", "experiencia", "habilidades", "formacao", "cursos", "idiomas"];

export interface ParsedSection {
  key: string;
  title: string;
  lines: string[];
}

export function parseResume(cv: string): { identity: string[]; sections: ParsedSection[] } {
  const identity: string[] = [];
  const sections: ParsedSection[] = [];
  let cur: ParsedSection | null = null;
  for (const raw of cv.split(/\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const n = normalize(line).replace(/[:#*]/g, "").trim();
    const def = n.length <= 40 ? SECTION_DEFS.find((d) => d.re.test(n)) : undefined;
    if (def) {
      cur = sections.find((s) => s.key === def.key) ?? null;
      if (!cur) {
        cur = { key: def.key, title: def.title, lines: [] };
        sections.push(cur);
      }
      continue;
    }
    if (!cur && n.length <= 40 && line === line.toUpperCase() && /[A-ZÀ-Ú]{4}/.test(line) && identity.length > 0) {
      cur = { key: `outro-${sections.length}`, title: line.replace(/:$/, ""), lines: [] };
      sections.push(cur);
      continue;
    }
    (cur ? cur.lines : identity).push(line);
  }
  return { identity, sections };
}

const BULLET = /^\s*([-•*–·])\s+/;

/**
 * Reorganiza o currículo com cabeçalhos simples. Nunca adiciona fatos: todo conteúdo
 * vem literalmente do currículo; o único texto novo são cabeçalhos e a lista de termos
 * que já aparecem no próprio currículo.
 */
export function buildAtsResume(cv: string, result: AnalysisResult | null): { text: string; restructured: boolean } {
  const { identity, sections } = parseResume(cv);
  if (sections.length === 0) {
    return { text: cv.trim().split(/\n/).map((l) => l.trim()).filter(Boolean).join("\n"), restructured: false };
  }
  const out: string[] = [...identity, ""];
  const sorted = [...sections].sort((a, b) => {
    const ia = ORDER.indexOf(a.key);
    const ib = ORDER.indexOf(b.key);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  for (const s of sorted) {
    out.push(s.title);
    for (const l of s.lines) out.push(BULLET.test(l) ? `- ${l.replace(BULLET, "")}` : l);
    if (s.key === "resumo" && result) {
      const literal = literalTermsInCv(cv, result);
      if (literal.length) out.push(`Termos do currículo alinhados à vaga: ${literal.join(", ")}.`);
    }
    out.push("");
  }
  return { text: out.join("\n").trim(), restructured: true };
}

/** Termos da vaga que aparecem literalmente no currículo, na grafia do próprio currículo. */
export function literalTermsInCv(cv: string, result: AnalysisResult): string[] {
  const terms: string[] = [];
  const nCv = normalize(cv);
  for (const row of result.matrix) {
    if (row.status !== "evidencia") continue;
    for (const id of row.requirement.concepts) {
      const c = CONCEPTS.find((x) => x.id === id);
      if (!c || id === "coordenacao") continue;
      const m = c.cv.exec(nCv);
      if (!m) continue;
      const original = cv.substr(m.index, m[0].length);
      if (normalize(original) === m[0] && !terms.includes(original)) terms.push(original);
    }
  }
  return terms;
}

export function pdfDocumentTitle(version: number, date = new Date()): string {
  const d = date.toISOString().slice(0, 10);
  return `curriculo-ajustado-v${version}-${d}`;
}