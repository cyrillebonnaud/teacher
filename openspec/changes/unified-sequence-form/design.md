## Context

Le formulaire actuel de création de séquence a un toggle documents/libre, un champ nom, un sélecteur de matière, un emoji picker. La sélection du niveau QCM se fait sur une page séparée (`/sequences/{id}/qcm`). L'upload de documents se fait après création.

On fusionne tout en un seul formulaire simple.

## Goals / Non-Goals

**Goals:**
- Un seul formulaire pour créer une séquence et lancer un QCM
- Upload multiple optionnel (photos + PDFs) directement dans le formulaire
- 5 niveaux de difficulté au lieu de 3
- Le nom de la séquence est dérivé automatiquement de la description

**Non-Goals:**
- Pas de prévisualisation des documents avant soumission (juste les noms de fichiers)
- Pas de traitement OCR en temps réel (on traite après soumission)
- Pas de nombre de questions arbitraire (uniquement 10, 20, 30)

## Decisions

### 1. Formulaire unifié — structure des champs

Le formulaire contient, dans l'ordre :

1. **Matière** (select, required) — en premier car ça contextualise tout le reste
2. **Description** (textarea, required) — "Décris ce que tu veux réviser" (ex: "les régimes alimentaires des animaux, herbivore carnivore omnivore"). Sert aussi de `topic` pour la génération QCM
3. **Pièces jointes** (input file multiple, optional) — accept PDF/JPEG/PNG/WebP, avec liste des fichiers sélectionnés
4. **Niveau de difficulté** (1–5, required, défaut 1) — 5 boutons radio visuels (1=Débutant, 2=Facile, 3=Moyen, 4=Difficile, 5=Expert)
5. **Nombre de questions** (10/20/30, required, défaut 10) — 3 boutons radio

Supprimé : toggle documents/libre, champ "nom", emoji picker.

### 2. Dérivation du nom de la séquence

Le nom est auto-généré à partir de la description : on prend les 50 premiers caractères, tronqués au dernier mot complet. Si la description fait moins de 50 caractères, on la prend telle quelle. L'emoji est choisi en fonction de la matière (mapping fixe).

### 3. Server Action unifiée

`createSequence(formData)` fait tout séquentiellement :
1. Crée la Sequence (name dérivé, subject, description comme `topic`)
2. Pour chaque fichier joint : sauvegarde + création Document (rawText vide pour l'instant)
3. Génère le QCM au niveau choisi (utilise `topic` si pas de documents avec du texte, sinon documents)
4. Redirect vers le QCM généré

L'extraction OCR des documents est asynchrone — elle n'est pas bloquante pour la génération QCM. Si des documents sont fournis mais pas encore extraits, le QCM est basé sur la description (topic) uniquement.

### 4. Cinq niveaux de difficulté

| Niveau | Label | Description |
|--------|-------|-------------|
| 1 | Débutant | Vocabulaire et définitions de base |
| 2 | Facile | Questions directes sur le cours |
| 3 | Moyen | Compréhension et mise en lien |
| 4 | Difficile | Analyse et application |
| 5 | Expert | Synthèse, pièges, raisonnement avancé |

Les prompts QCM dans `lib/prompts.ts` sont mis à jour pour les 5 niveaux.

## Risks / Trade-offs

- **Documents non extractés au moment du QCM** → Le QCM est basé sur la description en premier. Les documents servent pour les QCMs suivants (après extraction). Acceptable pour le MVP.
- **Nom auto-généré peu parlant** → On peut toujours éditer le nom ensuite. La description complète est stockée dans `topic`.
