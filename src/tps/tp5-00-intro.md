---
layout: base.njk
title: "TP 5 : NetflixStream - Grand Cas de Synthèse"
intitule: "TP 5 — Grand Cas de Synthèse (NetflixStream)"
base: "NetflixStream.sqlite"
tpNum: 5
exerciceNum: 0
titre: "TP 5 : NetflixStream - Grand Cas de Synthèse"
permalink: "/tp5/intro/"
tags: tp
show_load_db: false
show_save_db: false
---

# TP 5 : NetflixStream - Grand Cas de Synthèse

## Description

Ce TP de synthèse vous fait travailler sur la base **`NetflixStream`**, modélisant une plateforme mondiale de streaming vidéo. Les contenus proviennent des rapports officiels d'audience Netflix (2023-2026), complétés par des historiques d'abonnés et de visionnages :

- **Contenus** : Films et séries du catalogue avec dates de sortie, durées et audiences
- **Genres** : Catégories cinématographiques (Action, Comédie, Sci-Fi...)
- **Personnes & Participations** : Réalisateurs, acteurs principaux et scénaristes
- **Abonnés** : Utilisateurs abonnés avec formule tarifaire et parrainage hiérarchique
- **Visionnages** : Historique des sessions de lecture avec date, heure, durée et notes
- **Favoris** : Liste des œuvres sauvegardées par chaque abonné

Progression pédagogique :
- **Partie I** : Requêtes de base et jointures simples (15 questions)
- **Partie II** : Requêtes intermédiaires avec agrégats, orphelins et conditions (9 questions)
- **Partie III** : Requêtes avancées, auto-jointures, dates et division relationnelle (12 questions)
- **Partie IV** : Bonus - Défis complexes, détection de fraudes et hiérarchies (8 questions)

## Schéma de la base de données

La base `NetflixStream` contient :

### Tables principales

- **GENRES** (🔑 `id_genre`, `nom`)
- **CONTENUS** (🔑 `id_contenu`, `titre`, `type_format`, `date_sortie`, `duree_minutes`, `classification`, `disponible_monde`, `heures_vues_officielles`, 🔗 `id_genre`)
- **PERSONNES** (🔑 `id_personne`, `nom`, `prenom`, `date_naissance`, `nationalite`)
- **PARTICIPATIONS** (🔑🔗 `id_contenu`, 🔑🔗 `id_personne`, 🔑 `role`)
- **ABONNES** (🔑 `id_abonne`, `nom`, `prenom`, `email`, `pays`, `ville`, `date_naissance`, `date_inscription`, `formule`, 🔗 `id_parrain`)
- **VISIONNAGES** (🔑 `id_visionnage`, 🔗 `id_abonne`, 🔗 `id_contenu`, `date_visionnage`, `heure_debut`, `duree_regardee_min`, `note_avis`)
- **FAVORIS** (🔑🔗 `id_abonne`, 🔑🔗 `id_contenu`, `date_ajout`)

