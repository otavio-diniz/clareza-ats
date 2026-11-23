# Decisões e validação

## Sequência de desenvolvimento
1. Leitura do enunciado da DIO e dos exemplos do docente.
2. Consulta metodológica ao Radar de Vagas — **reutilização de lógica e princípios, não de dados pessoais, planilhas, currículos ou candidaturas**.
3. Criação de mega prompt original para o projeto no Lovable em 23/11/2026.
4. Geração do código: interface, utilitários de comparação e testes automatizados.
5. A execução do agente foi interrompida pelo esgotamento dos créditos gratuitos. O código já gravado foi exportado para GitHub. Isso não significa que a interface ou a exportação PDF tenham sido testadas com sucesso.

## Escolhas e limites
- Classificar requisitos obrigatórios e desejáveis e justificar cada conclusão com trecho literal.
- Diferenciar evidência textual, experiência transferível, ausência no texto e revisão necessária.
- Não inventar cargo, habilidade, certificação, fluência nem métricas.
- Gerar currículo reorganizado conservadoramente, deixando a edição final ao usuário.
- Tratar o percentual como cobertura heurística, nunca como nota de ATS.
- Processamento de texto em memória local, sem integrações de recrutamento, banco de dados ou conta de usuário.

## Cenário sintético de aceitação
A vaga fictícia traz 5 requisitos obrigatórios (coordenação de equipe, indicadores, CRM, Excel avançado, Power BI) e 3 desejáveis (B2B, metodologias ágeis, inglês). O CV fictício sustenta 3 obrigatórios e 1 desejável. O esperado é 4/8 evidências (50%) — **resultado esperado e não prova de execução**. Excel com tabelas dinâmicas não deve virar Excel avançado. Falta de Power BI não pode gerar a inserção da competência no CV.

## Plano de verificação
Executar `npm test`, `npm run lint`, `npm run build`, inspeção de dependências e scan de segredos antes de disponibilizar publicamente. Verificar em navegador exemplo fictício, campos vazios, correspondências, edição e impressão A4/PDF, acesso mobile e console. O site só será declarado publicado após comprovação independente por acesso externo.

## Evidências de teste
A seção será atualizada com data, versão e saídas efetivas após execução. **Não utilizar relatos genéricos do agente como PASS independente.**


## Relatório técnico comprovado — 23/11/2026
**Origem do código:** projeto Lovable `f98d5cdd-e324-4116-984a-1ecbee0f11d6`. Geração interrompida pelo limite gratuito do agente após criação dos arquivos. Importação da revisão existente para GitHub realizada com commits auditáveis. O repositório privado foi clonado em ambiente Windows com Node.js 26.13.1, npm 11.20.0 e dependências instaladas; posteriormente corrigidas para a revisão pública.

**Validação automatizada:** `npm test` — Vitest 4.1.12, 2 arquivos de testes, **15 aprovados / 0 falhas**, incluindo cenário ficcional 4/8 e preservação de conteúdo do CV. A prova é o processo local concluído com **exit code 0**, não um relato do agente Lovable.

**Lint:** após normalizar a formatação, `npm run lint` finalizou com **0 erros, 6 avisos** `react-refresh/only-export-components` em componentes comuns de UI shadcn. O aviso não foi confundido com erro. `.gitattributes` foi incluído para padronizar LF em diferentes sistemas.

**Build:** `npm run build` — cliente, SSR e worker Nitro para produção compilados com **exit code 0**, Vite atualizado para **8.3.8**. Nenhum deploy externo foi executado pela compilação local.

**Dependências e segurança:** auditoria inicial `npm audit --omit=dev --audit-level=high` mostrou **2 advisories altos** (Vite 8.1.5 e Zod 3.25.76). Inspeção de `src` não revelou importação de Zod, por isso a dependência direta sem uso foi removida; Vite atualizado para 8.3.8. Nova execução de `npm audit --audit-level=high` reportou **found 0 vulnerabilities**. A versão reprodutível usa `package-lock.json` npm; `bun.lock` antigo foi retirado para não transmitir árvore divergente. Essa auditoria não comprova ausência universal de vulnerabilidades, nem substitui testes de penetração.

**Deploy e endereço público:** o Lovable retornou deployment_id `57b331cd-1e8f-443b-9a8a-19b28a63204b` e publicou `https://clareza-ats-otavio-diniz.lovable.app`. A API confirmou `is_published=true`, audiência pública, e uma requisição anônima à raiz retornou **HTTP 200** (HTML com título Clareza ATS). **Não foram realizados testes de uso do formulário em navegador nem exportação PDF efetiva.** O Lovable ainda exibe `needs_attention/out_of_credits` em seu agente, status distinto de hospedagem.

**Diferença entre versões:** a publicação Lovable deriva do commit próprio `dbcbc0337d6c8c00ad133dc3184c79668b48068f`; o código corrigido do GitHub deriva da importação textual e de commits de formatação, lockfile e dependências. O build/npm audit de código GitHub não são prova de que o ambiente Lovable adotou automaticamente essas correções. Não declarar snapshots equivalentes até reconciliação.

**Limitações remanescentes:** validação visual de edição, responsividade, navegação via teclado e impressão PDF; verificação independente das dependências da hospedagem; eventuais alertas do agente e sincronização Lovable ↔ GitHub. Nenhuma candidatura, comunicação externa com recrutadores ou inscrição na plataforma DIO foi executada.
