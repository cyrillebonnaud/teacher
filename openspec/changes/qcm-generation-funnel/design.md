## Context

Le formulaire actuel (`app/sequences/new/page.tsx`) présente tous les champs sur une seule page : matière (dropdown), titre, description, niveau (1-5), nombre de questions (10/20/30), et pièces jointes. Ce format est fonctionnel mais peu engageant pour un collégien. Le flow doit devenir un funnel guidé step-by-step avec des cards visuelles.

Le modèle Prisma `Evaluation` stocke un `level` (Int) et les `questions`/`answers` en JSON string. Le modèle `Sequence` a `name`, `subject`, `topic`.

## Goals / Non-Goals

**Goals:**
- Transformer la création de QCM en funnel 4 étapes avec navigation avant/arrière
- Réduire la complexité des choix (3 niveaux, 2 options, 2 tailles)
- Utiliser des cards visuelles plutôt que des dropdowns/selects
- Intégrer les options "avec aide" (hints) et "mode expert" (pénalité)
- Adapter le scoring pour les hints (-0.5 pt) et le mode expert (-1 pt mauvaise réponse)

**Non-Goals:**
- Refonte du QCM player lui-même (hors ajout du bouton hint)
- Changement de la logique de génération Claude (seuls les prompts changent)
- Migration de base de données (ajout de colonnes simples)
- Responsive mobile avancé (le design actuel mobile-first reste)

## Decisions

### 1. Funnel client-side avec state local (pas de persistence intermédiaire)

Le funnel vit dans un seul Client Component avec un state React local pour les étapes. Pas de sauvegarde intermédiaire en DB — la séquence + évaluation sont créées uniquement à la soumission finale.

**Rationale** : Simple, pas de séquences orphelines en DB. L'état du funnel est léger (matière, titre, description, niveau, options, fichiers). Si l'utilisateur quitte, il recommence — acceptable pour un MVP.

**Alternative rejetée** : Sauvegarde draft en DB à chaque étape — complexité inutile.

### 2. Structure du funnel en 5 étapes

| Étape | Contenu | Navigation |
|---|---|---|
| 1. Matière | Cards avec emoji + nom (grid) | → suivant |
| 2. Contenu | Titre (optionnel) + description textarea | ← → |
| 3. Niveau | 4 cards (Facile/Moyen/Difficile/Expert) avec description par niveau | ← → |
| 4. Options | Toggle "Avec aide" (niveaux 1-3 seulement) + cards nombre questions (10/20) | ← → |
| 5. Documents | Zone upload + bouton "Passer" | ← Générer |

**Rationale** : Le niveau mérite sa propre étape pour afficher la description de chaque niveau sans surcharger l'écran. Les options varient selon le niveau (aide indisponible en Expert) — les mettre après le niveau permet d'adapter l'UI dynamiquement.

### 3. Mapping des niveaux 1-4

| Niveau | Label | Description affichée | Comportement |
|---|---|---|---|
| 1 | Facile | Questions directes sur le cours, réponses évidentes | Standard + aide dispo |
| 2 | Moyen | Il faut comprendre, pas juste mémoriser | Standard + aide dispo |
| 3 | Difficile | Analyse, pièges, formulations complexes | Standard + aide dispo |
| 4 | Expert | Zéro aide, chaque erreur coûte 1 point | -1 pt par mauvaise réponse, pas de hints |

Le champ `level` en DB reste un Int (1-4). Les évaluations existantes avec level 5 restent lisibles mais ne peuvent plus être créées.

### 4. Stockage des options

Un seul champ booléen sur `Evaluation` :
```
helpMode    Boolean @default(false)
```
Le niveau Expert (4) encode implicitement `expertMode = true`. Pas besoin de champ séparé.

Le JSON `questions` inclut un champ `hint` par question uniquement quand `helpMode` est activé.

### 5. Scoring

- **Niveaux 1-3, aide non utilisée** : bonne réponse = 1 pt, mauvaise = 0 pt
- **Niveaux 1-3, hint révélé** : bonne réponse = 0.5 pt, mauvaise = 0 pt
- **Niveau Expert (4)** : bonne réponse = 1 pt, mauvaise = -1 pt, pas de hints

Le calcul du score se fait au `submitQcm` côté serveur, enrichi des paramètres `helpMode`, `expertMode` (déduit du level), et `hintsUsed` (tableau des index où le hint a été révélé).

## Risks / Trade-offs

- **[Migration douce]** Les évaluations existantes avec level 4-5 deviennent orphelines du nouveau système → Acceptable, c'est un MVP avec peu de données. Pas de migration nécessaire.
- **[Hints dans le JSON]** Les hints augmentent la taille du JSON et le coût API → Impact mineur, un hint = 1-2 phrases. Le prompt demande des hints courts.
- **[Score négatif en mode expert]** Peut être frustrant → C'est le but du mode expert, l'utilisateur choisit consciemment cette option.
