# Clareza ATS

**Currículo fiel. Match explicável.** Aplicação educacional que compara uma descrição de vaga a um currículo colado, identifica requisitos e fornece uma versão conservadoramente reorganizada para revisão e exportação.

## Problema e proposta
Palavras-chave isoladas não demonstram a experiência de uma pessoa. A interface apresenta uma matriz de correspondência entre requisitos e evidências literais, explicita lacunas e dá sugestões de melhoria **sem inventar competências, certificados ou resultados**. O indicador de cobertura é uma **heurística textual**, não a pontuação oficial de um ATS ou previsão de contratação.

## Funcionalidades
- Entrada de vaga e currículo com validação e exemplo **100% fictício**.
- Requisitos obrigatórios, desejáveis e responsabilidades; matriz requisito × evidência com justificativa.
- Estados de evidência textual, possível transferência, revisão necessária e não identificado.
- Palavras-chave encontradas e pontos a verificar, com ênfase nas lacunas obrigatórias.
- Currículo reorganizado com seções simples, edição manual, impressão/salvamento em PDF, cópia e TXT.
- Layout responsivo em português, com React, TypeScript, Tailwind, shadcn/ui e testes Vitest.

## Estado do projeto
Código originalmente criado no [Lovable](https://lovable.dev/projects/f98d5cdd-e324-4116-984a-1ecbee0f11d6). A geração do agente foi interrompida pelo limite de créditos gratuitos; os arquivos existentes foram exportados a este repositório sem apresentar a interrupção como uma aprovação. O status de **testes, build, segurança e demonstração pública** deve ser sustentado por verificações reais, documentadas em [Decisões e validação](docs/decisoes-e-validacao.md).

## Como executar
Requisitos: Node.js e npm compatíveis com o projeto.

```bash
git clone https://github.com/otavio-diniz/clareza-ats.git
cd clareza-ats
npm install
npm run dev
```

Comandos de verificação disponíveis:

```bash
npm test
npm run lint
npm run build
```

A URL local será informada pelo terminal. No ambiente publicado, o usuário cola os textos, seleciona **Analisar aderência**, revisa a matriz, edita o currículo reorganizado e escolhe **Exportar PDF**, utilizando “Salvar como PDF” na impressão do navegador.

## Como a análise funciona
1. Identifica seções e requisitos da vaga por padrões explícitos (e termos aproximados em vagas menos estruturadas).
2. Normaliza acentos/maiúsculas e confronta conceitos relevantes com trechos do currículo.
3. Marca evidência textual, transferência possível, revisão ou ausência no texto, sem inferir formação e proficiência.
4. Exibe cobertura = requisitos com evidência / total de requisitos encontrados, discriminando obrigatórios e desejáveis.
5. Reorganiza **somente informações já presentes** no currículo, preservando a decisão de edição da pessoa.

**Limitação:** o algoritmo é baseado em regras e não reconhece todas as descrições de vaga, sinônimos ou equivalências profissionais. Ausência no texto ≠ ausência da competência. Revise o resultado antes de usar.

## Segurança e privacidade
Não há autenticação, banco de dados de currículos ou API de IA paga. Os textos são tratados no estado local da página e a análise de negócio não realiza transmissão deliberada dos textos para um serviço externo. O acesso à hospedagem pode produzir metadados de navegação normais. Evite informações reais em demonstrações públicas; não há promessa de certificação ATS.

## Documentação e evidências
- [Mega prompt **literal** efetivamente enviado ao Lovable](docs/mega-prompt-original.md).
- [Decisões de produto, processo e validação](docs/decisoes-e-validacao.md).
- Testes de lógica em `src/lib/ats/analysis.test.ts`; teste de rota em `src/test/app-routing.test.tsx`.
- A interface utiliza **exemplos fictícios**, não currículos nem processos do Radar de Vagas.

## Reconhecimento educacional
Aplicação independente desenvolvida para estudo no curso **Santander — Construa seu Primeiro App com IA**, disponibilizado pela [DIO](https://www.dio.me/) com referência ao [Santander Open Academy](https://www.santanderopenacademy.com/). As instituições não endossam nem operam esta aplicação.

## Direitos
Projeto de portfólio educacional. Não é concedida licença aberta ao código original sem manifestação expressa do titular. Bibliotecas e componentes de terceiros seguem as respectivas licenças.
