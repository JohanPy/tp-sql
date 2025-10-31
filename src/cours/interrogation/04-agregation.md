---
layout: cours.njk
title: "Chapitre 4 : Fonctions d'agrégation"
category: interrogation
categoryTitle: "Interrogation de bases de données"
chapNum: 4
base: Comptoir2000.sqlite
permalink: "/cours/interrogation/chapitre-4/"
---

## Introduction

Les **fonctions d'agrégation** permettent d'effectuer des calculs sur un ensemble de lignes et de retourner une valeur unique. Elles sont essentielles pour produire des statistiques et des rapports.

Dans ce chapitre, vous allez découvrir :

- Les fonctions COUNT, SUM, AVG, MIN, MAX
- La clause GROUP BY pour grouper les résultats
- La clause HAVING pour filtrer les groupes
- La différence entre WHERE et HAVING

## Les fonctions d'agrégation principales

### COUNT() - Compter les lignes

```sql
-- Compter le nombre total de clients
SELECT COUNT(*) AS NombreClients
FROM Client;
```

```sql
-- Compter les clients qui ont un fax
SELECT COUNT(Fax) AS ClientsAvecFax
FROM Client;
```

> **💡 À retenir** : `COUNT(*)` compte toutes les lignes, `COUNT(colonne)` ne compte que les valeurs non-NULL.

### SUM() - Somme

```sql
-- Valeur totale du stock
SELECT SUM(PrixUnit * UniteStock) AS ValeurTotaleStock
FROM Produit;
```

### AVG() - Moyenne

```sql
-- Prix moyen des produits
SELECT AVG(PrixUnit) AS PrixMoyen
FROM Produit;
```

```sql
-- Prix moyen arrondi à 2 décimales
SELECT ROUND(AVG(PrixUnit), 2) AS PrixMoyen
FROM Produit;
```

### MIN() et MAX() - Minimum et Maximum

```sql
-- Produit le moins cher et le plus cher
SELECT 
    MIN(PrixUnit) AS PrixMin,
    MAX(PrixUnit) AS PrixMax
FROM Produit;
```

### Combiner plusieurs fonctions

```sql
SELECT 
    COUNT(*) AS NombreProduits,
    AVG(PrixUnit) AS PrixMoyen,
    MIN(PrixUnit) AS PrixMin,
    MAX(PrixUnit) AS PrixMax,
    SUM(UniteStock) AS StockTotal
FROM Produit;
```

## GROUP BY - Regrouper les résultats

`GROUP BY` permet de regrouper les lignes qui ont la même valeur dans une ou plusieurs colonnes, puis d'appliquer des fonctions d'agrégation sur chaque groupe.

### Syntaxe

```sql
SELECT colonne, fonction_agregation(colonne)
FROM table
GROUP BY colonne;
```

### Exemples de regroupement

```sql
-- Nombre de clients par pays
SELECT Pays, COUNT(*) AS NombreClients
FROM Client
GROUP BY Pays;
```

```sql
-- Nombre de produits par catégorie
SELECT NoCateg, COUNT(*) AS NombreProduits
FROM Produit
GROUP BY NoCateg;
```

```sql
-- Prix moyen par catégorie
SELECT 
    NoCateg,
    COUNT(*) AS NombreProduits,
    ROUND(AVG(PrixUnit), 2) AS PrixMoyen
FROM Produit
GROUP BY NoCateg
ORDER BY PrixMoyen DESC;
```

## Grouper sur plusieurs colonnes

```sql
-- Nombre de clients par pays et par ville
SELECT 
    Pays,
    Ville,
    COUNT(*) AS NombreClients
FROM Client
GROUP BY Pays, Ville
ORDER BY Pays, NombreClients DESC;
```

## HAVING - Filtrer les groupes

`WHERE` filtre les lignes **avant** le regroupement.  
`HAVING` filtre les groupes **après** l'agrégation.

### WHERE vs HAVING

