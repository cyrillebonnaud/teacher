## 1. Schéma et niveaux

- [x] 1.1 Ajouter `description String?` au modèle Sequence dans `prisma/schema.prisma` et `db:push`
- [x] 1.2 Mettre à jour `lib/prompts.ts` : 5 niveaux de difficulté (Débutant, Facile, Moyen, Difficile, Expert) dans `LEVEL_DESCRIPTIONS` et `buildFreeTopicQcmPrompt`
- [x] 1.3 Adapter `actions/evaluations.ts` : `generateQcm` accepte `questionCount: number` (10|20|30), adapter le QCM_SCHEMA `minItems/maxItems` et les prompts en conséquence

## 2. Formulaire unifié

- [x] 2.1 Réécrire `app/sequences/new/page.tsx` : formulaire unique avec matière, textarea description, input file multiple, niveau 1–5 (radio buttons), nombre de questions (10/20/30)
- [x] 2.2 Mettre à jour `app/sequences/new/submit-button.tsx` pour le nouveau flow (toujours afficher "Génération du QCM en cours...")
- [x] 2.3 Supprimer le toggle documents/libre, le champ nom, et l'emoji picker

## 3. Server Action unifiée

- [x] 3.1 Réécrire `createSequence` dans `actions/sequences.ts` : accepter description (→ topic + name auto-dérivé), fichiers multiples (→ Documents), niveau, nombre de questions (→ generateQcm)
- [x] 3.2 Sauvegarder chaque fichier joint comme Document avec rawText vide (OCR sera lancé en arrière-plan plus tard)
- [x] 3.3 Générer le QCM au niveau choisi et rediriger vers l'évaluation (fallback vers page séquence si erreur)

## 4. Page sélection niveau QCM

- [x] 4.1 Mettre à jour `app/sequences/[id]/qcm/page.tsx` : afficher 5 niveaux au lieu de 3

## 5. Mapping emoji par matière

- [x] 5.1 Ajouter un mapping matière → emoji dans `actions/sequences.ts` (ex: Maths→📐, SVT→🔬, etc.) utilisé à la place du picker

## 6. Tests

- [x] 6.1 Mettre à jour `tests/sequence-libre.spec.ts` et `tests/sequences.spec.ts` pour le nouveau formulaire unifié
- [x] 6.2 Mettre à jour `tests/helpers.ts` : adapter `createSequence` helper pour le nouveau formulaire
