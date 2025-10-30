# 📚 SQL TP - Plateforme d'entraînement SQL

Site statique d'entraînement SQL avec exécution en temps réel dans le navigateur.

## 🎯 Fonctionnalités

- ✅ **Exécution SQL en temps réel** : Moteur SQLite via WebAssembly (sql.js)
- ✅ **Interface 3 panneaux** : Navigation | Contenu | Console SQL
- ✅ **Multi-pages** : Une page par exercice de TP
- ✅ **Bases de données pré-chargées** : Chargement automatique selon le TP
- ✅ **Éditeur avec coloration syntaxique** : CodeMirror
- ✅ **Site statique** : Généré avec Eleventy

## 🚀 Développement local

### Installation

```bash
npm install
```

### Lancer le serveur de développement

```bash
npm start
```

Le site sera accessible sur http://localhost:8081

### Build de production

```bash
npm run build
```

Les fichiers générés sont dans le dossier `_site/`.

## 📁 Structure du projet

```
tp-sql/
├── src/                      # Sources Eleventy
│   ├── _includes/           # Layouts Nunjucks
│   │   └── base.njk        # Layout principal 3 panneaux
│   ├── tps/                # Fichiers markdown des TPs
│   │   ├── tp1-ex1.md
│   │   ├── tp1-ex2.md
│   │   └── ...
│   ├── assets/             # Assets statiques
│   │   ├── css/
│   │   │   └── demo.css
│   │   ├── js/
│   │   │   └── gui.js
│   │   └── db/             # Bases de données SQLite
│   │       ├── Comptoir2000.sqlite
│   │       ├── Gymnase2000.sqlite
│   │       └── ...
│   └── index.md            # Page d'accueil
├── .eleventy.js            # Configuration Eleventy
├── convert_tps.py          # Script de conversion des TPs
├── package.json
└── _site/                  # Site généré (ignoré par git)
```

## ✏️ Ajouter un nouveau TP

### 1. Créer le fichier markdown

Créez un fichier dans `src/tps/` avec le front-matter suivant :

```markdown
---
layout: base.njk
title: "Titre de l'exercice"
intitule: "TP X - Titre du TP"
base: "NomDeLaBase.sqlite"
tpNum: X
exerciceNum: Y
titre: "Titre de l'exercice"
permalink: "/tpX/exerciceY/"
tags: tp
---

# Votre exercice ici

Contenu en markdown...
```

### 2. Ajouter la base de données

Si vous utilisez une nouvelle base, placez le fichier `.sqlite` dans `src/assets/db/`.

### 3. Rebuild

Le site se régénère automatiquement en mode développement (`npm start`).

## 🔧 Technologies utilisées

- **[Eleventy](https://www.11ty.dev/)** : Générateur de site statique
- **[Nunjucks](https://mozilla.github.io/nunjucks/)** : Moteur de templates
- **[sql.js](https://github.com/sql-js/sql.js)** : SQLite compilé en WebAssembly
- **[CodeMirror](https://codemirror.net/)** : Éditeur de code
- **[Markdown-it](https://github.com/markdown-it/markdown-it)** : Parser Markdown

## 📦 Déploiement

Le site est automatiquement déployé sur GitHub Pages via GitHub Actions lors d'un push sur la branche `main`.

Configuration requise dans les paramètres du dépôt :
- Settings > Pages > Source : "GitHub Actions"

## 🛠️ Script de conversion

Le script `convert_tps.py` permet de convertir l'ancien format de TPs (multiples fichiers markdown + JSON) en format Eleventy (un fichier markdown avec front-matter par exercice).

```bash
python3 convert_tps.py
```

## 📝 Licence

MIT

## 👤 Auteur

Plateforme d'entraînement SQL pour les étudiants IUT