```sql
-- WHERE : filtre les lignes AVANT le regroupement
SELECT Pays, COUNT(*) AS NombreClients
FROM Client
WHERE Pays != 'France'
GROUP BY Pays;
```

```sql
-- HAVING : filtre les groupes APRÈS l'agrégation
SELECT Pays, COUNT(*) AS NombreClients
FROM Client
GROUP BY Pays
HAVING COUNT(*) > 5;
```

### Combiner WHERE et HAVING

```sql
-- Pays (hors France) ayant plus de 3 clients
SELECT Pays, COUNT(*) AS NombreClients
FROM Client
WHERE Pays != 'France'
GROUP BY Pays
HAVING COUNT(*) > 3
ORDER BY NombreClients DESC;
```

> **💡 À retenir** : 
> - `WHERE` : condition sur les **lignes individuelles**
> - `HAVING` : condition sur les **groupes agrégés**

## Exemples pratiques avancés

### Catégories avec plus de 10 produits

```sql
SELECT 
    NoCateg,
    COUNT(*) AS NombreProduits,
    ROUND(AVG(PrixUnit), 2) AS PrixMoyen
FROM Produit
GROUP BY NoCateg
HAVING COUNT(*) > 10
ORDER BY NombreProduits DESC;
```

### Stock total par fournisseur

```sql
SELECT 
    NoFour,
    COUNT(*) AS NombreProduits,
    SUM(UniteStock) AS StockTotal
FROM Produit
GROUP BY NoFour
HAVING SUM(UniteStock) > 100
ORDER BY StockTotal DESC;
```

### Villes avec au moins 2 clients

```sql
SELECT 
    Ville,
    Pays,
    COUNT(*) AS NombreClients
FROM Client
GROUP BY Ville, Pays
HAVING COUNT(*) >= 2
ORDER BY NombreClients DESC;
```

## DISTINCT - Éliminer les doublons

`DISTINCT` élimine les lignes en double dans les résultats :

```sql
-- Liste des pays (sans doublon)
SELECT DISTINCT Pays
FROM Client
ORDER BY Pays;
```

```sql
-- Nombre de pays différents
SELECT COUNT(DISTINCT Pays) AS NombrePays
FROM Client;
```

## Ordre d'exécution d'une requête SQL

Comprendre l'ordre d'exécution aide à éviter les erreurs :

1. `FROM` : Sélection de la table
2. `WHERE` : Filtrage des lignes
3. `GROUP BY` : Regroupement
4. `HAVING` : Filtrage des groupes
5. `SELECT` : Sélection des colonnes
6. `ORDER BY` : Tri
7. `LIMIT` : Limitation

C'est pourquoi vous **ne pouvez pas** utiliser un alias du SELECT dans WHERE, mais vous pouvez l'utiliser dans ORDER BY.

## Exercices pratiques

Testez ces requêtes :

1. Comptez le nombre total de produits
2. Calculez le prix moyen de tous les produits
3. Trouvez le produit le plus cher et le moins cher
4. Comptez le nombre de produits par catégorie
5. Affichez les catégories ayant un prix moyen supérieur à 30€
6. Trouvez les villes françaises ayant au moins 2 clients
7. Comptez le nombre de pays distincts dans la table Client

## Pour aller plus loin

Les agrégations sont souvent utilisées avec les **jointures**, que vous découvrirez dans le prochain chapitre. Vous apprendrez à combiner plusieurs tables pour créer des rapports plus complexes.

**Liens utiles :**

- [TP2 - Exercice 3](/tp2/exercice3/) : Agrégations simples
- [TP2 - Exercice 4](/tp2/exercice4/) : GROUP BY et HAVING

---

**Points clés du chapitre :**

- ✅ COUNT, SUM, AVG, MIN, MAX sont les fonctions d'agrégation principales
- ✅ `GROUP BY` regroupe les lignes ayant les mêmes valeurs
- ✅ `HAVING` filtre les groupes après agrégation
- ✅ `WHERE` filtre avant, `HAVING` filtre après
- ✅ `DISTINCT` élimine les doublons
