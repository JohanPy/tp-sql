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

## Questions

**1. Trier tous les produits par leur prix unitaire croissant**

À partir de la table `Produit`, affichez toutes les colonnes (`*`) triées du prix le moins cher au plus cher (colonne `PrixUnit`).

<!-- expected-query: Q1
SELECT * FROM Produit ORDER BY PrixUnit ASC;
-->

**2. Afficher toutes les informations des trois produits les plus chers**

À partir de la table `Produit`, affichez toutes les colonnes (`*`) pour les 3 produits ayant les prix unitaires les plus élevés (colonne `PrixUnit`).

<!-- expected-query: Q2
SELECT * FROM Produit ORDER BY PrixUnit DESC LIMIT 3;
-->

**3. Lister les informations des clients suisses, allemands et belges**

À partir de la table `Client`, affichez toutes les colonnes (`*`) pour les clients dont le pays (colonne `Pays`) est la Suisse, l'Allemagne ou la Belgique.

<!-- expected-query: Q3
SELECT * FROM Client WHERE Pays IN ('Suisse', 'Allemagne', 'Belgique');
-->

**4. Rechercher les sociétés clientes dont la raison sociale contient "restaurant"**

À partir de la table `Client`, affichez uniquement le nom de la société (colonne `Societe`) pour les clients dont la raison sociale contient le mot "restaurant".

<!-- expected-query: Q4
SELECT Societe FROM Client WHERE Societe LIKE '%restaurant%';
-->

**5. Lister sans doublon les pays d'implantation des clients**

À partir de la table `Client`, affichez la liste des pays (colonne `Pays`) sans aucun doublon.

<!-- expected-query: Q5
SELECT DISTINCT Pays FROM Client;
-->

**6. Lister sans doublon les couples pays et villes avec un double tri alphabétique**

À partir de la table `Client`, affichez les colonnes `Pays` et `Ville` sans doublon, triées par ordre alphabétique sur le pays, puis sur la ville.

<!-- expected-query: Q6
SELECT DISTINCT Pays, Ville FROM Client ORDER BY Pays, Ville;
-->

**7. Rechercher les produits vendus en bouteilles ou en canettes**

À partir de la table `Produit`, sélectionnez toutes les colonnes (`*`) pour les produits dont l'unité de vente (colonne `QteParUnit`) contient le mot "bouteille" ou le mot "canette".

<!-- expected-query: Q7
SELECT * FROM Produit WHERE QteParUnit LIKE '%bouteille%' OR QteParUnit LIKE '%canette%';
-->

**8. Afficher en majuscules le nom et la référence des produits du fournisseur n° 8 de prix modéré**

À partir de la table `Produit`, affichez le nom du produit (colonne `Nomprod`) et sa référence (colonne `Refprod`) tous deux convertis en majuscules, pour les produits du fournisseur n° 8 (colonne `NoFour`) dont le prix unitaire (colonne `PrixUnit`) est compris entre 10 et 100 € inclus.

<!-- expected-query: Q8
SELECT UPPER(Nomprod), UPPER(Refprod) FROM Produit WHERE NoFour = 8 AND PrixUnit BETWEEN 10 AND 100;
-->

**9. Lister sans doublon les employés ayant traité des commandes livrées à Lille, Lyon ou Nantes**

À partir de la table `Commande`, affichez la liste sans doublon des identifiants d'employés (colonne `NoEmp`) ayant enregistré au moins une commande à destination de Lille, Lyon ou Nantes (colonne `VilleLiv`).

<!-- expected-query: Q9
SELECT DISTINCT NoEmp FROM Commande WHERE VilleLiv IN ('Lille', 'Lyon', 'Nantes');
-->

**10. Filtrer les produits par mot-clé et par prix**

À partir de la table `Produit`, affichez le nom (colonne `Nomprod`) et le prix unitaire (colonne `PrixUnit`) des produits dont le nom contient "tofu" ou "choco", et dont le prix unitaire est strictement inférieur à 100 €.

<details>
<summary>💡 Indice</summary>

Attention à la priorité des opérateurs ! Pensez à utiliser des parenthèses pour regrouper vos conditions logiques.
</details>

<!-- expected-query: Q10
SELECT Nomprod, PrixUnit FROM Produit WHERE (Nomprod LIKE '%tofu%' OR Nomprod LIKE '%choco%') AND PrixUnit < 100;
-->

## Rappel de cours

### Sélection et Tri

```sql
-- Sélectionner toutes les colonnes
SELECT * FROM Table;
```

```sql
-- Sélectionner des colonnes spécifiques
SELECT Colonne1, Colonne2 FROM Table;
```

```sql
-- Trier les résultats (ASC pour croissant, DESC pour décroissant)
SELECT * FROM Table ORDER BY Colonne1 ASC;
```

### Filtrage

```sql
-- Filtrer avec une condition simple
SELECT * FROM Table WHERE Colonne1 = 'Valeur';
```

```sql
-- Filtrer avec plusieurs valeurs (IN)
SELECT * FROM Table WHERE Colonne1 IN ('Val1', 'Val2');
```

```sql
-- Recherche partielle (LIKE)
-- % remplace n'importe quelle suite de caractères
SELECT * FROM Table WHERE Colonne1 LIKE '%texte%';
```

```sql
-- Conditions multiples (AND / OR)
SELECT * FROM Table WHERE Colonne1 = 'A' AND Colonne2 > 10;
```

### Autres fonctions

```sql
-- Supprimer les doublons
SELECT DISTINCT Colonne1 FROM Table;
```

```sql
-- Limiter le nombre de résultats
SELECT * FROM Table LIMIT 5;
```

```sql
-- Convertir en majuscules
SELECT UPPER(Colonne1) FROM Table;
```
