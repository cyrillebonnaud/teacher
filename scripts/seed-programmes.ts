/**
 * Seed programmes officiels for 5e (primary) and other collège levels.
 * Idempotent: upserts on (level, subject).
 *
 * Usage: npx tsx scripts/seed-programmes.ts
 */

import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(process.cwd(), ".env.local") });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const PROGRAMMES = [
  // ── 5e ──────────────────────────────────────────────────────────────
  {
    level: "5e",
    subject: "Mathématiques",
    title: "Mathématiques — 5e",
    content: `## Nombres et calculs

### Fractions
- Fractions égales, fractions irréductibles. Simplification d'une fraction.
- Addition et soustraction de fractions : réduction au même dénominateur.
- Multiplication et division de fractions.
- Encadrement d'une fraction entre deux entiers consécutifs.

### Nombres relatifs
- Notion de nombre relatif (positif, négatif, nul). Nombres opposés.
- Ordre et comparaison sur la droite graduée.
- Addition et soustraction de nombres relatifs.
- Multiplication et division de nombres relatifs.

### Proportionnalité
- Reconnaître une situation de proportionnalité : coefficient de proportionnalité, tableau.
- Calcul d'une quatrième proportionnelle.
- Pourcentages : calculer un pourcentage, appliquer un taux.
- Échelles et agrandissements/réductions.

### Calcul littéral
- Expressions algébriques : notation, évaluation.
- Développement et factorisation : distributivité simple, double distributivité.
- Équations du premier degré à une inconnue : mise en équation et résolution.

## Géométrie

### Triangles
- Inégalité triangulaire. Cas d'égalité des triangles.
- Médiatrice d'un segment, propriétés.
- Hauteurs d'un triangle, orthocenter.

### Parallélisme et angles
- Propriétés des angles formés par deux droites parallèles coupées par une sécante.
- Angles alternes-internes, angles correspondants.

### Théorème de Pythagore
- Énoncé, réciproque, contraposée.
- Applications : calculer la longueur d'un côté d'un triangle rectangle.

### Cercle
- Propriétés du cercle. Corde, diamètre, tangente.
- Inscrit, circonscrit.

## Grandeurs et mesures
- Volumes : prismes droits et cylindres (formule, calculs).
- Aires latérales et totales.
- Durées, vitesses moyennes, conversions.

## Statistiques et probabilités
- Statistiques : moyenne, médiane, étendue, diagrammes.
- Introduction aux probabilités : expérience aléatoire, événement, fréquence, probabilité.`,
  },
  {
    level: "5e",
    subject: "Français",
    title: "Français — 5e",
    content: `## Lecture et compréhension

### Récits et romans
- Le récit d'aventure et le roman de chevalerie : caractéristiques narratives, héros, quête.
- La poésie lyrique : figures de style, versification (alexandrin, rime, strophe).
- Le conte merveilleux et le conte philosophique : distinctions, visée argumentative.
- La littérature du Moyen Âge : épopée, chanson de geste, roman courtois.

### Analyser un texte
- Repérer le point de vue du narrateur (interne, externe, omniscient).
- Distinguer narration, description, dialogue.
- Identifier les procédés stylistiques : métaphore, comparaison, personnification, hyperbole, anaphore.

## Grammaire et langue

### Classes grammaticales
- Les déterminants : articles, possessifs, démonstratifs, indéfinis, numéraux.
- Les pronoms : personnels, relatifs, démonstratifs, possessifs, indéfinis.
- Les adverbes : formation, emploi.

### Fonctions syntaxiques
- Sujet, verbe, COD, COI, COS.
- Attribut du sujet et attribut du COD.
- Compléments circonstanciels (lieu, temps, manière, cause, but, condition).
- Propositions subordonnées relatives : identification et analyse.

### Conjugaison
- Indicatif : présent, imparfait, passé simple, passé composé, plus-que-parfait, futur simple, conditionnel présent.
- Subjonctif présent : emploi après «que» et verbes de volonté, sentiment.
- Accord du participe passé avec «être» et «avoir».

### Orthographe
- Homophones grammaticaux (a/à, est/et, son/sont, ces/ses, mes/mais/mais, ou/où).
- Accord dans le groupe nominal (déterminant, nom, adjectif).
- Accord sujet-verbe (cas particuliers : sujet inversé, sujets multiples).

## Expression écrite
- Rédiger un récit en respectant la cohérence temporelle.
- Décrire un personnage ou un lieu de manière précise et évocatrice.
- Réécrire un extrait en changeant le point de vue ou le temps.`,
  },
  {
    level: "5e",
    subject: "Histoire-Géographie",
    title: "Histoire-Géographie — 5e",
    content: `## Histoire

### L'Occident féodal (XIe–XVe siècle)
- La société médiévale : ordres (clergé, noblesse, paysans), seigneurie, château fort.
- L'Église au Moyen Âge : pape, évêques, monastères, rôle culturel et social.
- Les Croisades : contexte, déroulement, conséquences.
- L'essor des villes : commerce, artisans, bourgeoisie.
- La guerre de Cent Ans et la construction du Royaume de France.

### Byzance et l'Islam médiéval
- L'Empire byzantin : héritier de Rome, art et culture.
- L'essor de l'Islam : Mahomet, Coran, expansion arabe, califats.
- Al-Andalus et les échanges méditerranéens.

### La Renaissance (XVe–XVIe siècle)
- Humanisme : retour aux textes antiques, place de l'homme.
- Grandes découvertes : Colomb, Vasco de Gama, conquistadors.
- Réformes religieuses : Luther, Calvin, Réforme catholique.
- Art de la Renaissance : perspective, Léonard de Vinci, Raphaël.

## Géographie

### Sociétés et développement
- Richesses et pauvreté dans le monde : IDH, indicateurs de développement.
- La population mondiale : croissance, transition démographique, migrations.
- L'urbanisation dans le monde : mégapoles, métropoles.

### Les espaces ruraux et agricoles
- Agricultures vivrières vs commerciales.
- La question alimentaire mondiale.

### Les espaces maritimes
- Routes maritimes et commerce mondial.
- Les risques côtiers, littoraux et enjeux environnementaux.`,
  },
  {
    level: "5e",
    subject: "Sciences de la Vie et de la Terre",
    title: "SVT — 5e",
    content: `## Vivant et environnement

### Les écosystèmes
- Définition d'un écosystème : biotope et biocénose.
- Chaînes et réseaux alimentaires : producteurs, consommateurs, décomposeurs.
- Flux de matière et d'énergie.
- Équilibres et perturbations d'un écosystème.

### Respiration et photosynthèse
- La photosynthèse : réaction globale, rôle de la chlorophylle, conditions (lumière, CO2, eau).
- La respiration cellulaire : consommation d'O2, production de CO2, dégagement d'énergie.
- Comparaison photosynthèse / respiration.

## Géologie et planète Terre

### La tectonique des plaques
- Structure interne du Globe : croûte, manteau, noyau.
- Plaques lithosphériques, frontières convergentes et divergentes.
- Séismes : foyer, épicentre, ondes sismiques.
- Volcans : types d'éruptions, points chauds, rift.
- Conséquences : risques naturels, formation des chaînes de montagnes.

### Roches et minéraux
- Roches sédimentaires, métamorphiques, magmatiques : formation, identification.
- Le cycle des roches.

## Corps humain

### Nutrition et digestion
- Le système digestif : organes, rôles, enzymes.
- Absorption intestinale : villosités, passage dans le sang.
- Les nutriments : glucides, lipides, protides, vitamines, sels minéraux.

### Reproduction
- Puberté : modifications du corps, hormones (testostérone, œstrogènes).
- Appareil reproducteur féminin et masculin.
- Fécondation, grossesse, accouchement.`,
  },
  {
    level: "5e",
    subject: "Physique-Chimie",
    title: "Physique-Chimie — 5e",
    content: `## Chimie

### Atomes et molécules
- Notion d'atome : noyau, électrons. Modèle de Bohr simplifié.
- Molécules : formule chimique, représentation moléculaire.
- Corps purs simples et composés, mélanges.

### Réactions chimiques
- Transformation chimique : réactifs, produits, conservation de la masse (loi de Lavoisier).
- Équation de réaction : écriture, équilibrage.
- Combustions : combustion du carbone, du méthane (CH4 + 2O2 → CO2 + 2H2O).
- Réactions acide-base : neutralisation, indicateurs colorés, pH.

## Physique

### Lumière
- Propagation rectiligne de la lumière. Sources primaires et secondaires.
- Dispersion de la lumière blanche : spectre, prisme.
- Réflexion et réfraction : lois de Snell-Descartes (introduction qualitative).

### Électricité
- Circuit électrique : générateur, récepteur, interrupteur, fil.
- Loi des nœuds, loi des mailles.
- Tension électrique (U, volt) et intensité (I, ampère).
- Loi d'Ohm : U = R × I. Résistance électrique.
- Sécurité électrique : fusibles, disjoncteurs.

### Mécanique
- Forces : définition, représentation vectorielle (point d'application, direction, sens, valeur).
- Forces de contact et à distance.
- Poids et masse : P = m × g (g = 10 N/kg sur Terre).
- Principe d'inertie (1re loi de Newton) : mouvement rectiligne uniforme.`,
  },
  {
    level: "5e",
    subject: "Histoire des arts",
    title: "Histoire des arts — 5e",
    content: `## Arts du Moyen Âge et de la Renaissance

### Architecture médiévale
- L'art roman : caractéristiques (voûtes en berceau, arcs en plein cintre), abbayes.
- L'art gothique : cathédrales, arcs-boutants, rosaces, voûtes en croisée d'ogives.
- Le château fort : évolution, donjon, enceinte.

### Arts de la Renaissance
- La peinture flamande : Jan van Eyck, perspective atmosphérique.
- La Renaissance italienne : Léonard de Vinci (La Joconde, La Cène), Michel-Ange (Chapelle Sixtine), Raphaël.
- Architecture : retour aux ordres antiques (colonnes, frontons), symétrie.

## Démarche d'analyse d'une œuvre
- Identifier : nature de l'œuvre, artiste, date, commanditaire, localisation.
- Décrire : composition, technique, matériaux, couleurs.
- Analyser : message, symbolisme, contexte historique.
- Interpréter : signification, réception.`,
  },
  // ── 6e ──────────────────────────────────────────────────────────────
  {
    level: "6e",
    subject: "Mathématiques",
    title: "Mathématiques — 6e",
    content: `## Nombres et calculs

### Entiers et décimaux
- Grands nombres : lecture, écriture, comparaison.
- Nombres décimaux : écriture décimale et fractionnaire, comparaison, encadrement.
- Les quatre opérations sur les entiers et décimaux.
- Priorités opératoires (sans parenthèses, puis avec parenthèses).

### Fractions simples
- Notion de fraction : numérateur, dénominateur.
- Fractions égales, fractions décimales.
- Comparaison de fractions avec le même dénominateur.
- Fraction d'une quantité.

### Multiples et diviseurs
- Multiples d'un entier, diviseurs d'un entier.
- Critères de divisibilité par 2, 3, 4, 5, 9, 10.
- PPCM et PGCD (introduction).

## Géométrie
- Droites : parallèles, perpendiculaires, sécantes.
- Angles : mesure en degrés, angles droits, aigus, obtus, plats.
- Triangles : construction, types (rectangle, isocèle, équilatéral).
- Quadrilatères : propriétés du carré, rectangle, losange, parallélogramme.
- Symétrie axiale : axes de symétrie, construction de symétriques.
- Cercle : centre, rayon, diamètre, corde.

## Grandeurs et mesures
- Longueurs, aires, volumes : unités et conversions.
- Périmètres des figures usuelles.
- Aires : carré, rectangle, triangle, disque (introduction).
- Durées et conversions.`,
  },
  {
    level: "6e",
    subject: "Français",
    title: "Français — 6e",
    content: `## Lecture
- Récits de l'Antiquité : mythes, épopées (Iliade, Odyssée), fables d'Ésope/La Fontaine.
- Contes : structure narrative, personnages, schéma actantiel.
- Poésie : découverte des formes poétiques (sonnet, ode), figures de style simples.

## Grammaire
- Classes grammaticales : nom, déterminant, adjectif, verbe, pronom, adverbe, préposition, conjonction.
- La phrase : types (déclarative, interrogative, exclamative, impérative), formes (affirmative/négative).
- Fonctions : sujet, verbe, compléments essentiels (COD, COI) et circonstanciels.
- Propositions indépendantes, principales et subordonnées (identification).

## Conjugaison
- Temps du passé : imparfait (description), passé simple (actions), passé composé.
- Présent et futur simple.
- Accord sujet-verbe (cas réguliers).

## Orthographe
- Accord dans le GN, accord sujet-verbe.
- Homophones courants : a/à, et/est, on/ont, son/sont, ou/où.
- Pluriel des noms et adjectifs.

## Expression écrite
- Rédiger un récit court (début, milieu, fin).
- Décrire un lieu ou un personnage.`,
  },
  // ── 4e ──────────────────────────────────────────────────────────────
  {
    level: "4e",
    subject: "Mathématiques",
    title: "Mathématiques — 4e",
    content: `## Nombres et calculs

### Puissances
- Puissances d'un nombre : notation, calculs (a^n).
- Puissances de 10, notation scientifique.
- Ordre de grandeur.

### Calcul numérique
- Fractions et opérations : priorités, fractions composées.
- Calcul littéral avancé : développement, factorisation (identités remarquables : (a+b)^2, (a-b)^2, (a+b)(a-b)).
- Equations du 1er degré : résolution algébrique, systèmes 2×2.

### Fonctions (introduction)
- Notion de fonction, notion de variable.
- Tableau de valeurs, représentation graphique.
- Fonctions linéaires et affines : y = ax + b.

## Géométrie

### Transformations
- Translation : définition, propriétés, construction.
- Rotation : définition, propriétés, construction.
- Homothétie (introduction).

### Théorème de Thalès
- Énoncé et réciproque.
- Applications : calculs de longueurs.

### Trigonométrie (introduction)
- Cosinus, sinus, tangente dans le triangle rectangle.
- Calcul d'un angle ou d'une longueur.

## Statistiques et probabilités
- Statistiques : médiane, quartiles, boîte à moustaches.
- Probabilités : calculs de probabilités, événements contraires, fréquences.`,
  },
  {
    level: "4e",
    subject: "Français",
    title: "Français — 4e",
    content: `## Lecture
- Le roman réaliste et naturaliste : Zola, Maupassant, Flaubert — portraits, descriptions sociales.
- La poésie romantique : Lamartine, Hugo, Musset — lyrisme, thèmes (nature, amour, temps).
- Théâtre : comédie (Molière), drame romantique — fonctions du dialogue, didascalies.
- L'argumentation directe : essai, discours, fable argumentative.

## Grammaire
- Propositions subordonnées complétives, circonstancielles (cause, conséquence, opposition, concession).
- Le discours rapporté : direct, indirect, indirect libre.
- Modes verbaux : indicatif, subjonctif, conditionnel, impératif, infinitif, participe, gérondif.

## Conjugaison
- Tous les temps de l'indicatif (actif et passif).
- Subjonctif présent et passé : emploi.
- Conditionnel présent et passé (hypothèse).
- Voix passive : transformation, emploi.

## Orthographe et lexique
- Dérivation et composition : préfixes, suffixes, familles de mots.
- Étymologie latine et grecque.
- Orthographe des participes passés (cas complexes).

## Expression écrite
- Rédiger un portrait littéraire réaliste.
- Écrire un dialogue argumentatif.
- Développer un point de vue en 3 paragraphes (thèse, antithèse, synthèse).`,
  },
  // ── 3e ──────────────────────────────────────────────────────────────
  {
    level: "3e",
    subject: "Mathématiques",
    title: "Mathématiques — 3e",
    content: `## Nombres et calculs

### Développements et factorisations
- Double distributivité, identités remarquables.
- Factorisation pour résoudre des équations produits.

### Racines carrées
- Définition et propriétés. Simplification de racines carrées.
- Calculs avec des radicaux.

### Équations et inéquations
- Équations du 2nd degré : trinôme ax^2 + bx + c, discriminant Δ.
- Inéquations du 1er degré : résolution et représentation sur la droite réelle.
- Systèmes d'équations : méthodes de substitution et de combinaison.

## Géométrie

### Trigonométrie
- Cosinus, sinus, tangente dans le triangle rectangle (sin, cos, tan).
- Formules et calculs d'angles et de longueurs.
- Théorème de Pythagore et trigonométrie combinés.

### Géométrie dans l'espace
- Solides : prismes, cylindres, cônes, pyramides, sphère.
- Calcul de volumes et d'aires.
- Sections planes de solides.

## Fonctions
- Fonctions affines : représentation, coefficient directeur, ordonnée à l'origine.
- Fonctions de référence : f(x) = x^2, f(x) = 1/x, f(x) = √x.
- Variations et représentations graphiques.

## Statistiques et probabilités
- Loi des grands nombres, simulation.
- Probabilités conditionnelles (introduction).
- Dénombrement : règle du produit.`,
  },
  {
    level: "3e",
    subject: "Français",
    title: "Français — 3e",
    content: `## Lecture
- Le roman du XXe siècle : Camus, Sartre, Simone de Beauvoir — existentialisme, engagement.
- Littérature engagée : Zola (J'accuse), Prévert, Éluard — poésie de résistance.
- Autobiographie et autofiction : Rousseau, Sarraute, Perec.
- Théâtre contemporain : Ionesco, Beckett — théâtre de l'absurde.

## Grammaire et langue
- Révision complète des classes et fonctions grammaticales.
- Discours rapporté : tous les types et transformations.
- Modalisateurs : adverbes, verbes de modalité (devoir, pouvoir, sembler).
- Connecteurs logiques : cause, conséquence, opposition, concession.

## Conjugaison
- Révision de tous les modes et temps.
- Concordance des temps.
- Emploi du subjonctif (doute, volonté, sentiment, hypothèse).

## Expression écrite (brevet)
- La rédaction : récit, description, dialogue intégrés.
- La réponse développée à une question de lecture.
- Le texte argumentatif : thèse, arguments, exemples, conclusion.
- La dictée : règles orthographiques fondamentales.

## Préparation au Brevet (DNB)
- Grille d'évaluation du brevet.
- Exercices sur la langue (questions de grammaire, conjugaison, vocabulaire).
- Rédaction dans les conditions du brevet.`,
  },
];

async function main() {
  let seeded = 0;
  for (const prog of PROGRAMMES) {
    const { error } = await supabase.from("programmes").upsert(
      {
        id: randomUUID(),
        level: prog.level,
        subject: prog.subject,
        title: prog.title,
        content: prog.content,
      },
      { onConflict: "level,subject" }
    );
    if (error) {
      console.error(`Failed to seed ${prog.level} ${prog.subject}:`, error.message);
    } else {
      console.log(`Seeded: ${prog.level} — ${prog.subject}`);
      seeded++;
    }
  }
  console.log(`\nDone: ${seeded}/${PROGRAMMES.length} programmes seeded`);
}

main();
