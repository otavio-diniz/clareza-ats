import { describe, expect, it } from "vitest";
import { analyze, extractRequirements, validateInputs } from "./analysis";
import { normalize } from "./normalize";
import { buildAtsResume, pdfDocumentTitle } from "./resume";
import { buildSuggestions } from "./suggestions";
import { SAMPLE_CV, SAMPLE_JOB } from "./sample";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const r = analyze(SAMPLE_JOB, SAMPLE_CV);
const row = (t: string) => r.matrix.find((m) => m.requirement.text.includes(t))!;

describe("normalização", () => {
  it("remove acentos e caixa", () => {
    expect(normalize("Inglês AVANÇADO Coordenação")).toBe("ingles avancado coordenacao");
  });
});

describe("extração de requisitos", () => {
  it("separa obrigatórios e desejáveis pelos cabeçalhos", () => {
    const { requirements } = extractRequirements(SAMPLE_JOB);
    expect(requirements.filter((q) => q.category === "obrigatorio")).toHaveLength(5);
    expect(requirements.filter((q) => q.category === "desejavel")).toHaveLength(3);
  });
});

describe("exemplo fictício", () => {
  it("encontra 4/8 com evidência, 3/5 obrigatórios e 1/3 desejáveis", () => {
    expect(r.coverage.all).toEqual({ total: 8, evidenced: 4 });
    expect(r.coverage.obrigatorio).toEqual({ total: 5, evidenced: 3 });
    expect(r.coverage.desejavel).toEqual({ total: 3, evidenced: 1 });
    expect(r.coverage.percent).toBe(50);
  });
  it("cita trechos literais do currículo como evidência", () => {
    expect(row("Coordenação").status).toBe("evidencia");
    expect(SAMPLE_CV).toContain(row("Coordenação").evidence!);
    expect(row("CRM").status).toBe("evidencia");
    expect(row("B2B").status).toBe("evidencia");
  });
  it("Power BI não consta", () => {
    expect(row("Power BI").status).toBe("nao-identificado");
    expect(r.keywordsToCheck).toContain("Power BI");
  });
  it("tabelas dinâmicas não viram Excel avançado", () => {
    expect(row("Excel avançado").status).not.toBe("evidencia");
  });
  it("ágeis e inglês não constam", () => {
    expect(row("ágeis").status).toBe("nao-identificado");
    expect(row("Inglês").status).toBe("nao-identificado");
  });
});

describe("currículo ajustado não inventa", () => {
  const { text } = buildAtsResume(SAMPLE_CV, r);
  it("não insere termos ausentes nem cargo de gestão", () => {
    expect(normalize(text)).not.toContain("power bi");
    expect(normalize(text)).not.toContain("avancado");
    expect(normalize(text)).not.toMatch(/ingles|ageis|gerente/);
  });
  it("preserva todas as linhas do original", () => {
    for (const l of SAMPLE_CV.split("\n")
      .map((x) => x.replace(/^- /, "").trim())
      .filter(Boolean)) {
      if (/^(Resumo|Experiência|Formação|Habilidades)$/.test(l)) continue;
      expect(text).toContain(l);
    }
  });
  it("sugestões de lacuna são condicionais", () => {
    const s = buildSuggestions(r).filter((x) => x.kind === "lacuna");
    expect(s.length).toBeGreaterThan(0);
    for (const x of s) expect(x.text).toContain("inclua apenas após confirmar");
  });
});

describe("validação", () => {
  it("rejeita entradas vazias e curtas", () => {
    expect(validateInputs("", "").map((e) => e.field)).toEqual(["job", "cv"]);
    expect(validateInputs("curta", "x".repeat(10))[0]!.message).toMatch(/curta/);
  });
  it("não calcula porcentagem sem requisitos confiáveis", () => {
    expect(
      analyze("Texto livre sem requisitos claros sobre a empresa.", SAMPLE_CV).coverage.percent,
    ).toBeNull();
  });
});

describe("PDF e privacidade", () => {
  it("versiona o nome do PDF", () => {
    const d = new Date("2026-11-23T00:00:00Z");
    expect(pdfDocumentTitle(1, d)).toBe("curriculo-ajustado-v1-2026-11-23");
    expect(pdfDocumentTitle(2, d)).toBe("curriculo-ajustado-v2-2026-11-23");
  });
  it("código da app não usa rede nem armazenamento", () => {
    const files: string[] = [];
    const walk = (d: string) => {
      for (const f of readdirSync(d)) {
        const p = join(d, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.tsx?$/.test(f) && !f.includes(".test.")) files.push(p);
      }
    };
    walk("src/lib/ats");
    walk("src/components/ats");
    files.push("src/routes/index.tsx");
    for (const f of files) {
      expect(readFileSync(f, "utf8")).not.toMatch(
        /fetch\(|localStorage|sessionStorage|XMLHttpRequest|document\.cookie|sendBeacon/,
      );
    }
  });
});
