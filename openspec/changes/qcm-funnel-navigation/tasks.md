## 1. Navigation funnel dans QcmPlayer

- [ ] 1.1 Ajouter le state `currentIndex` (useState<number>(0)) dans QcmPlayer
- [ ] 1.2 Remplacer la boucle `questions.map` par l'affichage de `questions[currentIndex]` uniquement
- [ ] 1.3 Ajouter les boutons Précédent / Suivant dans un footer sticky
- [ ] 1.4 Masquer "Précédent" sur la première question, masquer "Suivant" sur la dernière

## 2. Indicateur de progression

- [ ] 2.1 Ajouter une rangée de dots cliquables (un par question) au-dessus de la question
- [ ] 2.2 Distinguer visuellement les dots : répondu (bleu), courant (bordure), non-répondu (gris)
- [ ] 2.3 Permettre la navigation directe via clic sur un dot
- [ ] 2.4 Afficher le label "Question N/10" à côté de la progress bar

## 3. Bouton Valider contextuel

- [ ] 3.1 Sur la dernière question : afficher "Valider" à la place de "Suivant" quand toutes les questions sont répondues
- [ ] 3.2 Quand des questions manquent et que l'élève tente de valider : naviguer vers la première question non-répondue
- [ ] 3.3 Conserver le comportement existant de `handleSubmit` et `saveAnswer`

## 4. Tests E2E

- [ ] 4.1 Mettre à jour les tests Playwright existants pour le nouveau flow funnel (navigation, validation)
