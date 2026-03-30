## 1. Schema & Seed

- [x] 1.1 Ajouter les tables `parent` et `child` dans Prisma schema (parent: id, first_name, access_code_hash ; child: id, parent_id, first_name, level, access_code)
- [x] 1.2 Ajouter la colonne `child_id` (nullable, FK) sur la table `sequence`
- [x] 1.3 Ajouter la table `programme` (id, level, subject, title, content)
- [x] 1.4 Exécuter `db:push` pour appliquer le schema
- [x] 1.5 Créer le script de seed : parent "Cyrille" code `CYRILLE` (hash SHA-256, upsert idempotent)

## 2. Auth par code d'accès

- [x] 2.1 Créer la Server Action `loginWithCode(code)` : lookup parent par hash, set cookie JWT HTTP-only (30j)
- [x] 2.2 Créer la page `/login` avec champ code d'accès et message d'erreur
- [x] 2.3 Créer le middleware Next.js : protéger toutes les routes sauf `/login`, redirect si pas de session
- [x] 2.4 Créer le helper `getCurrentParent()` : lit le cookie, vérifie le JWT, retourne le parent
- [x] 2.5 Ajouter la Server Action `logout()` : supprime le cookie, redirect `/login`

## 3. Gestion des enfants

- [x] 3.1 Créer la Server Action `addChild(parentId, firstName, level)` : génère un code 6 chars, insère en base
- [x] 3.2 Créer le formulaire d'ajout d'enfant (prénom + sélecteur niveau 6e/5e/4e/3e)
- [x] 3.3 Afficher le code d'accès généré après création (modal ou inline)

## 4. Dashboard parent

- [x] 4.1 Créer le layout authentifié avec header (nom parent, nav Mes enfants | Programmes, bouton déconnexion)
- [x] 4.2 Modifier la page `/` : dashboard avec cartes enfants (prénom, niveau, nb séquences, dernier QCM)
- [x] 4.3 Gérer l'état vide (pas d'enfant → CTA ajouter un enfant)

## 5. Vue enfant

- [x] 5.1 Créer la page `/children/[childId]` : liste des séquences de l'enfant avec stats QCM (nb évals, meilleur score)
- [x] 5.2 Lien vers `/sequences/[id]` depuis chaque séquence
- [x] 5.3 État vide : message + CTA créer une séquence

## 6. Rattachement séquence → enfant

- [x] 6.1 Ajouter l'étape sélection enfant dans le funnel de création de séquence
- [x] 6.2 Modifier la Server Action `createSequence` pour inclure `child_id`
- [x] 6.3 Valider que `child_id` est obligatoire à la soumission

## 7. Navigateur programmes

- [x] 7.1 Seeder les programmes officiels pour les niveaux 6e→3e (au minimum 5e complet) dans la table `programme`
- [x] 7.2 Créer la page `/programmes` : liste filtrée par niveau (défaut 5e) et matière
- [x] 7.3 Ajouter le champ recherche full-text (ILIKE sur title + content, case-insensitive)
- [x] 7.4 Créer la page `/programmes/[id]` : vue détaillée du programme (texte formaté)
- [x] 7.5 Mise en évidence des termes recherchés dans les résultats

## 8. Tests E2E

- [x] 8.1 Test login : code valide → dashboard, code invalide → erreur, case-insensitive
- [x] 8.2 Test ajout enfant + code généré affiché
- [x] 8.3 Test création séquence rattachée à un enfant
- [x] 8.4 Test navigation programmes + recherche full-text
