## ADDED Requirements

### Requirement: Liste des programmes par niveau et matière
Le système SHALL afficher sur `/programmes` la liste des programmes officiels filtrables par niveau scolaire (6e, 5e, 4e, 3e) et par matière. Le niveau par défaut MUST être 5e.

#### Scenario: Affichage initial
- **WHEN** un parent accède à `/programmes`
- **THEN** il voit les programmes du niveau 5e listés par matière

#### Scenario: Filtrage par niveau
- **WHEN** un parent sélectionne le niveau "4e"
- **THEN** la liste se met à jour pour afficher les programmes de 4e

#### Scenario: Filtrage par matière
- **WHEN** un parent sélectionne la matière "Français"
- **THEN** seuls les programmes de Français pour le niveau sélectionné s'affichent

### Requirement: Recherche full-text dans les programmes
Le système SHALL permettre de rechercher un terme dans le contenu des programmes. La recherche MUST être case-insensitive et chercher dans le titre et le contenu.

#### Scenario: Recherche avec résultats
- **WHEN** un parent tape "proportionnalité" dans le champ de recherche
- **THEN** les programmes contenant "proportionnalité" s'affichent avec le passage pertinent mis en évidence

#### Scenario: Recherche sans résultat
- **WHEN** un parent tape un terme absent des programmes
- **THEN** le système affiche "Aucun résultat pour ce terme"

#### Scenario: Recherche combinée avec filtres
- **WHEN** un parent recherche "fonction" avec le filtre niveau "3e" et matière "Mathématiques"
- **THEN** seuls les résultats dans les programmes de Maths 3e s'affichent

### Requirement: Vue détaillée d'un programme
Le système SHALL afficher le contenu intégral d'un programme lorsqu'un parent clique dessus. Le contenu MUST être affiché en texte formaté (sections, listes).

#### Scenario: Consultation d'un programme
- **WHEN** un parent clique sur "Mathématiques — 5e"
- **THEN** le contenu intégral du programme s'affiche dans une page dédiée `/programmes/[id]`

#### Scenario: Retour à la liste
- **WHEN** un parent clique sur le bouton retour depuis un programme
- **THEN** il revient à la liste filtrée précédente (filtres conservés)
