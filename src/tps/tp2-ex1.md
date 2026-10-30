---
layout: base.njk
title: "Exercice 1 : Fonctions basiques"
intitule: "TP 2 — Requêtes Simples, Calculs & Manipulation de Chaînes"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 1
titre: "Exercice 1 : Fonctions basiques"
permalink: "/tp2/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Fonctions basiques

Cet exercice permet de pratiquer rapidement les clauses de base déjà abordées en cours et TD (projection, tri, pagination, filtres simples et logique booléenne). Ne vous y attardez pas : l'objectif est de valider les automatismes pour passer aux exercices de synthèse.

## Questions

**1. Trier tous les produits par leur prix et afficher les 3 plus chers**

À partir de la table `Produit`, affichez toutes les colonnes (`*`) pour les 3 produits ayant les prix unitaires les plus élevés (colonne `PrixUnit`), triés par prix décroissant.

<!-- expected-query: Q1
SELECT * FROM Produit ORDER BY PrixUnit DESC LIMIT 3;
-->

**2. Lister sans doublon les pays et villes des clients suisses, allemands et belges**

À partir de la table `Client`, affichez les colonnes `Pays` et `Ville` sans doublon pour les clients dont le pays (colonne `Pays`) est la Suisse, l'Allemagne ou la Belgique, triées par ordre alphabétique sur le pays, puis sur la ville.

<!-- expected-query: Q2
SELECT DISTINCT Pays, Ville FROM Client WHERE Pays IN ('Suisse', 'Allemagne', 'Belgique') ORDER BY Pays, Ville;
-->

**3. Rechercher les sociétés clientes dont la raison sociale contient "restaurant"**

À partir de la table `Client`, affichez uniquement le nom de la société (colonne `Societe`) pour les clients dont la raison sociale contient le mot "restaurant".

<!-- expected-query: Q3
SELECT Societe FROM Client WHERE Societe LIKE '%restaurant%';
-->

**4. Filtrer les produits d'un fournisseur selon une fourchette de prix**

À partir de la table `Produit`, affichez le nom du produit (colonne `Nomprod`), sa référence (colonne `Refprod`) et son prix unitaire (colonne `PrixUnit`), pour les produits du fournisseur n° 8 (colonne `NoFour`) dont le prix unitaire est compris entre 10 et 100 € inclus.

<!-- expected-query: Q4
SELECT Nomprod, Refprod, PrixUnit FROM Produit WHERE NoFour = 8 AND PrixUnit BETWEEN 10 AND 100;
-->

**5. Combiner des critères avec priorité logique (parenthèses)**

À partir de la table `Produit`, affichez le nom (colonne `Nomprod`) et le prix unitaire (colonne `PrixUnit`) des produits dont le nom contient "tofu" ou "choco", et dont le prix unitaire est strictement inférieur à 100 €.

<details>
<summary>💡 Indice</summary>

Attention à la priorité des opérateurs ! Pensez à utiliser des parenthèses pour regrouper vos conditions logiques `OR`.
</details>

<!-- expected-query: Q5
SELECT Nomprod, PrixUnit FROM Produit WHERE (Nomprod LIKE '%tofu%' OR Nomprod LIKE '%choco%') AND PrixUnit < 100;
-->

## Rappel de cours

### Sélection, Tri et Limitation

```sql
-- Sélectionner toutes les colonnes
SELECT * FROM Table;

-- Sélectionner des colonnes spécifiques
SELECT Colonne1, Colonne2 FROM Table;

-- Trier les résultats (ASC pour croissant, DESC pour décroissant) et limiter
SELECT * FROM Table ORDER BY Colonne1 DESC LIMIT 3;

-- Supprimer les doublons
SELECT DISTINCT Colonne1, Colonne2 FROM Table;
```

### Filtrage

```sql
-- Filtrer avec une condition simple
SELECT * FROM Table WHERE Colonne1 = 'Valeur';

-- Filtrer avec une liste de valeurs (IN)
SELECT * FROM Table WHERE Colonne1 IN ('Val1', 'Val2');

-- Intervalle inclus (BETWEEN)
SELECT * FROM Table WHERE Colonne1 BETWEEN 10 AND 100;

-- Recherche partielle (LIKE avec le joker %)
SELECT * FROM Table WHERE Colonne1 LIKE '%texte%';

-- Conditions combinées (AND / OR) avec parenthèses
SELECT * FROM Table WHERE (Colonne1 = 'A' OR Colonne1 = 'B') AND Colonne2 < 50;
```
