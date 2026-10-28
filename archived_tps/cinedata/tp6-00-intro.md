---
layout: base.njk
title: "TP 6 : CineData - Révision & Entraînement Autonome"
intitule: "TP 6 — Révision & Entraînement Autonome (CineData)"
base: "CineData.sqlite"
tpNum: 6
exerciceNum: 0
titre: "TP 6 : CineData - Révision & Entraînement Autonome"
permalink: "/tp6/intro/"
tags: tp
show_load_db: false
show_save_db: false
---

# TP 6 : CineData - Révision & Entraînement Autonome

## Description

Ce TP de synthèse vous fait travailler sur la base **`CineData`**, modélisant l'industrie cinématographique mondiale, le box-office et les communautés cinéphiles. Les données réelles sont issues de l'API officielle TMDB (2022-2026), complétées par des données d'utilisateurs et de séances :

- **Films** : Longs-métrages récents avec budgets, recettes mondiales de box-office, dates et durées
- **Genres** : Genres cinématographiques normalisés (Action, Drame, Science-Fiction, Animation...)
- **Personnes & Castings** : Équipes de tournage (acteurs, têtes d'affiche, réalisateurs, producteurs, scénaristes)
- **Cinéphiles** : Membres d'une communauté de spectateurs avec parrainage hiérarchique
- **Avis** : Projections en salle de cinéma ou VOD avec horodatage exact, notes et commentaires

Progression pédagogique :
- **Partie I** : Requêtes de base et jointures simples (15 questions)
- **Partie II** : Requêtes intermédiaires avec rentabilité, agrégats et conditions (9 questions)
- **Partie III** : Requêtes avancées, binômes d'acteurs, temporalité et division relationnelle (12 questions)
- **Partie IV** : Bonus - Défis complexes, collisions en salle et multi-statuts (8 questions)

## Schéma de la base de données

La base `CineData` contient :

### Tables principales

- **GENRES** (🔑 `id_genre`, `nom_genre`)
- **FILMS** (🔑 `id_film`, `titre`, `titre_original`, `date_sortie`, `duree_minutes`, `budget`, `recettes`, `note_tmdb`, `nb_votes`, `langue_originale`)
- **FILM_GENRES** (🔑🔗 `id_film`, 🔑🔗 `id_genre`)
- **PERSONNES** (🔑 `id_personne`, `nom`, `prenom`, `date_naissance`, `nationalite`)
- **CASTINGS** (🔑🔗 `id_film`, 🔑🔗 `id_personne`, 🔑 `metier`, `personnage`, `ordre_importance`)
- **CINEPHILES** (🔑 `id_cinephile`, `pseudo`, `nom`, `prenom`, `email`, `ville`, `date_naissance`, `date_inscription`, 🔗 `id_parrain`)
- **AVIS** (🔑 `id_avis`, 🔗 `id_cinephile`, 🔗 `id_film`, `date_seance`, `heure_seance`, `note_attribuee`, `vu_au_cinema`, `commentaire_court`)

