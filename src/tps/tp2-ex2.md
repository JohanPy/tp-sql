---
layout: base.njk
title: "Exercice 2 : Calculs & Arrondis"
intitule: "TP 2 — Requêtes Simples, Calculs & Manipulation de Chaînes"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 2
titre: "Exercice 2 : Calculs & Arrondis"
permalink: "/tp2/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Calculs & Arrondis

Cet exercice permet de pratiquer les calculs arithmétiques dans la clause `SELECT`, l'attribution d'alias de colonnes (`AS`) et l'arrondi décimal (`ROUND`).

## Questions

**1. Calculer pour chaque produit le volume total d'unités**

À partir de la table `Produit`, affichez la référence (colonne `Refprod`), le nom (colonne `Nomprod`) et le volume total d'unités (somme des unités en stock et des unités commandées) sous l'alias `TotalUnites`.

<!-- expected-query: Q1
SELECT Refprod, Nomprod, (UnitesStock + UnitesCom) AS TotalUnites FROM Produit;
-->

**2. Décomposer la facturation pour les articles de la commande 10251**

À partir de la table `DetailCommande`, pour chaque article de la commande numéro 10251 (colonne `Nocom`), affichez :
- La référence du produit (colonne `Refprod`)
- Le montant brut avant remise, sous l'alias `MontantBrut`
- Le montant de la remise déduite en euros, arrondi à 2 décimales sous l'alias `MontantRemise`
- Le montant net final à payer, arrondi à 2 décimales sous l'alias `MontantNet`

<!-- expected-query: Q2
SELECT Refprod, (PrixUnit * Qte) AS MontantBrut, ROUND(PrixUnit * Qte * Remise, 2) AS MontantRemise, ROUND(PrixUnit * Qte * (1 - Remise), 2) AS MontantNet FROM DetailCommande WHERE Nocom = 10251;
-->

## Rappel de cours

### Opérateurs arithmétiques

Vous pouvez effectuer des calculs directement dans le `SELECT` :

- Addition : `+`
- Soustraction : `-`
- Multiplication : `*`
- Division : `/`

```sql
-- Calculer un prix total brut
SELECT PrixUnit * Qte FROM DetailCommande;
```

### Alias de colonnes

Pour renommer une colonne ou nommer le résultat d'un calcul, utilisez le mot-clé `AS` :

```sql
SELECT PrixUnit * Qte AS MontantTotal FROM DetailCommande;
```

### Arrondir un résultat numérique (`ROUND`)

La fonction `ROUND(expression, nb_decimales)` permet d'arrondir un résultat arithmétique :

```sql
-- Arrondir le montant net à 2 décimales
SELECT ROUND(PrixUnit * Qte * (1 - Remise), 2) AS MontantNet FROM DetailCommande;
```
