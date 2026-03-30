## ADDED Requirements

### Requirement: Upload de document vers Supabase Storage
Le système SHALL uploader le fichier dans le bucket Supabase Storage `documents` au lieu de l'écrire sur le filesystem local. Le chemin de stockage SHALL être `{sequenceId}/{timestamp}-{filename}`. L'URL publique du fichier SHALL être stockée dans `Document.filePath`.

#### Scenario: Upload réussi
- **WHEN** l'utilisateur soumet un document valide
- **THEN** le fichier est présent dans le bucket `documents` de Supabase Storage
- **AND** `Document.filePath` contient l'URL publique Supabase du fichier

#### Scenario: Erreur d'upload Supabase
- **WHEN** l'upload vers Supabase Storage échoue
- **THEN** une erreur est levée et aucun enregistrement `Document` n'est créé en base

### Requirement: Client Supabase isolé
Le système SHALL exposer un helper `lib/supabase.ts` qui crée un client Supabase à partir des variables d'env `SUPABASE_URL` et `SUPABASE_SERVICE_KEY`. Ce client SHALL être utilisé uniquement côté serveur (Server Actions).

#### Scenario: Variables d'env manquantes
- **WHEN** `SUPABASE_URL` ou `SUPABASE_SERVICE_KEY` n'est pas défini
- **THEN** une erreur explicite est levée au moment de l'appel
