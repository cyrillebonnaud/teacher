## Context

Le QcmPlayer actuel (`qcm-player.tsx`) affiche toutes les questions en scroll vertical. L'état est géré via `useState` (answers, phase, score) avec sauvegarde progressive via `saveAnswer()`. Le composant `QcmQuestion` est un composant pur qui reçoit question, selectedAnswer et callbacks.

## Goals / Non-Goals

**Goals:**
- Afficher une seule question à la fois avec navigation Précédent/Suivant
- Conserver la sauvegarde progressive des réponses (pas de régression)
- UX mobile-first fluide (boutons larges, pas de scroll)

**Non-Goals:**
- Animations/transitions entre questions (V2)
- Verrouillage des questions (l'élève peut naviguer librement)
- Changement du composant `QcmQuestion` existant
- Modification du backend ou du schema Prisma

## Decisions

### 1. State `currentIndex` dans QcmPlayer

Ajouter un `useState<number>(0)` pour tracker la question courante. La navigation Précédent/Suivant incrémente/décrémente cet index.

**Pourquoi** : Approche la plus simple, pas de nouvelle abstraction. Le composant gère déjà tout l'état du quiz.

### 2. Layout fixe avec footer de navigation

Structure : question centrée dans le viewport, footer sticky en bas avec les boutons Précédent / Suivant (ou Valider).

**Pourquoi** : Sur mobile, des boutons en bas de l'écran sont accessibles au pouce. Un footer sticky évite le scroll.

### 3. Réutiliser QcmQuestion tel quel

Le composant `QcmQuestion` n'a pas besoin de modification — il affiche déjà une question unique avec ses choix. On le rend simplement un seul à la fois au lieu de tous en boucle.

### 4. Bouton Valider conditionnel

Le bouton "Valider" remplace "Suivant" sur la dernière question uniquement quand toutes les questions ont une réponse. Sinon, "Suivant" reste actif pour permettre la navigation.

**Alternative rejetée** : Page de récapitulatif séparée avant validation — trop complexe pour un MVP, casse le flow funnel.

## Risks / Trade-offs

- **[Perte de vue d'ensemble]** L'élève ne voit plus toutes ses réponses d'un coup avant de valider → Mitigation : l'indicateur de progression montre les questions répondues (dots colorés) et la navigation libre permet de revenir.
- **[Questions non répondues]** L'élève peut oublier des questions en naviguant → Mitigation : les dots de progression distinguent visuellement répondu/non-répondu, et le bouton Valider n'apparaît que quand tout est répondu.
