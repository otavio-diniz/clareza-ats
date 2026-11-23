export interface Concept {
  id: string;
  label: string;
  /** Detecta o conceito no texto da vaga (texto normalizado). */
  job: RegExp;
  /** Evidência literal no currículo (texto normalizado). */
  cv: RegExp;
  /** Se presente: o currículo menciona a base, mas não o nível exigido. */
  partial?: { cv: RegExp; note: string };
  /** Aproximações transferíveis — nunca contam como evidência. */
  transfer?: { cv: RegExp; note: string };
  /** Conceitos mais genéricos que este substitui na mesma linha. */
  supersedes?: string[];
}

export const CONCEPTS: Concept[] = [
  {
    id: "coordenacao",
    label: "Coordenação de equipe",
    job: /coordena\w*|lideranca de equipe|gestao de equipe|liderar equipe|gerir equipe/,
    cv: /(coorden\w*|lider\w*|supervision\w*|gerenci\w*)[^.\n]{0,50}(equipe|time|analistas|pessoas|colaboradores|rotina)/,
    transfer: {
      cv: /(treinei|treinamento de|mentor\w*|onboarding de)[^.\n]{0,40}(analistas|colegas|equipe|pessoas)/,
      note: "Treinar ou orientar colegas é relacionado, mas não equivale a coordenar equipe.",
    },
  },
  {
    id: "indicadores",
    label: "Indicadores",
    job: /indicador\w*|kpis?\b|metricas/,
    cv: /indicador\w*|\bkpis?\b|metricas/,
  },
  { id: "crm", label: "CRM", job: /\bcrm\b/, cv: /\bcrm\b/ },
  {
    id: "excel-avancado",
    label: "Excel avançado",
    job: /excel avancado|excel \(avancado\)|excel em nivel avancado/,
    cv: /excel[^.\n]{0,15}avancado|avancado em excel/,
    partial: {
      cv: /\bexcel\b/,
      note: "O currículo menciona Excel, mas não declara nível avançado. Recursos como tabelas dinâmicas não comprovam, sozinhos, esse nível.",
    },
    supersedes: ["excel"],
  },
  { id: "excel", label: "Excel", job: /\bexcel\b/, cv: /\bexcel\b/ },
  {
    id: "powerbi",
    label: "Power BI",
    job: /power ?bi\b/,
    cv: /power ?bi\b/,
    transfer: {
      cv: /\btableau\b|\blooker\b|\bqlik\w*/,
      note: "Outra ferramenta de BI aparece no currículo. É experiência relacionada, não equivalente a Power BI.",
    },
  },
  { id: "b2b", label: "B2B", job: /\bb2b\b/, cv: /\bb2b\b/ },
  {
    id: "ageis",
    label: "Metodologias ágeis",
    job: /\bageis\b|\bagil\b|scrum|kanban/,
    cv: /\bageis\b|\bagil\b|scrum|kanban/,
  },
  { id: "ingles", label: "Inglês", job: /\bingles\b|english/, cv: /\bingles\b|english/ },
  { id: "espanhol", label: "Espanhol", job: /espanhol|spanish/, cv: /espanhol|spanish/ },
  { id: "sql", label: "SQL", job: /\bsql\b/, cv: /\bsql\b/ },
  { id: "python", label: "Python", job: /\bpython\b/, cv: /\bpython\b/ },
  { id: "negociacao", label: "Negociação", job: /negocia\w*/, cv: /negocia\w*/ },
  { id: "comunicacao", label: "Comunicação", job: /comunicac\w*/, cv: /comunicac\w*/ },
  { id: "erp", label: "ERP", job: /\berp\b|\bsap\b|totvs/, cv: /\berp\b|\bsap\b|totvs/ },
  { id: "git", label: "Git", job: /\bgit\b|github/, cv: /\bgit\b|github/ },
  { id: "react", label: "React", job: /\breact\b/, cv: /\breact\b/ },
  { id: "typescript", label: "TypeScript", job: /typescript/, cv: /typescript/ },
  { id: "javascript", label: "JavaScript", job: /javascript/, cv: /javascript/ },
  { id: "atendimento", label: "Atendimento ao cliente", job: /atendimento/, cv: /atendimento/ },
  {
    id: "projetos",
    label: "Gestão de projetos",
    job: /gestao de projetos|gerenciamento de projetos/,
    cv: /(gestao|gerenciamento|gerenciei|conduzi)[^.\n]{0,20}projetos?/,
  },
];

export function detectConcepts(normalizedLine: string): Concept[] {
  const found = CONCEPTS.filter((c) => c.job.test(normalizedLine));
  const superseded = new Set(found.flatMap((c) => c.supersedes ?? []));
  return found.filter((c) => !superseded.has(c.id));
}
