---
layout: base.njk
title: "TP 3 : Dates, Agrégats & Choix Multiple (CASE)"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 0
titre: "TP 3 : Dates, Agrégats & Choix Multiple (CASE)"
permalink: "/tp3/intro/"
tags: tp
show_load_db: false
show_save_db: false
---

# TP 3 : Dates, Agrégats & Choix Multiple (CASE)

## Description

Ce TP poursuit l'apprentissage SQL sur la base **`Comptoir2000`** en se concentrant sur :

1. **Agrégats** : Fonctions d'agrégation (COUNT, SUM, AVG, MIN, MAX), GROUP BY, HAVING
2. **Choix multiple** : Instructions CASE pour du SQL conditionnel
3. **Dates** : Manipulation et extraction de dates avec STRFTIME

## Schéma de la base de données

La base `Comptoir2000` contient les tables principales :

Categorie (🔑 CodeCateg, NomCateg, Description)
Client (🔑 CodeCli, Societe, Contact, Fonction, Adresse, Ville, Region, CodePostal, Pays, Tel, Fax)
Commande (🔑 NoCom, 🔗 CodeCli, 🔗 NoEmp, DateCom, ALivAvant, DateEnv, NoMess, Port, Destinataire, AdrLiv, VilleLiv, RegionLiv, CodepostalLiv, PaysLiv)
DetailCommande (🔑🔗 Nocom, 🔑🔗 Refprod, PrixUnit, Qte, Remise)
Employe (🔑 NoEmp, Nom, Prenom, Fonction, TitreCourtoisie, DateNaissance, DateEmbauche, Adresse, Ville, Region, Codepostal, Pays, TelDom, Extension, RendCompteA)
Fournisseur (🔑 NoFour, Societe, Contact, Fonction, Adresse, Ville, Region, CodePostal, Pays, Tel, Fax, PageAccueil)
Messager (🔑 NoMess, NomMess, Tel)
Produit (🔑 Refprod, Nomprod, 🔗 NoFour, 🔗 CodeCateg, QteParUnit, PrixUnit, UnitesStock, UnitesCom, NiveauReap, Indisponible)

## Conseils pour bien démarrer

- Construisez vos requêtes étape par étape : testez d'abord une requête simple, puis ajoutez les filtres et les calculs.
- Pour les agrégats : `WHERE` filtre les lignes **avant** le regroupement (`GROUP BY`), tandis que `HAVING` filtre les groupes **après** le calcul des agrégats.
- Pour les dates : `STRFTIME` permet d'extraire l'année, le mois ou le jour (`'%Y'`, `'%m'`, `'%d'`).
- Consultez les indices uniquement si vous êtes bloqué.

## Exemples de manipulation de dates
```sql
-- Extraire l'année d'embauche d'un employé
SELECT Nom, STRFTIME('%Y', DateEmbauche) AS AnneeEmbauche
FROM Employe;
```

```sql
-- Compter le nombre d'employés embauchés par année
SELECT STRFTIME('%Y', DateEmbauche) AS Annee, COUNT(*) AS NbEmployes
FROM Employe
GROUP BY Annee;
```

## Exemple d'utilisation de HAVING
```sql
-- Compter les fournisseurs par pays et garder les pays ayant plus de 2 fournisseurs
SELECT Pays, COUNT(*) AS NbFournisseurs
FROM Fournisseur
GROUP BY Pays
HAVING COUNT(*) > 2;
```
