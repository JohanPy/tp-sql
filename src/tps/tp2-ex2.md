---
layout: base.njk
title: "Exercice 2 : Choix multiple (CASE)"
intitule: "TP 2 - Agrégats et Choix multiple"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 2
titre: "Exercice 2 : Choix multiple (CASE)"
permalink: "/tp2/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Choix multiple (CASE)

## Questions

**1. Classer les produits par gamme de prix**

Affichez tous les produits avec une colonne "Gamme" affichant "Économique" (< 50), "Standard" (50-200), ou "Premium" (> 200).

<!-- expected-query: Q1
SELECT Refprod, Nomprod, PrixUnit, CASE WHEN PrixUnit < 50 THEN 'Économique' WHEN PrixUnit BETWEEN 50 AND 200 THEN 'Standard' ELSE 'Premium' END AS Gamme FROM Produit;
-->

**2. Ajouter une colonne "Statut" pour les produits (disponible/indisponible)**

Affichez tous les produits avec leur nom et un statut "Disponible" ou "Indispo" selon le champ Indisponible.

<!-- expected-query: Q2
SELECT Refprod, Nomprod, CASE WHEN Indisponible = 1 THEN 'Indispo' ELSE 'Disponible' END AS Statut FROM Produit;
-->

**3. Catégoriser les commandes par montant total**

Pour chaque NoCom calculer le prix total et classer en 'Petit' (< 100), 'Moyen' (100-500), 'Gros' (> 500).

<!-- expected-query: Q3
SELECT Nocom, ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS MontantTotal, CASE WHEN SUM(PrixUnit * Qte * (1 - Remise)) < 100 THEN 'Petit' WHEN SUM(PrixUnit * Qte * (1 - Remise)) BETWEEN 100 AND 500 THEN 'Moyen' ELSE 'Gros' END AS CategorieCommande FROM DetailCommande GROUP BY Nocom;
-->

## Rappel de cours

### Expression CASE

L'expression `CASE` permet d'ajouter de la logique conditionnelle dans vos requêtes (comme un IF/ELSE).

```sql
-- Créer une colonne personnalisée selon une condition
SELECT NomProd, PrixUnit,
    CASE
        WHEN PrixUnit < 10 THEN 'Pas cher'
        WHEN PrixUnit BETWEEN 10 AND 50 THEN 'Moyen'
        ELSE 'Cher'
    END AS CategoriePrix
FROM Produit;
```
