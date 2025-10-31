---
layout: cours.njk
title: "Chapitre 3 : Trier et limiter les résultats"
category: interrogation
categoryTitle: "Interrogation de bases de données"
chapNum: 3
base: Comptoir2000.sqlite
permalink: "/cours/interrogation/chapitre-3/"
---

## Introduction

Par défaut, les résultats d'une requête SQL ne sont pas triés dans un ordre particulier. Les clauses `ORDER BY` et `LIMIT` vous permettent de :

- **Trier** les résultats selon une ou plusieurs colonnes
- **Limiter** le nombre de lignes retournées
- Créer des requêtes pour afficher le "top N" des résultats

Dans ce chapitre, vous allez découvrir :

- Comment trier par ordre croissant ou décroissant
- Comment trier sur plusieurs colonnes
- Comment limiter le nombre de résultats
- Comment combiner tri et limite

## ORDER BY - Trier les résultats

### Syntaxe de base

```sql
SELECT colonnes
FROM table
WHERE condition
ORDER BY colonne;
```

Par défaut, le tri est **ascendant** (croissant) : du plus petit au plus grand, de A à Z.

### Exemple : Trier les produits par prix

```sql
SELECT NomProd, PrixUnit
FROM Produit
ORDER BY PrixUnit;
```

Cette requête affiche les produits du moins cher au plus cher.

## Ordre croissant (ASC) et décroissant (DESC)

Vous pouvez spécifier explicitement le sens du tri :

- `ASC` : Ascendant (du plus petit au plus grand) - **par défaut**
- `DESC` : Descendant (du plus grand au plus petit)

### Exemples

```sql
-- Produits du moins cher au plus cher (ASC est optionnel)
SELECT NomProd, PrixUnit
FROM Produit
ORDER BY PrixUnit ASC;
```

```sql
-- Produits du plus cher au moins cher
SELECT NomProd, PrixUnit
FROM Produit
ORDER BY PrixUnit DESC;
```

```sql
-- Clients par ordre alphabétique inverse
SELECT Societe, Ville
FROM Client
ORDER BY Societe DESC;
```

> **💡 À retenir** : `ASC` est le comportement par défaut, vous pouvez l'omettre. `DESC` doit toujours être spécifié.

## Trier sur plusieurs colonnes

Vous pouvez trier sur plusieurs colonnes en les séparant par des virgules. Le tri se fait en priorité sur la première colonne, puis sur la seconde en cas d'égalité, etc.

```sql
SELECT Societe, Ville, Pays
FROM Client
ORDER BY Pays, Ville;
```

Cette requête trie d'abord par pays (A-Z), puis par ville (A-Z) dans chaque pays.

### Combiner ASC et DESC

Chaque colonne peut avoir son propre ordre de tri :

```sql
SELECT NomProd, NoCateg, PrixUnit
FROM Produit
ORDER BY NoCateg ASC, PrixUnit DESC;
```

Cette requête :
1. Trie d'abord par catégorie (ordre croissant)
2. Dans chaque catégorie, trie par prix (ordre décroissant)

## Trier avec des expressions

Vous pouvez trier sur le résultat d'un calcul :

```sql
SELECT 
    NomProd,
    PrixUnit,
    UniteStock,
    (PrixUnit * UniteStock) AS ValeurStock
FROM Produit
ORDER BY (PrixUnit * UniteStock) DESC;
```

Cette requête trie les produits par valeur totale du stock (décroissant).

## LIMIT - Limiter le nombre de résultats

La clause `LIMIT` permet de restreindre le nombre de lignes retournées.

### Syntaxe

```sql
SELECT colonnes
FROM table
ORDER BY colonne
LIMIT nombre;
```

> **⚠️ Note** : `LIMIT` se place **après** `ORDER BY`.

### Exemples

```sql
-- Les 10 premiers clients par ordre alphabétique
SELECT Societe, Ville
FROM Client
ORDER BY Societe
LIMIT 10;
```

