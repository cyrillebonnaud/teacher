## ADDED Requirements

### Requirement: Formulaire unique de création de séquence
Le système SHALL afficher un formulaire unique avec : matière (select), description (textarea), pièces jointes (multi-upload optionnel), et niveau de difficulté (1–5).

#### Scenario: Formulaire affiché
- **WHEN** l'élève ouvre la page de création
- **THEN** le formulaire affiche dans l'ordre : sélecteur de matière, textarea de description, zone d'upload, sélection du niveau de difficulté, et bouton de soumission

#### Scenario: Création avec description seule
- **WHEN** l'élève choisit une matière, saisit "les régimes alimentaires des animaux", sélectionne le niveau 2, et soumet sans pièce jointe
- **THEN** la séquence est créée avec name auto-dérivé, topic = la description, et un QCM niveau 2 est généré

#### Scenario: Création avec description et pièces jointes
- **WHEN** l'élève choisit une matière, saisit une description, ajoute 2 photos, sélectionne le niveau 3, et soumet
- **THEN** la séquence est créée, les 2 photos sont sauvegardées comme Documents, et un QCM niveau 3 est généré à partir de la description

#### Scenario: Description obligatoire
- **WHEN** l'élève soumet sans description
- **THEN** le formulaire affiche une erreur et ne soumet pas

### Requirement: Upload multiple de pièces jointes
Le système SHALL accepter plusieurs fichiers (PDF, JPEG, PNG, WebP) via un input file multiple.

#### Scenario: Sélection de plusieurs fichiers
- **WHEN** l'élève sélectionne 3 fichiers
- **THEN** la liste des fichiers sélectionnés s'affiche sous le bouton d'upload avec possibilité de retirer un fichier

#### Scenario: Formats acceptés
- **WHEN** l'élève sélectionne un fichier JPEG, un PDF, et un PNG
- **THEN** les 3 fichiers sont acceptés

### Requirement: Le nom de la séquence est auto-dérivé de la description
Le système SHALL générer automatiquement le nom de la séquence à partir des 50 premiers caractères de la description.

#### Scenario: Description courte
- **WHEN** la description est "les fractions"
- **THEN** le nom de la séquence est "les fractions"

#### Scenario: Description longue
- **WHEN** la description est "les régimes alimentaires des animaux : herbivore, carnivore, omnivore et les chaînes alimentaires"
- **THEN** le nom est tronqué aux 50 premiers caractères au dernier mot complet

### Requirement: Le niveau de difficulté est choisi dans le formulaire
Le système SHALL afficher 5 niveaux de difficulté (1–5) comme des boutons radio visuels, avec le niveau 1 sélectionné par défaut.

#### Scenario: Sélection du niveau
- **WHEN** l'élève clique sur le niveau 4
- **THEN** le niveau 4 est sélectionné visuellement et sera utilisé pour la génération QCM

### Requirement: Le nombre de questions est choisi dans le formulaire
Le système SHALL afficher 3 options de nombre de questions (10, 20, 30) comme des boutons radio, avec 10 sélectionné par défaut.

#### Scenario: Sélection de 20 questions
- **WHEN** l'élève clique sur "20"
- **THEN** 20 questions sont générées dans le QCM

#### Scenario: Valeur par défaut
- **WHEN** l'élève ouvre le formulaire
- **THEN** le nombre de questions est 10 par défaut

### Requirement: Feedback de chargement
Le système SHALL afficher un indicateur de progression pendant la création de la séquence et la génération du QCM.

#### Scenario: Soumission en cours
- **WHEN** le formulaire est soumis
- **THEN** le bouton affiche "Génération du QCM en cours..." et le formulaire est désactivé
