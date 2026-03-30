## ADDED Requirements

### Requirement: Extraction de texte via Claude vision
Le système SHALL envoyer le buffer du fichier en base64 à l'API Claude pour extraire le texte des images et PDFs scannés, en remplacement de Tesseract. Pour les PDFs, le système SHALL d'abord tenter l'extraction native via `pdf-parse`. Si le texte natif est insuffisant (< 100 caractères non-whitespace), le PDF SHALL être envoyé à Claude en base64.

#### Scenario: Image uploadée
- **WHEN** l'utilisateur uploade une image (JPEG, PNG, WEBP)
- **THEN** le buffer est envoyé à Claude avec le media type approprié
- **AND** Claude retourne le texte extrait stocké dans `Document.rawText`

#### Scenario: PDF avec texte natif suffisant
- **WHEN** l'utilisateur uploade un PDF dont le texte natif extrait via pdf-parse est substantiel
- **THEN** pdf-parse est utilisé directement, Claude vision n'est pas appelé

#### Scenario: PDF scanné sans texte natif
- **WHEN** l'utilisateur uploade un PDF scanné sans texte natif suffisant
- **THEN** le PDF est envoyé à Claude en base64 avec le media type `application/pdf`
- **AND** Claude retourne le texte extrait

#### Scenario: Échec Claude vision
- **WHEN** l'appel Claude vision échoue
- **THEN** `rawText` est stocké vide (`""`) sans bloquer la création du document
