# Engenharia de prompts, decisões de produto e validação

Este documento descreve **decisões verificáveis do Clareza ATS** e a evidência técnica necessária para reproduzir o comportamento. A documentação destina-se a quem avalia o produto e seu código, não é um histórico de operação de agentes.

## Objetivo do produto e decisões

| Decisão | Implementação | Motivo |
|---|---|---|
| Processamento local | Campos e comparação realizados na interface React; sem conta de usuário ou banco próprio de currículos | Reduzir complexidade e exposição de dados para um MVP educacional |
| Requisitos classificados | Obrigatórios, desejáveis, responsabilidades e termos não classificados | Separar exigência principal de contexto da vaga |
| Matriz explicável | Cada requisito traz estado, justificativa e, quando presente, trecho literal do CV | Evitar um percentual opaco sem evidência |
| Correspondência conservadora | Excel + tabelas dinâmicas não prova Excel avançado; Tableau não comprova Power BI | Não inventar proficiência nem equivalência |
| Cobertura textual | Evidências de requisitos divididas pelo total de requisitos identificados; responsabilidades ficam fora da contagem | Mostrar uma heurística transparente, **não uma pontuação real de ATS** |
| Preservação de histórico | Currículo é reorganizado com conteúdo originado no texto de entrada; revisão manual antes de exportar | Melhorar apresentação sem criar fatos |
| PDF via impressão | Página A4 formatada com CSS de impressão e ação “Salvar como PDF” do navegador | Exportar sem API externa e sem processamento remoto do CV |

### O que foi solicitado ao Lovable

O [mega prompt de construção efetivamente utilizado](mega-prompt-original.md) está publicado **integralmente e sem substituições por síntese editorial**. Ele define o fluxo, shadcn/ui, paleta, regras de correspondência, restrições de privacidade, dados fictícios, PDF e suíte de testes.

O primeiro conjunto de arquivos implementou a interface, a heurística de análise, a reorganização curricular e o exemplo sintético. **Não há evidência de um segundo mega prompt ou de mensagens adicionais de mudança de funcionalidades enviadas ao agente Lovable neste projeto.** Portanto, não apresentamos ajustes de engenharia realizados no GitHub como se fossem mensagens históricas do editor Lovable.

### O que mudou após a primeira geração — e por quê

A revisão técnica do **código exportado** introduziu ajustes no repositório:

1. **Portabilidade de finais de linha e estilo:** normalização do código, `.gitattributes` e correção de erros de Prettier observados em clone Windows; o lint passou a encerrar com zero erros. Permaneceram seis avisos de Fast Refresh em componentes genéricos de UI.
2. **Gerenciamento de dependências reproduzível:** manutenção de `package-lock.json` como lockfile npm canônico e retirada de `bun.lock` da versão de reprodução, evitando duas árvores de dependências com resoluções divergentes.
3. **Tratamento de advisories:** atualização de Vite de 8.1.5 para 8.3.8 e remoção da dependência direta Zod 3.x, que não era importada pelos módulos `src` deste aplicativo. Auditoria npm posterior reportou zero vulnerabilidades conhecidas na resolução analisada.
4. **Documentação profissional e prova de uso:** README ordenado pelo valor ao visitante, guia de reprodução, atribuições, direitos e captura autêntica da análise fictícia no navegador público.

Essas mudanças **não foram implementadas automaticamente no ambiente hospedado pelo Lovable**. A aplicação publicada e o código do GitHub não são declarados idênticos em bytes, dependências ou artefato final; a auditoria npm da revisão GitHub não pode ser aplicada como prova de segurança do snapshot do provedor.

## Exemplo sintético e interpretação correta

O exemplo embutido usa uma vaga de coordenação comercial em empresa fictícia. Há cinco requisitos obrigatórios: coordenação de equipe, indicadores, CRM, Excel avançado e Power BI. Há três desejáveis: B2B, metodologias ágeis e inglês.

O currículo fictício declara rotina de equipe, indicadores, CRM e B2B. O resultado observado na execução pública foi **4/8 (50%)**, discriminado como **3/5** obrigatórios e **1/3** desejáveis. *Excel avançado* requer revisão; *Power BI* não consta no texto do CV. Nenhum dos dois deve ser acrescentado automaticamente ao currículo ajustado.

A palavra “evidência” significa **trecho escrito no currículo**; não equivale a verificação externa de experiência profissional. Um resultado com 50% não significa “50% de chance de contratação”.

## Como verificar independentemente

A [rotina reprodutível, com comandos, saídas esperadas e troubleshooting](guia-reproducao.md) é a fonte canônica para a execução local. O README apresenta apenas o Quickstart.

### Evidências técnicas de 23/11/2026

| Verificação | Resultado observado | Escopo |
|---|---|---|
| Vitest | **15 testes aprovados em 2 arquivos**, exit 0 | Regras do ATS, caso sintético, preservação de dados, validações e teste de rota |
| ESLint | **0 erros, 6 avisos**, exit 0 | Código e componentes compartilhados |
| TypeScript | `npx tsc --noEmit`, exit 0 | Checagem estática |
| Compilação Vite/Nitro | `npm run build`, exit 0 | Build de produção do repositório |
| npm audit | **0 vulnerabilidades reportadas** após correção | Dependências resolvidas com npm naquela data |
| Navegador público | Página inicial acessível; botão exemplo e análise funcionais | Exemplo fictício, matriz, indicador, CV editável |
| Impressão no Chromium | PDF gerado por `Page.printToPDF` com 76.096 bytes | Geração do arquivo, não inspeção integral de todas as páginas |

A captura de tela **autêntica**, obtida do aplicativo publicado com dados sintéticos, está em [assets/screenshots/analise-exemplo-ficticio-20261123.png](../assets/screenshots/analise-exemplo-ficticio-20261123.png).

### Segurança e limites da evidência

Uma verificação textual preliminar no código versionado não encontrou padrões comuns de tokens, chaves privadas ou caminhos locais. Essa checagem e o `npm audit` são **limitados ao que inspecionaram**: não constituem teste de invasão, certificação LGPD, garantia de ausência absoluta de segredos, nem auditoria de dependências do hosting Lovable.

O aplicativo não cria perfil, não armazena o currículo em banco próprio e realiza a comparação em memória da página. Uma demonstração pública deve usar **somente currículos e vagas fictícios**. Redes de distribuição e fontes carregadas pelo navegador podem produzir metadados técnicos normais.

A revisão com tecnologias assistivas, múltiplos dispositivos físicos e uma inspeção visual abrangente de cada página de PDF são **limitações conhecidas do escopo de validação**, e não resultados aprovados por inferência.

## Aprendizados

- Uma pontuação legível precisa mostrar **qual texto** a sustenta.
- Match por palavra-chave não é prova de competência, sobretudo quando a vaga exige nível específico.
- A preservação de conteúdo factual é mais importante do que maximizar artificialmente a “aderência”.
- Um portfólio técnico se fortalece com reprodução independente, uma demonstração real e delimitação honesta das validações.
