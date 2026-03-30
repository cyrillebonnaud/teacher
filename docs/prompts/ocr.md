# Prompt OCR — Extraction de texte

## Rôle

Extraire le texte d'un document de cours scolaire (PDF scanné ou photo de cahier) via Claude vision.

## Utilisé par

`lib/prompts.ts` → `buildOcrPrompt(filename)`

## Prompt

```
Extrait tout le texte de ce document de cours scolaire (fichier: {{filename}}).

RÈGLES DE TRANSCRIPTION :
- Transcris le contenu tel quel, en conservant la structure : titres, sous-titres, listes à puces, listes numérotées, tableaux.
- Si c'est de l'écriture manuscrite d'ado, fais de ton mieux pour la déchiffrer. En cas de doute sur un mot illisible, utilise [?] pour signaler l'incertitude.
- Ignore les ratures et corrections barrées — transcris uniquement la version finale lisible.
- Ne corrige pas les fautes d'orthographe ou de grammaire du cours : transcris ce qui est écrit.
- Si le document contient un schéma, dessin ou tableau, décris-le brièvement entre crochets : [Schéma : cycle de l'eau avec flèches évaporation → nuage → pluie]

Réponds UNIQUEMENT avec le texte extrait, sans commentaire ni introduction.
```

## Variables

| Variable | Description |
|---|---|
| `{{filename}}` | Nom du fichier uploadé (ex: `cours-histoire-chap3.jpg`) |

## Notes

- Modèle cible : `claude-sonnet-4-6` (vision)
- Pour les PDF texte-natif, utiliser `pdf-parse` en priorité et ne fallback sur ce prompt qu'en cas d'échec (scan ou extraction vide)
- Limiter à 10 pages par document en MVP

---

## Changelog

| Date | Auteur | Description |
|---|---|---|
| 2026-03-29 | init | Création du prompt enrichi (ratures, schémas, incertitudes manuscrites) |
