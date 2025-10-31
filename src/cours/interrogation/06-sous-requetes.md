---
layout: cours.njk
title: "Chapitre 6 : Les sous-requêtes"
category: interrogation
categoryTitle: "Interrogation de bases de données"
chapNum: 6
base: Comptoir2000.sqlite
permalink: "/cours/interrogation/chapitre-6/"
---

## Introduction

Une **sous-requête** (ou requête imbriquée) est une requête SQL placée à l'intérieur d'une autre requête. Les sous-requêtes permettent de résoudre des problèmes complexes en plusieurs étapes et d'écrire des requêtes plus modulaires.

Dans ce chapitre, vous allez découvrir :

- Les sous-requêtes dans le SELECT
- Les sous-requêtes dans le WHERE
- Les sous-requêtes dans le FROM
- Les opérateurs IN, EXISTS, ANY, ALL
- La différence entre sous-requêtes corrélées et non-corrélées

## Principe de base

Une sous-requête est une requête SELECT entourée de parenthèses :

```sql
SELECT colonne
FROM table
WHERE colonne operateur (SELECT colonne FROM autre_table);
```

La sous-requête s'exécute **en premier**, puis son résultat est utilisé par la requête principale.

## Sous-requêtes dans le WHERE

### Comparaison avec une valeur unique

Trouver les produits plus chers que la moyenne :

```sql
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit > (SELECT AVG(PrixUnit) FROM Produit)
ORDER BY PrixUnit DESC;
```

La sous-requête `(SELECT AVG(PrixUnit) FROM Produit)` calcule le prix moyen, puis la requête principale compare chaque prix à cette moyenne.

### Trouver un extremum

Afficher le produit le plus cher :

```sql
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit = (SELECT MAX(PrixUnit) FROM Produit);
```

## Opérateur IN - Liste de valeurs

`IN` teste si une valeur appartient à une liste retournée par une sous-requête.

### Exemple : Clients ayant passé des commandes

```sql
SELECT Societe, Ville
FROM Client
WHERE CodeCli IN (
    SELECT DISTINCT CodeCli 
    FROM Commande
)
ORDER BY Societe;
```

### Exemple : Produits jamais commandés

```sql
SELECT NomProd, RefProd
FROM Produit
WHERE RefProd NOT IN (
    SELECT DISTINCT RefProd 
    FROM DetailCommande
)
ORDER BY NomProd;
```

> **💡 À retenir** : `IN` est très utile pour filtrer sur une liste de valeurs provenant d'une autre table.

## Opérateur EXISTS

`EXISTS` teste si une sous-requête retourne **au moins une ligne**. Il retourne TRUE ou FALSE.

### Exemple : Clients ayant passé au moins une commande

```sql
SELECT Societe, Contact
FROM Client AS c
WHERE EXISTS (
    SELECT 1 
    FROM Commande AS cmd
    WHERE cmd.CodeCli = c.CodeCli
)
ORDER BY Societe;
```

### Exemple : Fournisseurs sans produit

```sql
SELECT Societe, Pays
FROM Fournisseur AS f
WHERE NOT EXISTS (
    SELECT 1 
    FROM Produit AS p
    WHERE p.NoFour = f.NoFour
);
```

> **💡 À retenir** : `EXISTS` est souvent plus performant que `IN` pour de grandes tables.

## Sous-requêtes corrélées vs non-corrélées

### Sous-requête non-corrélée

S'exécute **une seule fois** indépendamment de la requête principale :

```sql
-- Produits de la catégorie la plus représentée
SELECT NomProd, NoCateg
FROM Produit
WHERE NoCateg = (
    SELECT NoCateg
    FROM Produit
    GROUP BY NoCateg
    ORDER BY COUNT(*) DESC
    LIMIT 1
);
```

### Sous-requête corrélée

S'exécute **pour chaque ligne** de la requête principale, en faisant référence à ses colonnes :

```sql
-- Produits plus chers que la moyenne de leur catégorie
SELECT 
    p1.NomProd,
    p1.NoCateg,
    p1.PrixUnit
FROM Produit AS p1
WHERE p1.PrixUnit > (
    SELECT AVG(p2.PrixUnit)
    FROM Produit AS p2
    WHERE p2.NoCateg = p1.NoCateg
)
ORDER BY p1.NoCateg, p1.PrixUnit DESC;
```

## Sous-requêtes dans le SELECT

Vous pouvez utiliser une sous-requête pour calculer une colonne :

```sql
-- Clients avec leur nombre de commandes
SELECT 
    c.Societe,
    c.Ville,
    (
        SELECT COUNT(*)
        FROM Commande AS cmd
        WHERE cmd.CodeCli = c.CodeCli
    ) AS NombreCommandes
FROM Client AS c
ORDER BY NombreCommandes DESC;
```

### Attention aux performances

Les sous-requêtes corrélées dans le SELECT peuvent être lentes. Privilégiez une jointure avec GROUP BY quand possible :

```sql
-- Version plus performante avec JOIN
SELECT 
    c.Societe,
    c.Ville,
    COUNT(cmd.NoCom) AS NombreCommandes
FROM Client AS c
LEFT JOIN Commande AS cmd ON c.CodeCli = cmd.CodeCli
GROUP BY c.CodeCli, c.Societe, c.Ville
ORDER BY NombreCommandes DESC;
```

## Sous-requêtes dans le FROM

Une sous-requête peut servir de table temporaire :

