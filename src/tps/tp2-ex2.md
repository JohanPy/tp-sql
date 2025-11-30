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

**2. Ajouter une colonne "Statut" pour les produits (disponible/indisponible)**

Affichez tous les produits avec leur nom et un statut "Disponible" ou "Indispo" selon le champ Indisponible.

**3. Catégoriser les commandes par montant total**

Pour chaque NoCom calculer le prix total et classer en 'Petit' (< 100), 'Moyen' (100-500), 'Gros' (> 500).

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
