## 1. Supprimer le Chat

- [x] 1.1 Supprimer `app/chat/` (page.tsx, chat-client.tsx, chat-message.tsx)
- [x] 1.2 Supprimer `app/api/chat/route.ts`
- [x] 1.3 Supprimer le lien "Chat" dans `components/bottom-nav.tsx` (ou supprimer la bottom-nav si elle ne contient plus qu'un lien)
- [x] 1.4 Supprimer l'import de `claudeStream` dans `lib/claude.ts` si plus utilisé ailleurs

## 2. Nettoyage page séquence

- [x] 2.1 Supprimer le bouton "💬 Poser une question" dans `app/sequences/[id]/page.tsx`
- [x] 2.2 Supprimer le bouton "+ Ajouter" (doublon)
- [x] 2.3 Renommer "Uploader un document" → "Ajouter un document"
- [x] 2.4 Déplacer le CTA "Générer un QCM" au-dessus de la section "Évaluations"
- [x] 2.5 Afficher la description de la séquence sous le titre avec un bouton "Modifier" (textarea inline éditable, sauvegarde via Server Action)

## 3. Icônes par matière

- [x] 3.1 Créer le mapping `SUBJECT_ICONS` dans un fichier partagé (`lib/constants.ts` ou inline)
- [x] 3.2 Appliquer dans `app/sequences/page.tsx` (liste) et `app/sequences/[id]/page.tsx` (header)

## 4. Formulaire nouvelle séquence

- [x] 4.1 Ajouter un champ "Titre de la séquence" dans `app/sequences/new/page.tsx`
- [x] 4.2 Utiliser ce titre comme `name` de la séquence (actuellement auto-généré à partir de la matière)

## 5. QCM — bouton recommencer mêmes questions

- [x] 5.1 Créer une Server Action `retryQcmSameQuestions(evalId)` qui copie les questions dans une nouvelle Evaluation
- [x] 5.2 Ajouter le bouton "🔄 Recommencer (mêmes questions)" dans la phase résultats du QcmPlayer

## 6. QCM — funnel

- [x] 6.1 Ajouter le state `currentIndex` dans QcmPlayer
- [x] 6.2 Remplacer la boucle `questions.map` par `questions[currentIndex]`
- [x] 6.3 Ajouter les boutons Précédent / Suivant dans un footer
- [x] 6.4 Ajouter les dots de progression cliquables
- [x] 6.5 Bouton Valider sur la dernière question quand tout est répondu
