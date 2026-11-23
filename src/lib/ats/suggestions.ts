import type { AnalysisResult } from "./analysis";

export interface Suggestion {
  kind: "valorizar" | "lacuna" | "revisar" | "geral";
  text: string;
}

export function buildSuggestions(r: AnalysisResult): Suggestion[] {
  const out: Suggestion[] = [];
  for (const row of r.matrix) {
    if (row.requirement.category === "responsabilidade") continue;
    const req = row.requirement.text;
    if (row.status === "evidencia" && row.evidence) {
      out.push({
        kind: "valorizar",
        text: `“${req}”: seu currículo já traz “${row.evidence}”. Se houver resultados reais (números, escopo, prazos) ligados a esse trecho, considere detalhá-los.`,
      });
    } else if (row.status === "revisao") {
      out.push({
        kind: "revisar",
        text: `“${req}”: ${row.note} Se você realmente atende a esse requisito, descreva com suas palavras o que fez — inclua apenas após confirmar.`,
      });
    } else if (row.status === "transferivel") {
      out.push({
        kind: "revisar",
        text: `“${req}”: ${row.note} Você pode explicitar a experiência relacionada, sem apresentá-la como equivalente.`,
      });
    } else {
      out.push({
        kind: "lacuna",
        text: `“${req}” não consta no texto. Se você realmente possui essa experiência, inclua apenas após confirmar, citando onde e como a utilizou. Caso não possua, não adicione.`,
      });
    }
  }
  if (r.matrix.some((m) => /equipe|analistas/i.test(m.evidence ?? "")))
    out.push({
      kind: "geral",
      text: "Coordenar a rotina de uma equipe não equivale a um cargo formal de gestão. Mantenha o título do cargo exatamente como foi.",
    });
  out.push({
    kind: "geral",
    text: "Revise o texto final com atenção humana antes de enviar a recrutadores. Esta ferramenta é heurística.",
  });
  return out;
}
