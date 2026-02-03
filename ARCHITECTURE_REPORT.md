# Rapport d'Architecture du Projet GodTier

## 1. Vue d'ensemble
Le projet est un **monorepo** géré avec `pnpm`, structuré autour de trois espaces de travail principaux :
- **apps/backend** : Une API REST développée avec **NestJS**.
- **apps/frontend** : Une application client développée avec **React** et **Vite**.
- **packages/shared** : Une librairie de code partagé (types TS) entre le front et le back.

---

## 2. Architecture Backend (`apps/backend`)

Le backend suit les principes de la **Clean Architecture** (aussi appelée Architecture Hexagonale ou Ports & Adapters). Le code est organisé en couches concentriques pour isoler la logique métier des détails techniques.

### Structure des dossiers :
- **`domain/`** : Le cœur du système. Contient les entités métier pures (`User`, `TierList`, `Logo`). Cette couche ne dépend d'aucune autre.
- **`application/`** : Contient la logique applicative (les cas d'utilisation ou *Use Cases*).
  - **`use-cases/`** : Orchestration des règles métier (ex: `SignInUseCase`).
  - **`ports/`** : Interfaces (contrats) que l'infrastructure doit implémenter (ex: `UserRepository`, `PasswordService`). C'est ici que s'applique l'inversion de dépendance.
  - **`dtos/`** : Objets de transfert de données pour les entrées/sorties.
- **`infrastructure/`** : Implémentation technique concrète.
  - **`controllers/`** : Points d'entrée HTTP (NestJS Controllers).
  - **`database/`** : Implémentation des repositories avec TypeORM.
  - **`auth/`** : Services d'authentification (JWT, BCrypt) implémentant les ports de la couche application.

### Points Forts Backend :
- **Découplage fort** : L'utilisation des *Ports* permet de changer de base de données ou de système d'authentification sans toucher au code métier.
- **Testabilité** : Les *Use Cases* sont facilement testables unitairement en mockant les interfaces des ports.
- **Organisation claire** : La séparation Dossier/Responsabilité est explicite.

---

## 3. Architecture Frontend (`apps/frontend`)

Le frontend est une SPA React standard construite avec Vite.

### Structure :
- **`services/api.ts`** : Centralisation des appels API via Axios.
- **`context/`** : Gestion de l'état global (ex: `AuthContext`).
- **`pages/`** : Découpage par route/écran.
- **`components/ui/`** : Composants réutilisables (probablement basés sur une librairie de composants ou Tailwind).

---

## 4. Analyse Critique & Points d'Amélioration

Bien que l'architecture globale soit solide, plusieurs points de friction et incohérences ont été relevés, principalement dans la gestion du partage de code au sein du monorepo.

### 🔴 Points bloquants / Dysfonctionnements

1.  **Duplication des Types (Violation du principe DRY)**
    - Le frontend redéfinit manuellement des types qui existent déjà côté backend ou qui devraient être partagés.
    - *Exemple* : Dans `apps/frontend/src/services/api.ts`, les interfaces `User`, `SignupDto`, `SigninDto` sont redéclarées localement alors qu'elles existent implicitement côté backend.
    - **Risque** : Des divergences entre les types front et back (ex: ajout d'un champ dans l'API non reflété dans le front) peuvent causer des bugs silencieux.

2.  **Absence de DTOs partagés pour l'Auth**
    - Actuellement, le package `@godtier/shared` ne contient que des types liés aux `TierList`. Les DTOs d'authentification (`SignInDto`, `SignUpDto`) sont définis uniquement dans le backend (`apps/backend/src/application/dtos/auth.dto.ts`) et recréés manuellement dans le frontend.
    - Cela annule l'un des avantages majeurs du monorepo : le contrat d'interface garanti entre le client et le serveur.

### 🟠 Points d'attention

1.  **Modèle de Domaine "Anémique"**
    - Les entités du domaine (ex: `User.ts` dans le backend) sont essentiellement des conteneurs de données (constructeurs publics, propriétés publiques) sans réelle logique métier encapsulée. C'est un pattern courant mais qui peut mener à une fuite de la logique métier vers les *Use Cases* ou les services.

2.  **Mapping Manuel**
    - Le repository (`user.repository.ts`) effectue un mapping manuel entre les entités TypeORM et les entités du Domaine. Bien que ce soit une bonne pratique pour l'indépendance, cela peut devenir fastidieux et source d'erreurs si le modèle grossit.

---

## 5. Recommandations

Pour fiabiliser le projet et tirer pleinement parti du monorepo, voici les actions recommandées :

1.  **Migrer les DTOs vers `@godtier/shared`** :
    - Déplacer `SignInDto`, `SignUpDto` et l'interface `User` (la version publique sans mot de passe) dans `packages/shared`.
    - Utiliser ces types importés à la fois dans le Controller du backend et dans le service API du frontend.

2.  **Partager la validation** :
    - Considérer l'utilisation de librairies comme `class-validator` (déjà utilisé au back) sur des classes partagées, ou passer à `zod` pour définir des schémas de validation partageables qui peuvent générer les types TypeScript automatiquement.

3.  **Renforcer le typage des retours API** :
    - Dans le frontend (`api.ts`), typer explicitement les retours des méthodes `axios` avec les types partagés pour garantir que le frontend manipule exactement ce que le backend renvoie.

4.  **Enrichir le Domaine** :
    - Ajouter des méthodes métier dans les classes du domaine (ex: `user.updatePassword(...)`) pour encapsuler les règles de modification d'état plutôt que de tout faire dans les services.
