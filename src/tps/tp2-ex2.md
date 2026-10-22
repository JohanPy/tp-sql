---
layout: base.njk
title: "Exercice 2 : Calculs"
intitule: "TP 2 — Requêtes Simples, Calculs & Manipulation de Chaînes"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 2
titre: "Exercice 2 : Calculs"
permalink: "/tp2/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Calculs

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
- Le montant de la remise déduite en euros, sous l'alias `MontantRemise`
- Le montant net final à payer, sous l'alias `MontantNet`

<!-- expected-query: Q2
SELECT Refprod, (PrixUnit * Qte) AS MontantBrut, (PrixUnit * Qte * Remise) AS MontantRemise, (PrixUnit * Qte * (1 - Remise)) AS MontantNet FROM DetailCommande WHERE Nocom = 10251;
-->

## Rappel de cours

### Opérateurs arithmétiques

Vous pouvez effectuer des calculs directement dans le SELECT :

- Addition : `+`
- Soustraction : `-`
- Multiplication : `*`
- Division : `/`

```sql
-- Calculer un prix total
SELECT PrixUnit * Qte FROM DetailCommande;
```

### Alias de colonnes

Pour renommer une colonne ou le résultat d'un calcul, utilisez `AS`.

```sql
-- Renommer une colonne dans le résultat
SELECT PrixUnit * Qte AS MontantTotal FROM DetailCommande;
```


