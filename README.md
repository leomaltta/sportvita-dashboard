# Sport Vita Dashboard

Plataforma web para monitoramento de saude escolar por esporte e subcategoria (Sub-6 a Sub-17), com foco em uso real por coordenacao e professores.

## Contexto

O projeto foi desenvolvido para apoiar o acompanhamento fisico de estudantes em ambiente escolar, centralizando dados que antes ficavam dispersos em planilhas e processos manuais.

## Principais funcionalidades

- Dashboard geral com medias de IMC por subcategoria
- Dashboard por esporte com indicadores especificos
- Classificacao de IMC com status visual
- Gestao de estudantes e professores
- Painel administrativo para cadastro de usuarios
- Controle de acesso por role (`admin` e `prof`)
- Escopo por esporte para professor (acessa apenas o proprio esporte)

## Stack

- Next.js 16 (App Router)
- TypeScript 5
- Prisma 7
- PostgreSQL
- NextAuth
- Tailwind CSS + shadcn/ui
- Recharts

## Arquitetura resumida

- `src/app`: rotas e layouts
- `src/components`: UI, tabelas, graficos e formularios
- `src/lib/actions`: mutacoes e leitura no servidor (Server Actions)
- `src/lib`: regras de negocio utilitarias (IMC, authz, constantes)
- `prisma`: schema, client e seed

## Seguranca e acesso

- `admin`: acesso completo
- `prof`: acesso restrito ao proprio esporte
- Operacoes sensiveis de estudantes (criar/editar/excluir) protegidas no servidor
- Provisionamento de professor cria usuario com senha padrao configuravel por ambiente

Variavel recomendada para producao:

```env
TEACHER_DEFAULT_PASSWORD="defina-uma-senha-forte"
```

## Scripts

```bash
npm run dev
npm run build
npm run test
npm run db:generate
npm run db:push
npm run db:seed
```

## Testes

O projeto inclui testes unitarios para regras de negocio criticas:

- redirecionamento de autenticacao da home
- layout raiz
- classificacao de IMC (`classifyBMI`)
- autorizacao de rotas por role/esporte (`authz`)

## Links

- App de apresentacao: https://sportvita.vercel.app
- Repositorio: https://github.com/leomaltta/sport-vita-dashboard-v1
