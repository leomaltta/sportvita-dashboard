# <img src="./public/logo.png" alt="SportVita logo" width="40" style="vertical-align: middle;" /> SportVita Dashboard
<p align="left">
  <a href="README.md">English</a> | <b>Português</b>
</p>
O SportVita é um dashboard web criado para ajudar escolas a acompanhar a **saúde dos estudantes** por meio do esporte.

Este repositório é um **showcase** do lado “dashboard” do SportVita: indicadores, comparativos e regras de acesso pensadas para o fluxo real de uma escola (coordenação + professores).

## Sport Vita (contexto do projeto)
A Sport Vita é o conceito mais amplo: **alta performance & vitalidade contínua**, com uma usuabilidade simples e prática no lugar de planilhas e anotações espalhadas.

Se você quiser ver a visão mais "pitch” (o “porquê” do projeto), acesse o site de apresentação:

🔗 https://sportvita.vercel.app

## ✅ O que dá para fazer no Dashboard
- Dashboard geral com **médias de IMC** por subcategoria definida por idade
- Dashboards por esporte com indicadores específicos
- **Classificação de IMC** com status visual claro
- Gestão de estudantes e professores
- Painel administrativo para gerenciamento de usuários
- Controle de acesso por perfil (role)
- Visão por esporte para professores (o professor acessa apenas o próprio esporte)

## 🧠 Insights por esporte
Cada esporte tem uma página dedicada com foco em “saúde + desenvolvimento” por subcategoria. A ideia principal é dar para um administrador/coordenação uma forma mais clara de conversar sobre modalidades esportivas, por exemplo:
- entender a **intensidade média** de cada esporte (calorias/hora)
- ver como isso muda por **subcategorias por idade** (porque Sub-6 e Sub-12 não são comparáveis)

Na prática: a coordenação pode usar isso para orientar melhor conversas com pais/estudantes (ex.: *“esse esporte tende a ser mais exigente em média”*), sem ignorar diferenças de faixa etária.
- **Média de calorias/hora (kcal/h)** do esporte (estimativa educacional de intensidade)
- **Calorias/hora por subcategoria** (ex.: Sub-6 vs Sub-12 dentro do mesmo esporte)
- **Ranking de gasto calórico entre esportes** para comparar intensidade média
- **Status por subcategoria** para comunicar rapidamente como cada grupo está
- **Perfil educacional** do esporte:
  - principais músculos trabalhados
  - benefícios físicos
  - benefícios cognitivos
  - orientação de faixa etária ideal de início

## 💻 Tech Stack
- Next.js 16 (App Router)
- TypeScript 5
- Prisma 7
- PostgreSQL
- NextAuth
- Tailwind CSS + shadcn/ui
- Recharts

## 🧱 Arquitetura (mapa rápido)
- `src/app`: rotas e layouts
- `src/components`: UI, tabelas, gráficos e formulários
- `src/lib/actions`: ações no servidor (Server Actions)
- `src/lib`: utilitários de regras de negócio (IMC, autorização)
- `src/lib/sport-insights`: lógica de “perfil do esporte” (calorias + parte educacional) usada nas páginas de Esportes
- `prisma`: schema, client e seed

## 🔐 Acesso por `role`
- `admin`: acesso completo
- `prof`: acesso restrito ao esporte atribuído
- Operações sensíveis de estudantes (criar/editar/excluir) são validadas no servidor

## 🔧 Testes
Testes unitários cobrem lógicas críticas como:
- redirecionamento de autenticação no início
- comportamento do layout raiz
- classificação de IMC (`classifyBMI`)
- autorização de rotas por perfil/esporte (`authz`)

## 🔗 Links
- Site de apresentação: https://sportvita.vercel.app
- Dashboard: https://sportvita-dashboard.vercel.app
- Repositório: https://github.com/leomaltta/sportvita-dashboard
