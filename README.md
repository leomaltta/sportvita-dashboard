# 🏃‍♂️ Sport Vita Dashboard

> A comprehensive sports and health management system for educational institutions

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [License](#license)

## 🎯 Overview

Sport Vita Dashboard is a modern web application designed to help educational institutions manage their sports programs efficiently. It provides comprehensive tools for tracking student athletes' health metrics, managing coaching staff, and visualizing performance data through interactive dashboards.

## 🌐 Live Website

The project has an official website showcasing the platform, its features, and real-world use case.

👉 **Access the website:**  
🔗 https://sportvita.vercel.app

This website is used for product presentation, onboarding, and external communication, while this repository contains the full technical implementation of the dashboard.

### 💡 Why I Built This

This project was developed to solve real-world challenges faced by sports coordinators in educational institutions:
- Manual tracking of student health metrics was time-consuming
- No centralized system for BMI monitoring across age groups
- Difficulty in generating reports and visualizing trends
- Need for role-based access for different staff members

**Technical Challenges Solved:**
- Complex BMI calculations for different age groups (Sub-6 to Sub-17)
- Real-time data visualization with performance optimization
- Role-based access control with NextAuth
- Responsive design for tablets used by coaches on the field

### Key Capabilities

- **Student Management**: Complete CRUD operations for student athletes
- **Teacher Management**: Manage coaching staff across different sports
- **Health Tracking**: BMI calculation and monitoring for different age groups
- **Data Visualization**: Interactive charts and graphs for performance analysis
- **Role-Based Access**: Granular permissions for admins and coaches
- **Multi-Sport Support**: Basketball, Dance, Futsal, Gymnastics, Handball, Judo, Karate, Swimming, and Volleyball

## ✨ Features

### For Administrators
- ✅ Full system access and configuration
- ✅ Add/edit/delete students and teachers
- ✅ View comprehensive analytics across all sports
- ✅ Export reports and data

### For Coaches
- ✅ Manage students in their sport category
- ✅ View sport-specific dashboards
- ✅ Track student progress and BMI metrics
- ✅ Access age-group (sub-category) analytics


## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)

### DevOps & Tools
- **Deployment**: [Vercel](https://vercel.com/)
- **Database Hosting**: [Neon](https://neon.tech/) / [Supabase](https://supabase.com/)
- **Version Control**: Git & GitHub
- **Package Manager**: npm / yarn / pnpm


## 📁 Project Structure

```
sport-vita-dashboard/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Database seeding
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── (auth)/          # Authentication routes
│   │   ├── (dashboardapp)/  # Protected dashboard routes
│   │   └── api/             # API routes
│   ├── components/           # React components
│   │   ├── ui/              # Base UI components
│   │   ├── forms/           # Form components
│   │   ├── tables/          # Table components
│   │   └── charts/          # Chart components
│   ├── lib/                  # Utility functions
│   │   ├── actions/         # Server actions
│   │   └── utils.ts         # Helper functions
│   └── context/             # React contexts
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

### Layers

1. **Presentation Layer** (`src/app`, `src/components`)
   - Pages and routes
   - UI components
   - User interactions

2. **Business Logic Layer** (`src/lib/actions`)
   - Use cases
   - Business rules
   - BMI calculations

3. **Data Access Layer** (`prisma`)
   - Database schema
   - Repositories
   - Data models

### Design Patterns

- **Server Actions**: For server-side mutations
- **Repository Pattern**: Database abstraction via Prisma
- **Component Composition**: Reusable UI components
- **Custom Hooks**: Shared logic extraction

### Code Quality

This project follows strict code quality standards:
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Conventional Commits
- ✅ Component-driven architecture

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

**Leonardo Malta** - Full Stack Developer  
**Luiz Neves** - Data Engineer (Database Design & Data Analysis)  

- GitHub: [@leonardomalta](https://github.com/leonardomalta) / [@leonardomalta](https://github.com/leonardomalta)
- LinkedIn: [Leonardo Malta](https://linkedin.com/in/leonardomalta) / [Luiz Neves](https://www.linkedin.com/in/luiz-neves1227/)