```sql
-- Les 5 produits les plus chers
SELECT NomProd, PrixUnit
FROM Produit
ORDER BY PrixUnit DESC
LIMIT 5;
```

```sql
-- Les 3 produits avec le plus de stock
SELECT NomProd, UniteStock
FROM Produit
ORDER BY UniteStock DESC
LIMIT 3;
```

## OFFSET - Paginer les résultats

`OFFSET` permet de sauter un certain nombre de lignes. Combiné avec `LIMIT`, cela permet de créer une pagination.

### Syntaxe

```sql
SELECT colonnes
FROM table
ORDER BY colonne
LIMIT nombre OFFSET decalage;
```

### Exemples de pagination

```sql
-- Page 1 : les 10 premiers produits
SELECT NomProd, PrixUnit
FROM Produit
ORDER BY NomProd
LIMIT 10 OFFSET 0;
```

```sql
-- Page 2 : produits 11 à 20
SELECT NomProd, PrixUnit
FROM Produit
ORDER BY NomProd
LIMIT 10 OFFSET 10;
```

```sql
-- Page 3 : produits 21 à 30
SELECT NomProd, PrixUnit
FROM Produit
ORDER BY NomProd
LIMIT 10 OFFSET 20;
```

**Formule pour la pagination** :
```
OFFSET = (numero_page - 1) × nombre_par_page
```

## Combiner WHERE, ORDER BY et LIMIT

Vous pouvez combiner toutes ces clauses. L'ordre d'exécution est :

1. `FROM` : Table source
2. `WHERE` : Filtrage des lignes
3. `ORDER BY` : Tri des résultats
4. `LIMIT` : Limitation du nombre de lignes

### Exemple complet

```sql
-- Les 5 produits français les plus chers en stock
SELECT 
    NomProd,
    PrixUnit,
    UniteStock
FROM Produit
WHERE UniteStock > 0 
  AND NoFour IN (
    SELECT NoFour FROM Fournisseur WHERE Pays = 'France'
  )
ORDER BY PrixUnit DESC
LIMIT 5;
```

## Cas d'usage pratiques

### Top 10 des clients par ville

```sql
SELECT Ville, COUNT(*) AS NbClients
FROM Client
GROUP BY Ville
ORDER BY NbClients DESC
LIMIT 10;
```

### Produits en rupture de stock

```sql
SELECT NomProd, UniteStock
FROM Produit
WHERE UniteStock = 0
ORDER BY NomProd;
```

### Dernier client ajouté

```sql
SELECT Societe, Contact, CodeCli
FROM Client
ORDER BY CodeCli DESC
LIMIT 1;
```

## Exercices pratiques

Testez ces requêtes :

1. Affichez tous les clients triés par ville
2. Affichez les 10 produits les moins chers
3. Affichez les 5 clients français triés par code postal (décroissant)
4. Affichez les produits de la catégorie 1, triés par prix décroissant
5. Créez une requête de pagination : produits 6 à 10 (page 2, 5 par page)

## Pour aller plus loin

Vous savez maintenant sélectionner, filtrer, trier et limiter vos résultats. Le prochain chapitre vous apprendra à effectuer des **calculs statistiques** avec les fonctions d'agrégation (COUNT, SUM, AVG, etc.).

**Liens utiles :**

- [TP1 - Exercice 4](/tp1/exercice4/) : Tri et limite
- [TP2 - Exercice 2](/tp2/exercice2/) : Top N

---

**Points clés du chapitre :**

- ✅ `ORDER BY` trie les résultats (ASC par défaut, DESC pour inverser)
- ✅ On peut trier sur plusieurs colonnes
- ✅ `LIMIT` restreint le nombre de lignes
- ✅ `OFFSET` permet de paginer les résultats
- ✅ Ordre : FROM → WHERE → ORDER BY → LIMIT
