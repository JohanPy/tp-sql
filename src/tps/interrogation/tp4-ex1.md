---
layout: base.njk
category: interrogation
title: "TP 4 : Gymnase2000 - Complexe et performant"
intitule: "TP 4 - Récapitulatif"
base: "Gymnase2000.sqlite"
tpNum: 4
exerciceNum: 1
titre: "TP 4 : Gymnase2000 - Complexe et performant"
permalink: "/tp4/exercice1/"
tags: tp
---

# TP 4 : Gymnase2000 - Complexe et performant

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

- **Sportif** : NumLicence, NomSportif, PrenomSportif, Adresse, Tel, DateNaissance, Genre, NumGroupe
- **Sport** : NumSport, NomSport, Description
- **Gymnase** : NumGymnase, NomGymnase, Adresse, NumTel
- **Seance** : NumSeance, NumSport, NumGymnase, Horaire, Moniteur, MaxSportifs
- **Jouer** : NumLicence, NumSport, Niveau, DateDebut
- **Arbitrer** : NumLicence, NumSport, Niveau
- **Entrainer** : NumLicence, NumSport, Niveau

### Clés de liaison

- Jouer.NumLicence → Sportif.NumLicence
- Jouer.NumSport → Sport.NumSport
- Arbitrer.NumLicence → Sportif.NumLicence
- Arbitrer.NumSport → Sport.NumSport
- Entrainer.NumLicence → Sportif.NumLicence
- Entrainer.NumSport → Sport.NumSport
- Seance.NumSport → Sport.NumSport
- Seance.NumGymnase → Gymnase.NumGymnase

## Conseils pour bien démarrer

- **Changement de contexte** : Gymnase2000 est très différente de Comptoir2000. Les noms de tables et de colonnes sont nouveaux
- **Vérifiez les clés** : Avant chaque jointure, vérifiez que vous avez la bonne clé étrangère
- **Pensez au métier** : Un sportif peut jouer plusieurs sports, un entraîneur peut entraîner plusieurs sports
- **Niveaux** : Les colonnes "Niveau" représentent les compétences (débutant, confirmé, expert, etc.)
- **Séances** : Les séances sont des sessions programmées, différentes d'une relation directe
- Les indices vous aident à comprendre le concept, pas à copier la réponse

