---
layout: base.njk
title: "TP 7 : AniBase - Grand Cas de Synthèse"
intitule: "TP 7 — Grand Cas de Synthèse (AniBase)"
base: "AniBase.sqlite"
tpNum: 7
exerciceNum: 0
titre: "TP 7 : AniBase - Grand Cas de Synthèse"
permalink: "/tp7/intro/"
tags: tp
show_load_db: false
show_save_db: false
---

# TP 7 : AniBase - Grand Cas de Synthèse

## Description

Ce TP de synthèse vous fait travailler sur la base **`AniBase`**, modélisant l'écosystème de l'animation japonaise et de ses communautés de fans. Les données sont issues de l'API GraphQL AniList (2020-2026), complétées par des membres et leurs listes de suivi (Watchlist) :

- **Animes** : Séries, films et ONA avec formats, durées d'épisodes, saisons et scores moyens
- **Studios** : Studios d'animation historiques et contemporains (Mappa, Ufotable, Wit Studio, Toei, Ghibli...)
- **Genres** : Catégories et thématiques (Action, Shonen, Fantasy, Romance, Sci-Fi...)
- **Staff & Crédits** : Réalisateurs, mangakas/auteurs, doubleurs (seiyū) et directeurs d'animation
- **Membres** : Utilisateurs de la plateforme communautaire avec parrainage hiérarchique
- **Watchlist** : Suivi individuel des visionnages (statut, épisodes vus, dates et notes personnelles)

Progression pédagogique :
- **Partie I** : Requêtes de base et jointures simples (15 questions)
- **Partie II** : Requêtes intermédiaires avec agrégats, orphelins et conditions (9 questions)
- **Partie III** : Requêtes avancées, auto-jointures, temporalité et division relationnelle (12 questions)
- **Partie IV** : Bonus - Défis complexes, conflits de production et hiérarchies (8 questions)

## Schéma de la base de données

La base `AniBase` contient :

### Tables principales

- **STUDIOS** (🔑 `id_studio`, `nom_studio`, `pays`, `annee_creation`)
- **ANIMES** (🔑 `id_anime`, `titre_romaji`, `titre_francais`, `format`, `nb_episodes`, `duree_episode_min`, `annee_diffusion`, `saison`, `note_moyenne`, 🔗 `id_studio`)
- **GENRES** (🔑 `id_genre`, `libelle`)
- **ANIME_GENRES** (🔑🔗 `id_anime`, 🔑🔗 `id_genre`)
- **STAFF** (🔑 `id_personne`, `nom`, `prenom`, `nationalite`)
- **CREDITS_ANIME** (🔑🔗 `id_anime`, 🔑🔗 `id_personne`, 🔑 `role`, `personnage_nom`)
- **MEMBRES** (🔑 `id_membre`, `pseudo`, `email`, `date_inscription`, `pays`, `annee_naissance`, 🔗 `id_parrain`)
- **WATCHLIST** (🔑🔗 `id_membre`, 🔑🔗 `id_anime`, `statut`, `note_perso`, `episodes_vus`, `date_ajout`, `date_fin`)

