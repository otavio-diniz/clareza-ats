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
