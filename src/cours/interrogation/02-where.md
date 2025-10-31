---
layout: cours.njk
title: "Chapitre 2 : Filtrer avec WHERE"
category: interrogation
categoryTitle: "Interrogation de bases de données"
chapNum: 2
base: Comptoir2000.sqlite
permalink: "/cours/interrogation/chapitre-2/"
---

## Introduction

La clause `WHERE` permet de **filtrer les lignes** retournées par une requête `SELECT`. Au lieu de récupérer toutes les lignes d'une table, vous pouvez spécifier des conditions pour ne sélectionner que les lignes qui vous intéressent.

Dans ce chapitre, vous allez apprendre :

- Les opérateurs de comparaison
- Les opérateurs logiques (AND, OR, NOT)
- Les opérateurs spéciaux (BETWEEN, IN, LIKE, IS NULL)
- Comment combiner plusieurs conditions

## Syntaxe de base

```sql
SELECT colonnes
FROM table
WHERE condition;
```

La clause `WHERE` se place **après** `FROM` et **avant** toute autre clause (ORDER BY, LIMIT, etc.).

## Opérateurs de comparaison

SQLite supporte les opérateurs de comparaison classiques :

| Opérateur | Signification | Exemple |
|-----------|---------------|---------|
| `=` | Égal à | `Ville = 'Paris'` |
| `!=` ou `<>` | Différent de | `Pays != 'France'` |
| `<` | Inférieur à | `PrixUnit < 20` |
| `>` | Supérieur à | `UniteStock > 50` |
| `<=` | Inférieur ou égal | `PrixUnit <= 100` |
| `>=` | Supérieur ou égal | `UniteStock >= 10` |

### Exemples

```sql
-- Clients situés à Paris
SELECT Societe, Contact, Ville
FROM Client
WHERE Ville = 'Paris';
```

```sql
-- Produits dont le prix est supérieur à 50€
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit > 50;
```

```sql
-- Produits avec moins de 10 unités en stock
SELECT NomProd, UniteStock
FROM Produit
WHERE UniteStock < 10;
```

> **💡 À retenir** : Les chaînes de caractères doivent être entourées de guillemets simples `'...'` en SQL.

## Opérateurs logiques

Vous pouvez combiner plusieurs conditions avec les opérateurs logiques :

### AND - Toutes les conditions doivent être vraies

```sql
SELECT NomProd, PrixUnit, UniteStock
FROM Produit
WHERE PrixUnit > 20 AND UniteStock > 0;
```

Cette requête retourne les produits qui coûtent **plus de 20€ ET** qui sont **en stock**.

### OR - Au moins une condition doit être vraie

```sql
SELECT Societe, Ville, Pays
FROM Client
WHERE Ville = 'Paris' OR Ville = 'Lyon';
```

Cette requête retourne les clients situés **à Paris OU à Lyon**.

### NOT - Inverse une condition

```sql
SELECT NomProd, PrixUnit
FROM Produit
WHERE NOT (PrixUnit > 100);
```

Équivalent à :

```sql
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit <= 100;
```

### Combiner AND et OR

Utilisez des parenthèses pour clarifier la priorité :

```sql
SELECT NomProd, PrixUnit, UniteStock
FROM Produit
WHERE (PrixUnit > 50 OR UniteStock < 10) 
  AND NomProd LIKE '%Chocolat%';
```

> **💡 À retenir** : `AND` a une priorité plus élevée que `OR`. Utilisez des parenthèses pour éviter les ambiguïtés.

## Opérateur BETWEEN

`BETWEEN` permet de vérifier si une valeur est comprise dans un intervalle (bornes incluses) :

```sql
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit BETWEEN 10 AND 50;
```

Équivalent à :

```sql
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit >= 10 AND PrixUnit <= 50;
```

## Opérateur IN

`IN` permet de vérifier si une valeur appartient à une liste :

```sql
SELECT Societe, Ville, Pays
FROM Client
WHERE Pays IN ('France', 'Belgique', 'Suisse');
```

Équivalent à :

```sql
SELECT Societe, Ville, Pays
FROM Client
WHERE Pays = 'France' OR Pays = 'Belgique' OR Pays = 'Suisse';
```

Vous pouvez aussi utiliser `NOT IN` :

```sql
SELECT Societe, Pays
FROM Client
WHERE Pays NOT IN ('France', 'Allemagne');
```

## Opérateur LIKE - Recherche de motifs

`LIKE` permet de faire des recherches avec des motifs (patterns) :

- `%` : représente zéro ou plusieurs caractères
- `_` : représente exactement un caractère

### Exemples

```sql
-- Produits dont le nom commence par "Ch"
SELECT NomProd
FROM Produit
WHERE NomProd LIKE 'Ch%';
```

```sql
-- Produits dont le nom contient "café"
SELECT NomProd
FROM Produit
WHERE NomProd LIKE '%café%';
```

```sql
-- Produits dont le nom se termine par "s"
SELECT NomProd
FROM Produit
WHERE NomProd LIKE '%s';
```

```sql
-- Codes postaux de 5 caractères commençant par 75
SELECT Societe, CodePostal
FROM Client
WHERE CodePostal LIKE '75___';
```

> **💡 À retenir** : `LIKE` est sensible à la casse dans certaines bases de données, mais pas dans SQLite par défaut.

## Valeurs NULL

En SQL, `NULL` représente l'**absence de valeur**. Pour tester si une colonne est NULL :

```sql
-- Clients sans fax
SELECT Societe, Contact
FROM Client
WHERE Fax IS NULL;
```

```sql
-- Clients avec un numéro de fax
SELECT Societe, Contact, Fax
FROM Client
WHERE Fax IS NOT NULL;
```

⚠️ **Attention** : N'utilisez **jamais** `= NULL` ou `!= NULL`, cela ne fonctionne pas !

```sql
-- ❌ INCORRECT
WHERE Fax = NULL

-- ✅ CORRECT
WHERE Fax IS NULL
```

## Exercices pratiques

Testez ces requêtes dans la console :

1. Affichez les clients français (pays = 'France')
2. Affichez les produits dont le prix est entre 20 et 50 euros
3. Affichez les produits dont le nom contient "fromage" (insensible à la casse)
4. Affichez les clients de Paris, Lyon ou Marseille
5. Affichez les produits en rupture de stock (UniteStock = 0)
6. Affichez les employés dont le titre contient "Commercial"

## Pour aller plus loin

Maintenant que vous savez filtrer les données, le prochain chapitre vous apprendra à **trier et limiter** les résultats avec `ORDER BY` et `LIMIT`.

**Liens utiles :**

- [TP1 - Exercice 3](/tp1/exercice3/) : Filtres simples
- [TP2 - Exercice 1](/tp2/exercice1/) : Conditions complexes

---

**Points clés du chapitre :**

- ✅ `WHERE` filtre les lignes selon une condition
- ✅ Utilisez `AND`, `OR`, `NOT` pour combiner des conditions
- ✅ `BETWEEN` teste un intervalle (bornes incluses)
- ✅ `IN` teste l'appartenance à une liste
- ✅ `LIKE` permet des recherches avec `%` et `_`
- ✅ Utilisez `IS NULL` et `IS NOT NULL` pour tester NULL
