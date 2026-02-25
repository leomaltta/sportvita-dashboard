# <img src="./public/logo.png" alt="SportVita logo" width="40" style="vertical-align: middle;" /> SportVita Dashboard 
<p align="left">
  <b>English</b> | <a href="README.pt-BR.md">Português</a>
</p>
SportVita is a web dashboard built to help schools track **student health** through sports.

This repo is a **showcase** of the dashboard side of SportVita: indicators, comparisons, and access rules designed around real school workflows (coordination + teachers).

## Sport Vita (project context)
Sport Vita is the broader concept: **high performance & long-term vitality** using simple, practical visibility instead of spreadsheets and scattered notes.

If you want the partner/pitch view of the idea (the “why”), check the presentation site:

🔗 https://sportvita.vercel.app

## ✅ What you can do in the Dashboard
- Global dashboard with **BMI averages** by category
- Sport-specific dashboards with dedicated indicators
- **BMI classification** with a clear visual status
- Student and teacher management
- Admin panel for user provisioning
- Role-based access control
- Sport-scoped access for teachers (teachers only access their own sport)



## 🧠 Sport insights
Each sport has a dedicated page focused on “health + development” by subcategory, the main goal is to give an administrator/coordinator a clearer way to talk about sports with context, for example:
- understanding the **average intensity** of each sport (calories/hour)
- seeing how that changes by **aged-subcategories** (because Sub-6 and Sub-12 are not comparable).

In practice: a coordinator can use this to better guide conversations with parents/students (e.g., *“this sport tends to be more demanding on average”*), while still respecting age differences.
- **Avg calories/hour (kcal/h)** for the sport (an educational intensity estimate)
- **Calories/hour by subcategory** (e.g., Sub-6 vs Sub-12 within the same sport)
- **Calorie ranking across sports** to compare average intensity
- **Subcategory status** to quickly communicate how each group is doing
- **Educational profile** of the sport:
  - main muscles involved
  - physical benefits
  - cognitive benefits
  - ideal starting age guidance

## 💻 Tech stack
- Next.js 16 (App Router)
- TypeScript 5
- Prisma 7
- PostgreSQL
- NextAuth
- Tailwind CSS + shadcn/ui
- Recharts

## 🧱 Architecture (quick map)
- `src/app`: routes and layouts
- `src/components`: UI, tables, charts, forms
- `src/lib/actions`: server-side reads/writes (Server Actions)
- `src/lib`: business rules utilities (BMI, authorization, constants)
- `src/lib/sport-insights`: calorie + educational “sport profile” logic used by the Sports pages
- `prisma`: schema, client, and seed

## 🔐 Access rules
- `admin`: full access
- `prof`: restricted to their assigned sport
- Sensitive student operations (create/edit/delete) are enforced on the server

## 🔧 Tests
Unit tests cover critical logic such as:
- home authentication redirect
- root layout behavior
- BMI classification (`classifyBMI`)
- route authorization by role/sport (`authz`)

## 🔗 Links
- Presentation site: https://sportvita.vercel.app
- Dashboard site: https://sportvita-dashboard.vercel.app 
- Repository: https://github.com/leomaltta/sportvita-dashboard
