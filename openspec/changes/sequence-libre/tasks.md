## 1. Schéma Prisma

- [x] 1.1 Ajouter `topic String?` au modèle Sequence dans `prisma/schema.prisma`
- [x] 1.2 Exécuter `npm run db:push` pour appliquer la migration

## 2. Formulaire de création

- [x] 2.1 Extraire le formulaire `app/sequences/new/page.tsx` en Client Component `CreateSequenceForm` pour gérer l'état du mode (upload vs libre)
- [x] 2.2 Ajouter un toggle/radio "À partir de mes cours" / "Révision libre" dans le formulaire
- [x] 2.3 En mode "Révision libre" : afficher le champ texte "Sujet à réviser" (required) et masquer les éléments inutiles
- [x] 2.4 En mode "À partir de mes cours" : comportement identique à l'existant

## 3. Server Action

- [x] 3.1 Modifier `createSequence` dans `actions/sequences.ts` pour accepter et persister le champ `topic` depuis le FormData
- [x] 3.2 Si `topic` est fourni : après création, appeler `generateEvaluation(sequenceId, 1)` et rediriger vers l'évaluation
- [x] 3.3 Si `generateEvaluation` échoue : rediriger vers la page séquence avec searchParam `?error=qcm`

## 4. Prompt QCM séquence libre

- [x] 4.1 Ajouter `buildFreeTopicQcmPrompt(topic: string, level: number)` dans `lib/prompts.ts` — génère 10 questions adaptées au niveau 5e français
- [x] 4.2 Modifier `generateEvaluation` dans `actions/evaluations.ts` : si pas de documents mais `topic` défini → utiliser `buildFreeTopicQcmPrompt` ; si ni documents ni topic → erreur explicite

## 5. Tests E2E

- [x] 5.1 Test Playwright : création séquence libre "les régimes alimentaires" → vérifie création séquence + évaluation, et redirection vers QCM
- [x] 5.2 Test Playwright : mode "À partir de mes cours" → vérifie comportement existant inchangé
