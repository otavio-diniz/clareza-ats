# Guia de reprodução — Clareza ATS

O guia descreve como executar **o código versionado no GitHub** a partir de uma cópia limpa, com resultados esperados e diagnósticos. A aplicação pública é uma distribuição separada do Lovable; executar `npm run build` não publica nem altera automaticamente essa distribuição.

## Ambiente e escopo verificados

- Sistema utilizado nas verificações independentes: **Windows**.
- Versões de referência em 23/11/2026: **Node.js 26.13.1**, **npm 11.20.0**; Git e rede para baixar pacotes npm.
- Gerenciador de dependências canônico: **npm**, com `package-lock.json`. O projeto não utiliza Bun para reprodução.
- Outras versões e sistemas operacionais são plausíveis, mas não recebem homologação por extrapolação. O clone e as evidências devem ser associados ao commit testado.

## Clone e primeiro uso

```bash
git clone https://github.com/otavio-diniz/clareza-ats.git
cd clareza-ats
node --version
npm --version
npm ci --ignore-scripts
npm run dev
```

Abra o endereço local mostrado pelo Vite, normalmente um `http://localhost:...`, sem presumir a porta.

Para experimentar **sem instalação**, use a [aplicação pública](https://clareza-ats-otavio-diniz.lovable.app).

## Roteiro funcional com dados fictícios

1. Na página principal, clique em **Carregar exemplo fictício**. Deve preencher a descrição da vaga e o currículo com conteúdo demonstrativo.
2. Clique em **Analisar aderência**. O cenário de referência deve exibir **50% de cobertura textual (4/8 requisitos)**: **3/5 obrigatórios** e **1/3 desejáveis**.
3. Na matriz, confira *Excel avançado* classificado para revisão e *Power BI* sem evidência. Não confunda ausência no texto com ausência de habilidade pessoal.
4. Confira as palavras-chave e o currículo reorganizado. Ele não deve inventar proficiência, cargo ou experiência.
5. Edite a saída, selecione **Exportar PDF** e, no diálogo do navegador, **Salvar como PDF**. Revise visualmente o PDF resultante antes de compartilhar. Também há cópia e exportação de TXT.
6. Teste entradas vazias e insuficientes, reanálise, limpeza e navegação por teclado. Use apenas textos sintéticos.

O percentual é um **indicador heurístico de presença de evidências textuais**, não uma nota da plataforma ATS de recrutadores.

## Verificações de código

No diretório raiz do clone, em um terminal separado do servidor de desenvolvimento:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
npm audit --audit-level=high
```

**Resultados observados em 23/11/2026** no ambiente de referência, após correções de dependências/estilo no GitHub: Vitest **15 testes aprovados (2 arquivos)**, lint **0 erros / 6 avisos Fast Refresh** de componentes compartilhados, TypeScript **0 erros**, build Vite/Nitro bem-sucedido e `npm audit` reportando **0 vulnerabilidades na resolução npm então instalada**. Resultados futuros podem variar com ambiente, atualização e datas de novas advisories.

O build gera `.output/` e outros artefatos ignorados pelo Git. A publicação no Lovable exige o fluxo próprio de hospedagem.

## Arquitetura e localização do código

| Local | Responsabilidade |
|---|---|
| `src/routes/index.tsx` | Tela principal, estado dos campos e ações |
| `src/components/ats/` | Componentes do fluxo ATS e apresentação dos resultados |
| `src/lib/ats/analysis.ts` | Extração, matriz e indicador de cobertura |
| `src/lib/ats/concepts.ts` | Dicionário heurístico de competências |
| `src/lib/ats/resume.ts` | Reorganização fiel e nome da exportação |
| `src/lib/ats/sample.ts` | Vaga e currículo **fictícios** |
| `src/lib/ats/analysis.test.ts` | Testes de comportamento e salvaguardas |
| `src/test/` | Configuração e teste de integração da rota |

A versão de referência para código reproduzível é **o GitHub**, não a página do editor Lovable.

## Diagnóstico e portabilidade

| Sintoma | Diagnóstico recomendado |
|---|---|
| `npm ci` falha | Verifique pasta raiz, versões de Node/npm, conexão ao registro, integridade de `package-lock.json`. Não exclua o lockfile para mascarar o erro |
| Porta local ocupada | Abra a URL real exibida pelo servidor, sem assumir `5173` |
| O resultado não mostra 50% | Verifique se o botão carregou o **exemplo fictício íntegro** e se os dois textos permanecem intactos |
| Requisito incorreto | Inspecione o trecho de evidência e a regra aproximada em `src/lib/ats/concepts.ts`; não trate coincidência de palavra como prova profissional |
| PDF em branco ou desformatado | Ative **Salvar como PDF** no diálogo do navegador; use o modo de impressão, desative cabeçalhos extras se necessário e confira margens A4 |
| `navigator.clipboard` indisponível | Use a opção de baixar TXT ou copie manualmente o texto; permissões variam por navegador/contexto seguro |
| Erros de estilo por finais de linha | Confira `.gitattributes`, `git check-attr eol -- src/routes/index.tsx` e configurações do Git; a política pretendida é LF |
| Build falha após edição | Reproduza a partir de clone limpo e compare os manifestos npm; não misture gerenciadores de pacotes |

**Limitação de cobertura:** os 15 testes automatizados avaliam regras de negócio e rota, não leitores de tela, navegadores/dispositivos físicos, nem a renderização de cada página de PDF. O app de demonstração usa um exemplo sintético; não foi treinado nem calibrado contra ATS proprietários.

## Privacidade e segurança

A comparação é implementada localmente no navegador, sem backend próprio de currículos, login ou armazenamento persistente das entradas. Fontes remotas e a própria hospedagem podem registrar telemetria técnica e metadados convencionais. Demonstrações e reports devem conter apenas informações fictícias; não há auditoria integral de conformidade LGPD, aprovação de segurança ou selo ATS.
