---
layout: base.njk
title: "TP 5 : Gymnase2000 - Grand Cas de Synthèse"
intitule: "TP 5 — Grand Cas de Synthèse (Gymnase2000)"
base: "Gymnase2000.sqlite"
tpNum: 5
exerciceNum: 0
titre: "TP 5 : Gymnase2000 - Grand Cas de Synthèse"
permalink: "/tp5/intro/"
tags: tp
show_load_db: false
show_save_db: false
---

# TP 5 : Gymnase2000 - Grand Cas de Synthèse

## Description

Ce dernier TP vous fait travailler sur la base **`Gymnase2000`**, une base complètement différente de Comptoir2000. Elle gère un complexe sportif avec :

- **Sportifs** : Les adhérents du gymnase
- **Sports** : Types d'activités proposées
- **Gymnases** : Différents lieux du complexe
- **Seances** : Séances d'entraînement programmées
- **Jouer** : Association entre sportifs et sports
- **Arbitrer** : Arbitres et sports qu'ils arbitrent
- **Entrainer** : Entraîneurs et sports qu'ils enseignent

Progression pédagogique :
- **Partie I** : Requêtes de base et jointures simples (15 questions)
- **Partie II** : Requêtes intermédiaires avec agrégats et conditions (8 questions)
- **Partie III** : Requêtes avancées et sous-requêtes complexes (14 questions)

## Schéma de la base de données

La base `Gymnase2000` contient :

### Tables principales


**Arbitrer** (🔑🔗 IdSportif, 🔑🔗 IdSport)
**Entrainer** (🔑🔗 IdSportifEntraineur, 🔑🔗 IdSport)
**Gymnases** (🔑 IdGymnase, NomGymnase, Adresse, Ville, Surface)
**Jouer** (🔑🔗 IdSportif, 🔑🔗 IdSport)
**Seances** (🔑🔗 IdGymnase, 🔑🔗 IdSport, 🔑🔗 IdSportifEntraineur, 🔑 Jour, 🔑 Horaire, Duree)
**Sportifs** (🔑 IdSportif, Nom, Prenom, Sexe, Age, IdSportifConseiller)
**Sports** (🔑 IdSport, Libelle)