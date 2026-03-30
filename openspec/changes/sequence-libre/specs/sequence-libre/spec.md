## ADDED Requirements

### Requirement: L'élève peut créer une séquence en décrivant un sujet
Le système SHALL permettre de créer une séquence à partir d'un sujet décrit en langage naturel, sans upload de document.

#### Scenario: Création d'une séquence libre
- **WHEN** l'élève sélectionne le mode "Révision libre", renseigne une matière et saisit le sujet "les régimes alimentaires"
- **THEN** la séquence est créée avec le `topic` = "les régimes alimentaires" et aucun document n'est requis

#### Scenario: Le sujet est obligatoire en mode libre
- **WHEN** l'élève est en mode "Révision libre" et soumet sans saisir de sujet
- **THEN** le formulaire affiche une erreur et ne crée pas la séquence

### Requirement: Après création d'une séquence libre, l'élève est redirigé vers le QCM
Le système SHALL rediriger directement vers la génération de QCM niveau 1 après création d'une séquence libre.

#### Scenario: Redirection immédiate
- **WHEN** la séquence libre est créée avec succès
- **THEN** l'élève est redirigé vers la page de sélection du niveau QCM (ou directement vers un QCM niveau 1 généré)

#### Scenario: Échec de génération QCM
- **WHEN** la génération du QCM échoue après la création
- **THEN** l'élève est redirigé vers la page de la séquence avec un message "QCM non disponible, réessaie depuis la séquence"

### Requirement: Le formulaire propose deux modes de création
Le système SHALL afficher un sélecteur de mode dans le formulaire de création : "À partir de mes cours" (upload) et "Révision libre" (sujet).

#### Scenario: Mode upload (défaut)
- **WHEN** l'élève ouvre le formulaire de création
- **THEN** le mode "À partir de mes cours" est sélectionné par défaut, le formulaire est identique à l'existant

#### Scenario: Basculer en mode libre
- **WHEN** l'élève sélectionne "Révision libre"
- **THEN** le champ "Sujet à réviser" apparaît et le champ emoji devient optionnel
