## 1. Schema & Data

- [x] 1.1 Ajouter les champs `helpMode` (Boolean, default false) et `expertMode` (Boolean, default false) au modèle Evaluation dans `prisma/schema.prisma`
- [x] 1.2 Supprimer le choix 30 questions — mettre à jour la validation dans les server actions pour accepter uniquement 10 ou 20
- [x] 1.3 Migration Supabase `002_qcm_game_options.sql` — ajout colonne `help_mode`

## 2. Prompts & Génération

- [x] 2.1 Adapter `lib/prompts.ts` pour 4 niveaux de difficulté (Facile/Moyen/Difficile/Expert) + export `LEVELS`
- [x] 2.2 Ajouter la génération de hints dans le prompt quand `helpMode` est activé (champ `hint` par question dans le JSON)
- [x] 2.3 Mettre à jour `actions/evaluations.ts` pour passer `helpMode`, scoring hints + expert

## 3. Funnel UI — Composants

- [x] 3.1 SubjectCards intégré dans le funnel (step 0)
- [x] 3.2 LevelCards avec descriptions (step 2)
- [x] 3.3 QuestionCountCards 10/20 (step 3)
- [x] 3.4 Toggle "Avec aide" — masqué en niveau Expert (step 3)
- [x] 3.5 FunnelProgress — indicateur 5 étapes dans le header

## 4. Funnel UI — Page principale

- [x] 4.1 Refondre `app/sequences/new/page.tsx` en funnel 5 étapes avec state local
- [x] 4.2 Étape 1 : SubjectCards avec validation (matière requise)
- [x] 4.3 Étape 2 : champs titre (optionnel) + description (requis) avec validation
- [x] 4.4 Étape 3 : LevelCards avec descriptions par niveau
- [x] 4.5 Étape 4 : toggle aide (niveaux 1-3) + QuestionCountCards
- [x] 4.6 Étape 5 : zone upload documents + bouton "Passer" + bouton "Générer le QCM"

## 5. QCM Player — Hints & Scoring

- [x] 5.1 Ajouter le bouton "Voir l'indice" dans `components/qcm-question.tsx` (visible si helpMode, clic requis)
- [x] 5.2 Tracking "hint utilisé" par question avec callback `onHintReveal`
- [x] 5.3 Adapter le calcul du score dans `qcm-player.tsx` et `submitQcm` : -0.5 si hint utilisé, -1 si mauvaise réponse Expert
- [x] 5.4 Badges "Avec aide" / "Expert" sur l'écran de résultat

## 6. Nettoyage & Adaptation

- [x] 6.1 Réduire à 4 niveaux dans `app/sequences/[id]/qcm/page.tsx` avec descriptions
- [x] 6.2 Mettre à jour `actions/sequences.ts` — helpMode, titre auto-dérivé, no 30 questions
- [x] 6.3 Adapter les tests E2E dans `tests/sequences.spec.ts` et `tests/qcm.spec.ts` au nouveau funnel

## 7. Vérification

- [ ] 7.1 Tester le funnel complet : matière → contenu → niveau → options → documents → génération
- [ ] 7.2 Tester : aide sur niveaux 1-3 (masquée/révélée), aide absente sur niveau Expert
- [ ] 7.3 Vérifier que les hints sont générés par Claude et affichés correctement au clic
- [ ] 7.4 Vérifier le scoring : -0.5 hint révélé bonne réponse, -1 pt mauvaise réponse Expert
