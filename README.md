# 📚 TP SQL - Plateforme d'apprentissage SQL interactive

Plateforme web interactive pour l'apprentissage du SQL avec cours théoriques et travaux pratiques. Construite avec Eleventy, sql.js et CodeMirror.

## 🎯 Fonctionnalités

- **Cours théoriques structurés** : 6 chapitres couvrant SELECT, WHERE, ORDER/LIMIT, agrégation, jointures et sous-requêtes
- **Exercices pratiques** : 18 exercices répartis en 4 TPs avec bases de données intégrées
- **Console SQL interactive** : Éditeur CodeMirror avec coloration syntaxique et autocomplétion
- **Schéma de base de données** : Visualisation PNG + structure détaillée des tables avec détection automatique des clés
- **Navigation intelligente** : Organisation par catégories (Interrogation/Création) avec breadcrumbs contextuels
- **Système de progression** : Tracking localStorage des chapitres et exercices consultés
- **Design moderne** : Interface dark theme avec Nord color scheme, responsive jusqu'à 768px

## 🚀 Installation et utilisation

### Prérequis
- Node.js 16+ et npm

### Installation
```bash
npm install
```

### Développement
```bash
npm start  # http://localhost:8080
```

### Build production
```bash
ELEVENTY_ENV=production npm run build
```

## 📁 Structure du projet

```
src/
├── _includes/          # Templates Nunjucks
│   ├── base.njk        # Template TPs (3 colonnes)
│   ├── cours.njk       # Template cours (50/50)
│   └── home.njk        # Template pages d'index
├── cours/              # Contenu cours
│   ├── interrogation/  # 6 chapitres + index
│   └── creation/       # (À venir)
├── tps/                # Travaux pratiques
│   ├── interrogation/  # 18 exercices + index
│   └── creation/       # Placeholder
└── index.md            # Homepage

bases/                  # SQLite + PNG diagrammes
.eleventy.js            # Config Eleventy
```

## 📝 Ajouter du contenu

### Nouveau chapitre de cours

Créer `src/cours/{category}/NN-titre.md` :

```yaml
---
layout: cours.njk
title: "Chapitre N : Titre"
category: interrogation
chapNum: N
base: Comptoir2000.sqlite
permalink: "/cours/interrogation/chapitre-N/"
---
```

Les blocs SQL sont cliquables pour charger dans l'éditeur.

### Nouvel exercice TP

Créer `src/tps/{category}/tpN-exM.md` :

```yaml
---
layout: base.njk
category: interrogation
intitule: "TP N - Titre général"
base: "Comptoir2000.sqlite"
tpNum: N
exerciceNum: M
permalink: "/tpN/exerciceM/"
tags: tp
---
```

## 🏗️ Architecture

### Collections Eleventy
- `allTPs` : Tous les TPs triés
- `tpsByNumber` : TPs groupés par numéro
- `cours` : Tous les cours
- `coursByCategory` : Cours par catégorie
- `tpsByCategory` : TPs par catégorie

### Templates
- **base.njk** : 3 colonnes (nav | contenu | console)
- **cours.njk** : 50/50 (article | console) avec prev/next
- **home.njk** : Minimaliste pour index

### JavaScript
- **gui.js** : Console SQL, schema tab, historique
- **progression.js** : Tracking localStorage

### CSS
3600+ lignes avec variables CSS, responsive 1200/1024/768px

## 📊 Stats

- 30 pages (6 cours + 18 TPs + 6 index)
- ~15 000 mots de cours
- ~120 exemples SQL
- Build: ~0.2s

## 🐛 Debug

**Base non chargée** : Vérifier `base:` dans front matter et fichier dans `bases/`

**Navigation vide** : Vérifier `category:` présent dans front matter

**Prev/Next cassé** : Vérifier `chapNum` est un nombre et même `category`

## 📄 License

(À définir)
