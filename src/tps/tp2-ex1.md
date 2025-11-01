---
layout: base.njk
title: "TP 2 : Agrégats, Choix multiple et Dates"
intitule: "TP 2 - Dates et agrégats"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 1
titre: "TP 2 : Agrégats, Choix multiple et Dates"
permalink: "/tp2/exercice1/"
tags: tp
---

# TP 2 : Agrégats, Choix multiple et Dates

## Description

Ce TP poursuit l'apprentissage SQL sur la base **`Comptoir2000`** en se concentrant sur :

1. **Agrégats** : Fonctions d'agrégation (COUNT, SUM, AVG, MIN, MAX), GROUP BY, HAVING
2. **Choix multiple** : Instructions CASE pour du SQL conditionnel
3. **Dates** : Manipulation et extraction de dates avec STRFTIME

## Schéma de la base de données

La base `Comptoir2000` contient les tables principales :

- **Client** : CodeCli, Societe, Contact, Fonction, Adresse, Ville, Region, CodePostal, Pays, Tel, Fax
- **Produit** : Refprod, Nomprod, Fournisseur, Categorie, UnitesStock, UnitesCom, PrixUnit, QteParUnit, Indisponible
- **Commande** : NoCom, CodeCli, DateCom, NoEmp, DateEnv, DateLivraison, ALivAvant, VilleLiv, AdresseLiv, CodePostalLiv, PaysLiv, Frais, Remise
- **DetailCommande** : NoCom, Refprod, Qte, Remise
- **Employe** : NoEmp, Nom, Prenom, Fonction, Responsable, DateEmbauche, DateNaissance, Adresse, Ville, Region, CodePostal, Pays, Tel, Notes
- **Fournisseur** : CodeFournisseur, NomFournisseur, Contact, Fonction, Adresse, Ville, Region, CodePostal, Pays, Tel, Fax
- **Categorie** : CodeCategorie, NomCategorie, Description
- **Messager** : CodeMessager, NomMessager

## Conseils pour bien démarrer

- Testez vos requêtes progressivement en commençant simple, puis ajoutez complexité
- Pour les agrégats : n'oubliez pas que `WHERE` filtre par lignes AVANT l'agrégation, `HAVING` qui filtre par groupe APRÈS
- Pour les dates : `STRFTIME` permet d'extraire année, mois, jour (`'%Y'`, `'%m'`, `'%d'`)
- Utilisez les indices pour vérifier votre compréhension du concept, pas pour vous éviter de vous tromper, c'est comme ça que l'on apprend.

## Exemples de requêtes SQL de manipulation de dates
```sql
-- Extraire l'année d'une date
SELECT STRFTIME('%Y', DateCom) AS AnneeCommande FROM Commande;
```

```sql
-- Compter les commandes par année
SELECT STRFTIME('%Y', DateCom) AS Annee, COUNT(*) AS NombreCommandes
FROM Commande
GROUP BY Annee;
```

## Exemples de requêtes SQL utilisant Having
```sql
-- Compter les produits par catégorie et ne garder que celles avec plus de 10 produits
SELECT Categorie, COUNT(*) AS NombreProduits
FROM Produit
GROUP BY Categorie
HAVING NombreProduits > 10;
```
