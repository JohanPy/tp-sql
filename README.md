# Plateforme de TP SQL

Environnement web statique pour l'apprentissage et l'entraînement à l'interrogation de bases de données relationnelles (SQL). L'application s'exécute intégralement côté client dans le navigateur : les requêtes sont évaluées localement par un moteur SQLite compilé en WebAssembly, sans dépendance réseau ni serveur applicatif distant.

Une couche d'émulation MariaDB est intégrée au moteur d'exécution pour permettre aux étudiants d'utiliser la syntaxe standard MySQL/MariaDB sans être pénalisés par les particularismes de SQLite.

---

## Fonctionnalités

* **Console SQL intégrée :** éditeur CodeMirror avec coloration syntaxique, numérotation des lignes et autocomplétion contextuelle alimentée dynamiquement par le schéma de la base active (noms de tables et de colonnes).
* **Autocorrection par résultat attendu :** pour chaque question de TP, un bouton permet d'afficher la table résultat de référence afin que l'étudiant vérifie sa production. La requête solution est obfusquée au build (masquage XOR encodé en base64) pour empêcher sa lecture directe dans l'inspecteur DOM.
* **Historique et compte-rendu :** chaque requête exécutée est enregistrée avec son horodatage et son statut. Un panneau modal permet de copier ou d'exporter l'historique complet pour simplifier la remise du compte-rendu de séance.
* **Résultats multi-onglets :** possibilité d'ouvrir plusieurs onglets d'affichage pour comparer les jeux de données renvoyés par différentes requêtes.
* **Exploration du schéma :** affichage du dictionnaire de données (liste des tables, colonnes et types) et consultation intégrée du schéma relationnel sous forme de diagramme.
* **Émulation MariaDB transparente :** prise en charge des fonctions usuelles de manipulation de dates, de chaînes, de conditions et de statistiques enseignées en cours.

---

## Émulation MariaDB

Dans les cursus d'informatique (BUT, BTS, Licence), les étudiants sont principalement formés sur MariaDB ou PostgreSQL. SQLite présente des écarts bloquants : absence de fonctions temporelles directes (obligation d'utiliser `strftime`), concaténation restreinte à `||`, ou encore non-gestion des accents dans `UPPER()`.

Un module dédié (`src/assets/js/mariadb-emulation.js`) intercepte l'initialisation du moteur WebAssembly dans le Web Worker et enregistre un ensemble d'UDF scalaires et d'agrégats statistiques :

* **Temporel :** `NOW()`, `CURDATE()`, `CURTIME()`, `YEAR()`, `MONTH()`, `DAY()`, `HOUR()`, `MINUTE()`, `SECOND()`, `QUARTER()`, `DATEDIFF()`, `ADDDATE()`, `SUBDATE()`, `LAST_DAY()`, `DATE_FORMAT()`. Les fonctions d'extraction retournent des entiers numériques pour garantir la cohérence des clauses `WHERE` et des tris arithmétiques.
* **Chaînes et casse Unicode :** `CONCAT()` et `CONCAT_WS()` (enregistrées en arité variable `-1`), `SUBSTRING()`, `MID()`, `LEFT()`, `RIGHT()`, `LOCATE()`, `LPAD()`, `RPAD()`, `REVERSE()`, `FORMAT()`. Surcharge de `UPPER()`, `UCASE()`, `LOWER()`, `LCASE()` via le moteur JavaScript pour traiter fidèlement les caractères accentués français.
* **Logique et arithmétique :** `IF(cond, vrai, faux)`, `ISNULL()`, `NVL()`, `MOD()`, `TRUNCATE()`, `POW()`, `RAND()`, `GREATEST()`, `LEAST()`.
* **Agrégats statistiques :** calculs de variance et d'écart-type de population (`VAR_POP`, `VARIANCE`, `STD`, `STDDEV`, `STDDEV_POP`) et d'échantillon (`VAR_SAMP`, `STDDEV_SAMP`) via `create_aggregate`.

Un pré-traitement syntaxique (`sanitizeSQLForSQLite`) normalise les expressions entrant en conflit direct avec le parseur Lemon de SQLite avant soumission au moteur (notamment les parenthèses sur `CURRENT_DATE()`, `CURRENT_TIME()` ou `ISNULL()`).

---

## Bases de données et sources de données

Outre la base classique de gestion d'entreprise (`Comptoir2000`), j'ai généré 3 bases de données basées sur des données réelles issues d'APIs et de jeux de données ouverts, conçues pour être plus récentes (données de 2025) et facilement compréhensibles :