```sql
-- Prix moyen par catégorie, avec seulement les catégories > 20€
SELECT 
    NoCateg,
    PrixMoyen
FROM (
    SELECT 
        NoCateg,
        AVG(PrixUnit) AS PrixMoyen
    FROM Produit
    GROUP BY NoCateg
) AS Moyennes
WHERE PrixMoyen > 20
ORDER BY PrixMoyen DESC;
```

> **Note** : En SQLite, vous devez donner un alias (AS Moyennes) à la sous-requête.

## Opérateurs ANY et ALL

### ANY - Au moins une valeur

```sql
-- Produits plus chers qu'AU MOINS UN produit de la catégorie 1
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit > ANY (
    SELECT PrixUnit 
    FROM Produit 
    WHERE NoCateg = 1
)
ORDER BY PrixUnit DESC;
```

Équivalent à :
```sql
WHERE PrixUnit > (SELECT MIN(PrixUnit) FROM Produit WHERE NoCateg = 1)
```

### ALL - Toutes les valeurs

```sql
-- Produits plus chers que TOUS les produits de la catégorie 1
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit > ALL (
    SELECT PrixUnit 
    FROM Produit 
    WHERE NoCateg = 1
)
ORDER BY PrixUnit DESC;
```

Équivalent à :
```sql
WHERE PrixUnit > (SELECT MAX(PrixUnit) FROM Produit WHERE NoCateg = 1)
```

> **⚠️ Note SQLite** : SQLite ne supporte pas ALL directement, utilisez MAX/MIN comme alternatives.

## Cas d'usage avancés

### Comparaison entre deux agrégations

```sql
-- Catégories avec un prix moyen supérieur au prix moyen global
SELECT 
    NoCateg,
    AVG(PrixUnit) AS PrixMoyenCateg
FROM Produit
GROUP BY NoCateg
HAVING AVG(PrixUnit) > (
    SELECT AVG(PrixUnit) FROM Produit
)
ORDER BY PrixMoyenCateg DESC;
```

### Top N par groupe

```sql
-- Les 3 produits les plus chers de chaque catégorie
SELECT 
    p1.NoCateg,
    p1.NomProd,
    p1.PrixUnit
FROM Produit AS p1
WHERE (
    SELECT COUNT(*)
    FROM Produit AS p2
    WHERE p2.NoCateg = p1.NoCateg 
      AND p2.PrixUnit > p1.PrixUnit
) < 3
ORDER BY p1.NoCateg, p1.PrixUnit DESC;
```

### Différence entre deux ensembles

```sql
-- Produits en stock mais jamais commandés
SELECT RefProd, NomProd, UniteStock
FROM Produit
WHERE UniteStock > 0
  AND RefProd NOT IN (
      SELECT DISTINCT RefProd 
      FROM DetailCommande
  )
ORDER BY UniteStock DESC;
```

## Jointures vs Sous-requêtes

Parfois, vous pouvez choisir entre une jointure et une sous-requête. Voici quelques critères :

**Utilisez une JOINTURE quand** :
- Vous avez besoin de colonnes des deux tables
- La performance est critique
- La requête est plus lisible avec JOIN

**Utilisez une SOUS-REQUÊTE quand** :
- Vous testez l'existence (EXISTS)
- Vous comparez à une agrégation
- La logique est plus claire en plusieurs étapes

## Bonnes pratiques

1. **Indentez** les sous-requêtes pour la lisibilité
2. **Commentez** les sous-requêtes complexes
3. **Testez les sous-requêtes séparément** avant de les imbriquer
4. **Limitez le nombre de niveaux** d'imbrication (max 2-3)
5. **Privilégiez JOIN** quand c'est plus performant
6. **Utilisez EXISTS** au lieu de IN pour de grandes tables

## Exercices pratiques

Testez ces requêtes :

1. Affichez les produits plus chers que le produit "Chai"
2. Trouvez les clients qui n'ont jamais passé de commande
3. Affichez les catégories dont le prix moyen est supérieur à 40€
4. Listez les employés qui ont traité plus de 50 commandes
5. Trouvez les 5 produits les plus commandés en quantité (utilisez une sous-requête)
6. Affichez les fournisseurs qui proposent au moins un produit à plus de 100€

## Conclusion du module

Félicitations ! Vous avez terminé le module **Interrogation de bases de données**. Vous maîtrisez maintenant :

- Les requêtes SELECT de base
- Le filtrage avec WHERE
- Le tri et la limitation
- Les agrégations avec GROUP BY
- Les jointures entre tables
- Les sous-requêtes avancées

**Prochaines étapes :**

- Pratiquez avec les TPs pour consolider vos connaissances
- Explorez le module **Création de bases de données** (à venir)
- Approfondissez avec les index, vues et transactions

**Liens utiles :**

- [TP4 - Exercice 1](/tp4/exercice1/) : Sous-requêtes simples
- [TP4 - Exercice 2](/tp4/exercice2/) : Sous-requêtes avec EXISTS
- [TP4 - Exercice 3](/tp4/exercice3/) : Sous-requêtes complexes

---

**Points clés du chapitre :**

- ✅ Les sous-requêtes permettent de résoudre des problèmes en plusieurs étapes
- ✅ `IN` teste l'appartenance à une liste
- ✅ `EXISTS` teste si une sous-requête retourne des lignes
- ✅ Les sous-requêtes corrélées référencent la requête principale
- ✅ Équilibrez lisibilité et performance entre JOIN et sous-requêtes
