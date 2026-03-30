# Prompt QCM — Génération de questions

## Rôle

Générer 10 questions à choix multiples à partir du texte extrait des documents d'une séquence, à un niveau de difficulté donné.

## Utilisé par

`lib/prompts.ts` → `buildQcmPrompt(level, courseText, previousQuestions?)`

## Prompt

```
Tu es un professeur expert créant des QCM pour un élève de 5e (collège français).

NIVEAU : {{level}}/3 — {{levelDescription}}

RÈGLES OBLIGATOIRES :
- Génère exactement 10 questions basées UNIQUEMENT sur le cours ci-dessous.
- Chaque question a 4 choix (index 0 à 3), une seule bonne réponse.
- Les distracteurs doivent être plausibles mais faux — pas de "Aucune de ces réponses", pas de formulations négatives ("laquelle n'est PAS…").
- L'explication doit être courte (1-2 phrases), pédagogique, et citer le cours.
{{previousNote}}

COURS :
---
{{courseText}}
---

Réponds UNIQUEMENT avec un tableau JSON valide, sans markdown, sans texte autour.
Format exact :
[
  {
    "question": "...",
    "choices": ["...", "...", "...", "..."],
    "correct": 0,
    "explanation": "..."
  }
]
```

## Descriptions par niveau

### Niveau 1 — Facile
```
Questions portant sur des faits directs et du vocabulaire de base.
Chaque question doit avoir une réponse clairement identifiable dans le cours.
Les distracteurs sont facilement éliminables.
Privilégie les questions de type : définition, date, nom propre, complément de phrase.
```

**Exemple few-shot :**
```json
{
  "question": "À quelle époque vivait Charlemagne ?",
  "choices": ["Antiquité", "Moyen Âge", "Renaissance", "Époque moderne"],
  "correct": 1,
  "explanation": "Charlemagne est roi des Francs de 768 à 814, ce qui correspond au Moyen Âge."
}
```

### Niveau 2 — Moyen
```
Questions nécessitant de comprendre le sens du cours, faire des liens entre concepts, ou reformuler des idées.
Les distracteurs sont plausibles mais un élève attentif peut les éliminer.
Privilégie les questions de type : cause/conséquence, reformulation, comparaison simple.
```

**Exemple few-shot :**
```json
{
  "question": "Pourquoi Charlemagne est-il couronné empereur en 800 ?",
  "choices": [
    "Pour unifier les royaumes francs sous une seule couronne",
    "Pour reconnaître son autorité sur toute la chrétienté occidentale",
    "Pour succéder à l'empereur romain d'Orient",
    "Pour sceller une alliance militaire avec le pape"
  ],
  "correct": 1,
  "explanation": "Le couronnement par le pape Léon III symbolise la reconnaissance de son pouvoir sur l'Occident chrétien, pas seulement sur les Francs."
}
```

### Niveau 3 — Expert
```
Questions d'analyse et de mise en relation de plusieurs concepts.
Les questions peuvent inclure des "pièges" subtils (nuances, exceptions, confusions fréquentes).
Les distracteurs sont très plausibles et nécessitent une lecture attentive du cours.
Privilégie les questions de type : analyse, nuance, mise en relation, conséquence indirecte.
```

**Exemple few-shot :**
```json
{
  "question": "En quoi le couronnement de Charlemagne en 800 marque-t-il une rupture avec l'empire romain ?",
  "choices": [
    "Il crée un empire distinct fondé sur la religion chrétienne plutôt que sur Rome",
    "Il abandonne le latin comme langue officielle de l'administration",
    "Il transfère le pouvoir impérial de Constantinople à Aix-la-Chapelle",
    "Il rompt toute relation diplomatique avec l'empire byzantin"
  ],
  "correct": 0,
  "explanation": "L'empire carolingien est un empire chrétien d'Occident, indépendant de Rome et de Byzance — c'est une nouvelle conception du pouvoir impérial fondée sur la foi, pas sur l'héritage romain."
}
```

## Variables

| Variable | Description |
|---|---|
| `{{level}}` | Niveau 1, 2 ou 3 |
| `{{levelDescription}}` | Description du niveau (voir ci-dessus) |
| `{{courseText}}` | Texte extrait concaténé de tous les documents de la séquence |
| `{{previousNote}}` | Si retry : "ÉVITE ces questions déjà posées : 1. ... 2. ..." (sinon vide) |

---

## Changelog

| Date | Auteur | Description |
|---|---|---|
| 2026-03-29 | init | Création avec exemples few-shot par niveau et contraintes distracteurs |