* **NetflixStream (`NetflixStream.sqlite`) :** modélise une plateforme de streaming vidéo (800 contenus, 300 abonnés avec réseau hiérarchique de parrainage, 4 500 visionnages et favoris). Les titres, formats, durées et volumes d'écoute proviennent des rapports officiels semestriels d'audience Netflix (*What We Watched: A Netflix Engagement Report*, 2023–2026). Les crédits artistiques officiels (réalisateurs, showrunners, acteurs principaux et scénaristes) ont été extraits et synchronisés via l'API REST de **TMDB (The Movie Database)**.
* **CineData (`CineData.sqlite`) :** modélise l'exploitation cinématographique en salles et VOD (600 films, 250 cinéphiles, 3 800 séances et avis). Les données économiques réelles (budgets et recettes au box-office mondial), les genres et les castings détaillés (acteurs, réalisateurs, scénaristes, producteurs) proviennent de l'API REST de **TMDB**, avec une priorisation marquée pour les grands succès populaires du cinéma français récent (*Un p'tit truc en plus*, *Kaamelott : Premier Volet*, *Le Comte de Monte-Cristo*, *L'Amour ouf*...).
* **AniBase (`AniBase.sqlite`) :** modélise l'industrie de l'animation japonaise (600 animes récents, 45 studios, 250 membres, 3 800 interactions de watchlist). Les métadonnées, dates, saisons de diffusion (`WINTER`, `SPRING`...) et équipes techniques réelles proviennent de l'API GraphQL d'**AniList**, complétées par les métadonnées des studios d'animation emblématiques (MAPPA, Ufotable, Wit Studio, CoMix Wave, Toei Animation...).


Toutes ces bases partagent une armature didactique commune (12 invariants relationnels stricts : jointures N:N, détection d'orphelins, auto-jointures hiérarchiques et temporelles, calculs arithmétiques) et un gabarit compact (< 1 Mo) garantissant une exécution rapide en WebAssembly dans le navigateur.

---

## Technologies employées

* **[Eleventy](https://www.11ty.dev/) :** générateur de site statique compilant les gabarits et les sujets Markdown.
* **[Nunjucks](https://mozilla.github.io/nunjucks/) :** moteur de templating structurant la disposition en trois panneaux (navigation, énoncé, console SQL).
* **[sql.js](https://github.com/sql-js/sql.js) :** portage WebAssembly de SQLite, isolé dans un Web Worker pour préserver la fluidité de l'interface graphique.
* **[CodeMirror 5](https://codemirror.net/5/) :** éditeur de code source avec mode SQL et module de complétion automatique.
* **[Markdown-it](https://github.com/markdown-it/markdown-it) & markdown-it-attrs :** moteur d'analyse Markdown enrichi pour la génération des boutons d'autocorrection.

---

## Installation et utilisation locale

Nécessite Node.js (version 18 ou supérieure).

```bash
npm install
```

### Serveur de développement

Lance le serveur local avec rechargement automatique lors de la modification des fichiers :

```bash
npm start
```

Le site est accessible à l'adresse `http://localhost:8080`.

### Suite de tests

Vérifie l'exactitude des calculs UDF, l'arité variable, les règles de propagation des valeurs NULL et l'exécution sur les bases réelles des TP (`Comptoir2000.sqlite`, `ClassicModel.sqlite`) :

```bash
npm test
```

### Build de production

```bash
npm run build
```

Les fichiers statiques prêts pour le déploiement sont compilés dans `_site/`.

---

## Structure du projet

```text
tp-sql/
├── bases/                    # Fichiers sources .sqlite et diagrammes .png
├── src/                      # Sources compilées par Eleventy
│   ├── _includes/            # Layout principal (base.njk)
│   ├── assets/               # Scripts, styles et worker
│   │   ├── css/
│   │   └── js/
│   │       ├── db-worker.js          # Web Worker d'exécution sql.js
│   │       ├── mariadb-emulation.js  # Définitions des UDF et agrégats MariaDB
│   │       ├── gui.js                # Contrôleur d'interface et autocomplétion
│   │       └── clickable-sql.js      # Insertion de code au clic dans l'énoncé
│   ├── tps/                  # Sujets des exercices au format Markdown
│   └── index.njk             # Page d'accueil listant les TP disponibles
├── test/                     # Tests automatisés d'émulation SQL
├── .eleventy.js              # Configuration Eleventy (assets, tags Markdown, filtres)
└── package.json
```

---

## Rédaction d'un exercice

Les sujets sont rédigés dans `src/tps/` au format Markdown avec un front-matter YAML :

```markdown
---
layout: base.njk
title: "Exercice 1 : Agrégats"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 1
titre: "Exercice 1 : Agrégats"
permalink: "/tp3/exercice1/"
tags: tp
---

# Exercice 1 : Agrégats

## Questions

**1. Compter le nombre total de commandes**

<!-- expected-query: Q1
SELECT COUNT(*) AS TotalCommandes FROM Commande;
-->
```

Le bloc `<!-- expected-query: QX ... -->` déclenche la génération du bouton de validation associé. Pour ajouter une nouvelle base, il suffit de déposer le fichier `.sqlite` dans `bases/` ; Eleventy la prend en charge automatiquement lors de la compilation.

---

## Déploiement

Le site est déployé automatiquement sur GitHub Pages par l'action `.github/workflows/deploy.yml` à chaque push sur la branche `main`.

---

## Licence

MIT
