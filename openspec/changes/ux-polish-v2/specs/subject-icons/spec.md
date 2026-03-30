## ADDED Requirements

### Requirement: Icône automatique par matière
Le système SHALL afficher une icône correspondant à la matière de chaque séquence dans la liste et le header de détail.

#### Scenario: Matière connue
- **WHEN** une séquence a pour matière "Mathématiques"
- **THEN** l'icône affichée est "📐"

#### Scenario: Matière inconnue
- **WHEN** une séquence a une matière non mappée
- **THEN** l'icône affichée est "📚" (fallback)
