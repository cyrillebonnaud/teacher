# Prompt QCM libre — Révision sur programme officiel

## Rôle

Générer 10 questions à choix multiples sur un sujet libre saisi par l'élève, en s'appuyant sur le programme officiel de 5e (cycle 4) — sans document uploadé. Résultats sauvegardés dans la séquence système "Sessions libres".

## Utilisé par

`lib/prompts.ts` → `buildQcmLibrePrompt(subject, topic, level, programmeText)`

## Prompt (en deux étapes)

### Étape 1 — Identifier la matière et valider le sujet

Avant de générer le QCM, le système résout la matière côté code (mapping `topic → fichier programme`) et injecte le contenu du programme correspondant. Si aucune matière ne correspond, afficher un message d'erreur UI sans appel Claude.

Mapping matière → fichier programme :
```
histoire / moyen âge / chrétienté / islam / féodalité → docs/programmes/histoire-geographie.md
géographie / démographie / ressources / risques        → docs/programmes/histoire-geographie.md
maths / fractions / géométrie / statistiques           → docs/programmes/mathematiques.md
français / lecture / écriture / grammaire / conjugaison → docs/programmes/francais.md
svt / corps / vivant / écosystème / nutrition          → docs/programmes/svt.md
physique / chimie / énergie / lumière / matière        → docs/programmes/physique-chimie.md
emc / citoyenneté / droits / démocratie               → docs/programmes/emc.md
```

Si le sujet ne correspond à aucune matière du cycle 4 → message UI : "Je ne connais pas ce sujet pour la 5e. Essaie une autre formulation, ou uploade ton cours !"

### Étape 2 — Génération du QCM

```
Tu es un professeur expert créant des QCM pour un élève de 5e (collège français).

L'élève veut réviser : "{{topic}}"
Matière identifiée : {{subject}}
NIVEAU : {{level}}/3 — {{levelDescription}}

Tu dois générer un QCM basé UNIQUEMENT sur ce que le programme officiel de 5e prévoit pour ce sujet.
Voici les contenus du programme officiel pour cette matière :
---
{{programmeText}}
---

RÈGLES OBLIGATOIRES :
- Génère exactement 10 questions en lien direct avec "{{topic}}" et le programme ci-dessus.
- Si le sujet est trop vague (ex: "histoire"), recentre sur les thèmes de 5e les plus proches.
- Chaque question a 4 choix (index 0 à 3), une seule bonne réponse.
- Les distracteurs doivent être plausibles mais faux — pas de "Aucune de ces réponses", pas de formulations négatives.
- L'explication doit citer ce que le programme de 5e attend sur ce point (1-2 phrases).
- IMPORTANT : si le sujet demandé ne fait pas partie du programme de 5e (ex: sujet de 3e ou de lycée), réponds avec un JSON vide [] et un message d'erreur dans le champ "error" : {"error": "Ce sujet est au programme de [niveau], pas de la 5e."}

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

## Variables

| Variable | Description |
|---|---|
| `{{topic}}` | Texte libre saisi par l'élève (ex: "Charlemagne", "les fractions", "la photosynthèse") |
| `{{subject}}` | Matière résolue côté code (ex: "Histoire", "Mathématiques") |
| `{{level}}` | Niveau 1, 2 ou 3 |
| `{{levelDescription}}` | Description du niveau (cf. `docs/prompts/qcm.md`) |
| `{{programmeText}}` | Contenu du fichier programme correspondant à la matière, injecté côté serveur |

## Différences vs prompt QCM standard

| Dimension | QCM standard | QCM libre |
|---|---|---|
| Source de vérité | Documents uploadés par l'élève | Programme officiel 5e (docs/programmes/) |
| Contexte | Cours réel de l'élève | Attendus institutionnels |
| Sujet | Toujours ancré dans les docs | Libre, résolu par mapping matière |
| Sauvegarde | Attaché à une séquence | Séquence système "Sessions libres" |
| Hallucination risk | Faible (ancré dans le cours) | Moyen (Claude reconstruit depuis le programme) |

## Gestion des cas limites

| Cas | Comportement |
|---|---|
| Sujet hors programme 5e | JSON `{"error": "..."}` → message UI bienveillant |
| Sujet trop vague | Claude recentre sur les thèmes 5e les plus proches |
| Sujet d'une autre année (ex: 3e) | Signaler le bon niveau dans le message d'erreur |
| Aucune matière mappée | Erreur UI avant appel Claude (pas de token gaspillé) |

---

## Changelog

| Date | Auteur | Description |
|---|---|---|
| 2026-03-29 | init | Création — mode libre avec programme officiel, mapping matière, séquence "Sessions libres" |
