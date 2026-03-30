## Context

L'app a une bottom nav avec 2 onglets (Séquences, Chat). La page séquence affiche des CTAs redondants et le chat est inutilisé. Les icônes de séquences sont saisies manuellement. Le QCM affiche toutes les questions en scroll.

## Goals / Non-Goals

**Goals:**
- Simplifier la navigation (un seul onglet, pas de bottom nav)
- Supprimer les doublons et fonctions non utilisées
- Rendre le QCM plus engageant (funnel)
- Personnaliser les icônes par matière automatiquement

**Non-Goals:**
- Refonte du design system
- Ajout de nouvelles fonctionnalités IA
- Changement du schema Prisma (le champ `name` existe déjà sur Sequence)

## Decisions

### 1. Suppression complète du Chat

Supprimer `app/chat/`, `app/api/chat/route.ts`, et la `bottom-nav`. Sans Chat, il n'y a plus qu'un seul onglet → la bottom nav n'a plus de raison d'être.

### 2. Mapping matière → icône en constante

```typescript
const SUBJECT_ICONS: Record<string, string> = {
  "Mathématiques": "📐",
  "Français": "📖",
  "Histoire-Géographie": "🏛️",
  "SVT": "🌿",
  "Physique-Chimie": "⚗️",
  "Anglais": "🇬🇧",
  "Espagnol": "🇪🇸",
  "Allemand": "🇩🇪",
  "Technologie": "⚙️",
  "Arts plastiques": "🎨",
  "Éducation musicale": "🎵",
  "EPS": "🏃",
};
```

Utilisé dans la liste des séquences et dans le header de détail. Fallback : emoji saisi par l'utilisateur, ou "📚".

### 3. Description éditable inline

Afficher la description sous le titre de la séquence. Bouton "Modifier" qui ouvre un textarea inline (pas de modale). Sauvegarde via Server Action `updateSequence`.

### 4. Bouton "Recommencer (mêmes questions)"

Crée une nouvelle `Evaluation` avec le même JSON de questions mais des `answers` vides. Pas de nouvel appel API Claude.

### 5. Funnel QCM

Même approche que le change `qcm-funnel-navigation` : state `currentIndex`, boutons Précédent/Suivant, dots de progression. La phase résultats reste en scroll.

## Risks / Trade-offs

- **[Perte du chat]** Si des utilisateurs l'utilisaient → Mitigation : aucun utilisateur actif sur le chat, suppression réversible via git
- **[Mapping matière incomplet]** Nouvelles matières non couvertes → Mitigation : fallback "📚" pour les matières inconnues
