## 1. Composant QcmQuestion

- [x] 1.1 Ajouter un bouton "Je ne sais pas" sous les 4 choix (lien textuel gris, centré) qui appelle `onAnswer(-1)`
- [x] 1.2 Masquer le bouton quand `isSubmitted` est true
- [x] 1.3 En mode résultat, si `selectedAnswer === -1` : afficher un badge "Je ne sais pas" gris et montrer l'explication

## 2. QcmPlayer

- [x] 2.1 Gérer `answerIdx: -1` dans le state answers (considéré comme "répondu" dans la progression)
