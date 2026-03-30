## ADDED Requirements

### Requirement: Client Anthropic initialisé au démarrage
Le module `lib/claude.ts` SHALL exporter un client Anthropic SDK initialisé avec `ANTHROPIC_API_KEY` depuis les variables d'environnement.

#### Scenario: Clé API présente
- **WHEN** `ANTHROPIC_API_KEY` est définie dans l'environnement
- **THEN** le client s'initialise et les fonctions `claudeText`, `claudeJson`, `claudeStream` sont opérationnelles

#### Scenario: Clé API absente
- **WHEN** `ANTHROPIC_API_KEY` n'est pas définie
- **THEN** les appels lèvent une erreur explicite mentionnant la variable manquante

### Requirement: Réponse texte simple via claudeText
`claudeText(prompt, opts?)` SHALL envoyer le prompt à l'API Anthropic et retourner la réponse texte complète.

#### Scenario: Appel OCR
- **WHEN** `claudeText` est appelé avec un prompt d'extraction de texte
- **THEN** l'API retourne le texte extrait en tant que `Promise<string>`

#### Scenario: System prompt optionnel
- **WHEN** `claudeText` est appelé avec `opts.systemPrompt`
- **THEN** le system prompt est envoyé dans le paramètre `system` de l'API

### Requirement: Réponse JSON structurée via claudeJson
`claudeJson<T>(prompt, schema, opts?)` SHALL envoyer le prompt à l'API et parser la réponse en JSON typé.

#### Scenario: Génération QCM
- **WHEN** `claudeJson` est appelé avec un prompt QCM et un schema de 10 questions
- **THEN** la réponse est un tableau de 10 objets Question parsés depuis le JSON retourné par l'API

#### Scenario: JSON invalide retourné par l'API
- **WHEN** la réponse de l'API n'est pas du JSON valide
- **THEN** une erreur est levée avec un extrait de la réponse pour debug

### Requirement: Streaming via claudeStream
`claudeStream(prompt, opts?)` SHALL retourner un `ReadableStream<Uint8Array>` qui émet les tokens au fur et à mesure de la réponse.

#### Scenario: Chat streaming
- **WHEN** `claudeStream` est appelé avec un prompt de conversation
- **THEN** les tokens sont émis progressivement dans le stream et le stream se ferme à la fin de la réponse

#### Scenario: Annulation du stream
- **WHEN** le consumer annule le `ReadableStream` (ex: l'utilisateur quitte la page)
- **THEN** la requête vers l'API est interrompue proprement

### Requirement: Modèle configurable
Le modèle utilisé SHALL être configurable via la variable d'environnement `CLAUDE_MODEL`, avec `claude-haiku-4-5-20251001` comme valeur par défaut.

#### Scenario: Modèle par défaut
- **WHEN** `CLAUDE_MODEL` n'est pas définie
- **THEN** les requêtes utilisent `claude-haiku-4-5-20251001`

#### Scenario: Override du modèle
- **WHEN** `CLAUDE_MODEL` est définie à `claude-sonnet-4-6`
- **THEN** les requêtes utilisent `claude-sonnet-4-6`

### Requirement: Limites de tokens explicites
Chaque appel API SHALL spécifier un `max_tokens` adapté au cas d'usage pour éviter les coûts incontrôlés.

#### Scenario: QCM et OCR
- **WHEN** `claudeText` ou `claudeJson` est appelé
- **THEN** `max_tokens` est fixé à 4096

#### Scenario: Chat streaming
- **WHEN** `claudeStream` est appelé
- **THEN** `max_tokens` est fixé à 2048
