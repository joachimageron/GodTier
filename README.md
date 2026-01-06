# GodTier

Application web de création et gestion de tier lists, construite avec NestJS et React.

## 🏗️ Architecture

Ce projet est un monorepo pnpm comprenant :

- **Backend** (`apps/backend`) - API NestJS avec TypeORM et SQLite
- **Frontend** (`apps/frontend`) - Application React avec Vite et TailwindCSS
- **Shared** (`packages/shared`) - Types et utilitaires partagés entre le backend et le frontend

## 🚀 Prérequis

- Node.js >= 18
- pnpm >= 8

## 📦 Installation

```bash
# Installer les dépendances
pnpm install
```

## 🛠️ Configuration

### Backend

Créer un fichier `.env` dans `apps/backend/` :

```env
# AWS/S3 (LocalStack pour le développement)
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localhost:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# Database
DATABASE_URL="./dev.db"
```

## 🎯 Développement

```bash
# Lancer tous les services en mode développement
pnpm dev

# Ou lancer individuellement :
pnpm --filter backend dev
pnpm --filter frontend dev
```

- **Backend** : http://localhost:3000
- **Frontend** : http://localhost:5173

## 🏗️ Build

```bash
# Build tous les packages
pnpm build

# Ou build individuellement :
pnpm --filter backend build
pnpm --filter frontend build
```

## 🧪 Tests

```bash
# Exécuter tous les tests
pnpm test

# Tests backend uniquement
pnpm --filter backend test

# Tests avec coverage
pnpm --filter backend test:cov
```

## 📁 Structure du projet

```
GodTier/
├── apps/
│   ├── backend/           # API NestJS
│   │   └── src/
│   │       ├── application/   # Ports et use cases
│   │       ├── domain/        # Entités métier
│   │       └── infrastructure/  # Controllers, DB, S3
│   └── frontend/          # Application React
│       └── src/
│           ├── components/
│           └── assets/
├── packages/
│   └── shared/            # Types et utilitaires partagés
├── pnpm-workspace.yaml
└── package.json
```

## 🛡️ Stack technique

### Backend
- **Framework** : NestJS
- **Base de données** : SQLite avec TypeORM
- **Stockage** : AWS S3 / LocalStack
- **Langage** : TypeScript

### Frontend
- **Framework** : React 18
- **Build tool** : Vite (Rolldown)
- **Styling** : TailwindCSS
- **UI Components** : Radix UI
- **Drag & Drop** : @dnd-kit
- **Data fetching** : TanStack Query (React Query)
- **HTTP Client** : Axios

### Shared
- **Gestion du monorepo** : pnpm workspaces
- **Langage** : TypeScript

## 📝 Scripts disponibles

### Root (monorepo)
- `pnpm dev` - Lance tous les services en mode développement
- `pnpm build` - Build tous les packages
- `pnpm test` - Exécute tous les tests

### Backend
- `pnpm dev` - Mode développement avec hot reload
- `pnpm build` - Build le projet
- `pnpm start:prod` - Lance en production
- `pnpm test` - Tests unitaires
- `pnpm test:e2e` - Tests end-to-end
- `pnpm lint` - Linter le code

### Frontend
- `pnpm dev` - Serveur de développement
- `pnpm build` - Build pour production
- `pnpm preview` - Preview du build
- `pnpm lint` - Linter le code

## 🐳 Services externes

Pour le développement local avec S3, vous pouvez utiliser LocalStack :

```bash
docker run -d -p 4566:4566 localstack/localstack
```

## 📄 License

UNLICENSED
