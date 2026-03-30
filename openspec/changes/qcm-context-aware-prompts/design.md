## Context

Les prompts actuels mentionnent le niveau et le cours mais pas la matière ni le titre. Claude génère donc des questions "génériques" sans adaptation au domaine disciplinaire (vocabulaire, style de questionnement, attentes).

## Goals / Non-Goals

**Goals:**
- Enrichir les prompts avec `subject` et `title` pour contextualiser la génération
- Résultat : des questions formulées dans le registre de la discipline (ex. "Quelle est la capitale..." en géo, "Quel est le produit de..." en maths)

**Non-Goals:**
- Modifier la structure JSON des questions
- Changer le nombre/format des choix

## Decisions

### Ajout d'un bloc CONTEXTE en tête du prompt

On ajoute une ligne `MATIÈRE : {subject}` et `SÉQUENCE : {title}` juste après l'en-tête du prompt, avant le niveau. C'est le moyen le plus simple et le plus explicite.

**Alternative rejetée** : Mettre la matière dans le system prompt plutôt que le user prompt — pas applicable car `claudeJson` n'utilise pas de system prompt séparé.
