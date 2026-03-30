## Context

Le flux actuel force l'upload de documents avant de générer un QCM. Le modèle Sequence n'a pas de notion de sujet libre — le contenu vient uniquement des documents (rawText). L'action `generateEvaluation` lit les documents de la séquence ; s'il n'y en a pas, elle renvoie une erreur.

Stack : Next.js 16 (App Router), Server Actions, Prisma + SQLite, Claude via filesystem IPC.

## Goals / Non-Goals

**Goals:**
- Permettre la création d'une séquence avec un sujet libre, sans document
- Générer un QCM à partir des connaissances de Claude sur le sujet, adapté au niveau 5e
- Persister le sujet pour l'utiliser aussi dans le chat et les prochaines évaluations
- Conserver le flux existant (upload documents) sans modification

**Non-Goals:**
- Pas de recherche web pour les séquences libres (MVP) — Claude utilise ses connaissances
- Pas de génération de "cours" ou de contenu rédigé — uniquement des QCMs
- Pas de déduction automatique du niveau scolaire (fixé à 5e pour l'instant)

## Decisions

### 1. Champ `topic` optionnel sur Sequence

Ajout de `topic String?` dans le modèle Prisma. Si `topic` est renseigné et qu'il n'y a pas de documents, c'est la source de vérité pour les QCMs et le chat.

**Pourquoi pas un type enum "libre/document" ?** Un `topic` textuel est suffisant pour distinguer les deux modes (null = mode documents, non-null = mode libre) et est plus flexible.

### 2. Formulaire de création avec toggle mode

Le formulaire `app/sequences/new/page.tsx` expose deux modes via des radio buttons ou un toggle :
- **"À partir de mes cours"** (défaut) — comportement actuel, pas de `topic`
- **"Révision libre"** — affiche un champ texte "Sujet à réviser" (ex: "les régimes alimentaires") et masque les champs devenus inutiles comme l'emoji (optionnel)

La soumission reste une Server Action. Le champ `topic` est ajouté au FormData.

### 3. `generateEvaluation` : fallback sur le topic

Dans `actions/evaluations.ts`, la logique devient :

```
si séquence a des documents → prompt QCM avec le rawText (existant)
sinon si séquence a un topic → prompt QCM "libre" avec le sujet
sinon → erreur (pas de contenu)
```

Un nouveau prompt `buildFreeTopicQcmPrompt(topic, level)` dans `lib/prompts.ts` génère le QCM en demandant à Claude de se baser sur ses connaissances du programme de 5e.

### 4. Redirection après création d'une séquence libre

Lors de la création d'une séquence libre, on redirige directement vers le générateur de QCM (pré-sélection niveau 1) pour que l'élève puisse réviser immédiatement, sans passer par la page séquence.

**Risque** : la génération QCM peut échouer → on redirige vers la page séquence avec un message d'erreur récupérable.

## Risks / Trade-offs

- **Qualité des QCMs sans document** → Claude peut halluciner ou ne pas coller au programme. Mitigation : le prompt spécifie explicitement "programme français de 5e" et demande des questions factuelles avec sources si possible.
- **Migration Prisma** → ajout d'une colonne nullable, pas de migration destructive. `db:push` suffit en dev.
