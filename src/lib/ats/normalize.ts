/** Remove acentos e caixa, preservando o comprimento aproximado do texto. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export const STOPWORDS = new Set(
  (
    "a o e de da do das dos em no na nos nas um uma uns umas para por com sem que se ao aos as os " +
    "ou mais menos muito como sua seu suas seus ser ter estar ja nao sim pelo pela pelos pelas entre " +
    "sobre ate apos desde este esta estes estas isso esse essa experiencia vivencia conhecimento " +
    "conhecimentos dominio desejavel desejaveis obrigatorio obrigatorios requisito requisitos area " +
    "areas atuacao capacidade habilidade habilidades boa bom forte solido solida perfil candidato " +
    "candidata pessoa vaga empresa nivel etc tambem"
  ).split(/\s+/),
);

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9+#]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

/** Divide o texto em trechos citáveis (linhas e frases), mantendo o texto original. */
export function splitSnippets(text: string): string[] {
  return text
    .split(/\n+/)
    .flatMap((line) => line.split(/(?<=[.;!?])\s+/))
    .map((s) => s.replace(/^\s*[-•*–·]\s*/, "").trim())
    .filter((s) => s.length > 0);
}
