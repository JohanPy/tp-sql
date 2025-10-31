---
layout: cours.njk
title: "Chapitre 5 : Les jointures"
category: interrogation
categoryTitle: "Interrogation de bases de données"
chapNum: 5
base: Comptoir2000.sqlite
permalink: "/cours/interrogation/chapitre-5/"
---

## Introduction

Les **jointures** (ou JOIN) permettent de combiner des données provenant de plusieurs tables liées entre elles par des clés étrangères. C'est l'un des concepts les plus puissants du SQL relationnel.

Dans ce chapitre, vous allez découvrir :

- Le principe des jointures et les relations entre tables
- INNER JOIN : jointure interne
- LEFT JOIN : jointure externe gauche
- RIGHT JOIN et FULL OUTER JOIN
- Les jointures multiples
- Comment éviter les ambiguïtés avec les alias de tables

## Pourquoi les jointures ?

Dans une base de données relationnelle, les informations sont réparties dans plusieurs tables pour éviter la redondance. Les jointures permettent de reconstituer ces informations.

**Exemple** : La table `Produit` contient `NoFour` (numéro du fournisseur), mais le nom du fournisseur est stocké dans la table `Fournisseur`.

## Syntaxe de base

```sql
SELECT colonnes
FROM table1
JOIN table2 ON table1.cle = table2.cle;
```

## INNER JOIN - Jointure interne

L'`INNER JOIN` retourne uniquement les lignes qui ont une correspondance dans les deux tables.

### Exemple : Produits avec leurs fournisseurs

```sql
SELECT 
    Produit.NomProd,
    Produit.PrixUnit,
    Fournisseur.Societe AS NomFournisseur
FROM Produit
INNER JOIN Fournisseur ON Produit.NoFour = Fournisseur.NoFour;
```

Cette requête affiche chaque produit avec le nom de son fournisseur.

## Alias de tables

Pour simplifier l'écriture, on utilise des **alias** pour les noms de tables :

```sql
SELECT 
    p.NomProd,
    p.PrixUnit,
    f.Societe AS NomFournisseur,
    f.Pays
FROM Produit AS p
INNER JOIN Fournisseur AS f ON p.NoFour = f.NoFour;
```

> **💡 À retenir** : Les alias de tables sont particulièrement utiles pour les requêtes complexes avec plusieurs jointures.

## LEFT JOIN - Jointure externe gauche

Le `LEFT JOIN` retourne **toutes les lignes de la table de gauche**, même si elles n'ont pas de correspondance dans la table de droite. Les colonnes de la table de droite seront NULL s'il n'y a pas de correspondance.

### Exemple : Tous les produits, avec ou sans fournisseur

```sql
SELECT 
    p.NomProd,
    p.PrixUnit,
    f.Societe AS NomFournisseur
FROM Produit AS p
LEFT JOIN Fournisseur AS f ON p.NoFour = f.NoFour;
```

Si un produit n'a pas de fournisseur (NoFour = NULL), il apparaîtra quand même avec `NomFournisseur = NULL`.

### Cas d'usage : Trouver les orphelins

```sql
-- Produits sans fournisseur
SELECT 
    p.NomProd,
    p.NoFour
FROM Produit AS p
LEFT JOIN Fournisseur AS f ON p.NoFour = f.NoFour
WHERE f.NoFour IS NULL;
```

## RIGHT JOIN et FULL OUTER JOIN

> **⚠️ Note SQLite** : SQLite ne supporte pas nativement `RIGHT JOIN` ni `FULL OUTER JOIN`, mais vous pouvez les simuler avec `LEFT JOIN` en inversant l'ordre des tables.

**RIGHT JOIN** : Toutes les lignes de la table de droite

```sql
-- Équivalent d'un RIGHT JOIN en SQLite
SELECT 
    p.NomProd,
    f.Societe
FROM Fournisseur AS f
LEFT JOIN Produit AS p ON f.NoFour = p.NoFour;
```

**FULL OUTER JOIN** : Toutes les lignes des deux tables

```sql
-- Simuler un FULL OUTER JOIN avec UNION
SELECT p.NomProd, f.Societe
FROM Produit AS p
LEFT JOIN Fournisseur AS f ON p.NoFour = f.NoFour
UNION
SELECT p.NomProd, f.Societe
FROM Fournisseur AS f
LEFT JOIN Produit AS p ON f.NoFour = p.NoFour;
```

## Jointures multiples

Vous pouvez chaîner plusieurs jointures pour combiner plus de deux tables.

### Exemple : Produits avec catégorie et fournisseur

```sql
SELECT 
    p.NomProd,
    c.NomCateg,
    f.Societe AS Fournisseur,
    p.PrixUnit
FROM Produit AS p
INNER JOIN Categorie AS c ON p.NoCateg = c.NoCateg
INNER JOIN Fournisseur AS f ON p.NoFour = f.NoFour
ORDER BY c.NomCateg, p.NomProd;
```

### Exemple : Commandes avec détails

```sql
SELECT 
    cmd.NoCom,
    cmd.DateCom,
    cli.Societe AS Client,
    p.NomProd,
    dc.Quantite,
    dc.PrixUnit
FROM Commande AS cmd
INNER JOIN Client AS cli ON cmd.CodeCli = cli.CodeCli
INNER JOIN DetailCommande AS dc ON cmd.NoCom = dc.NoCom
INNER JOIN Produit AS p ON dc.RefProd = p.RefProd
WHERE cmd.NoCom = 10248;
```

## Types de relations

### Relation 1:N (un à plusieurs)

Un fournisseur peut avoir plusieurs produits :

```sql
-- Fournisseurs avec le nombre de produits
SELECT 
    f.Societe,
    COUNT(p.RefProd) AS NombreProduits
FROM Fournisseur AS f
LEFT JOIN Produit AS p ON f.NoFour = p.NoFour
GROUP BY f.NoFour, f.Societe
ORDER BY NombreProduits DESC;
```

### Relation N:M (plusieurs à plusieurs)

Une commande peut contenir plusieurs produits, et un produit peut être dans plusieurs commandes. La table `DetailCommande` est une **table de liaison**.

```sql
-- Produits les plus commandés
SELECT 
    p.NomProd,
    COUNT(dc.NoCom) AS NombreCommandes,
    SUM(dc.Quantite) AS QuantiteTotale
FROM Produit AS p
INNER JOIN DetailCommande AS dc ON p.RefProd = dc.RefProd
GROUP BY p.RefProd, p.NomProd
ORDER BY QuantiteTotale DESC
LIMIT 10;
```

## Filtrer les résultats d'une jointure

Vous pouvez combiner WHERE avec les jointures :

```sql
-- Produits français de plus de 30€
SELECT 
    p.NomProd,
    p.PrixUnit,
    f.Societe,
    f.Pays
FROM Produit AS p
INNER JOIN Fournisseur AS f ON p.NoFour = f.NoFour
WHERE f.Pays = 'France' AND p.PrixUnit > 30
ORDER BY p.PrixUnit DESC;
```

## Auto-jointure

Une table peut être jointe avec elle-même. Exemple : trouver des employés qui travaillent dans la même ville.

```sql
SELECT 
    e1.Nom AS Employe1,
    e2.Nom AS Employe2,
    e1.Ville
FROM Employe AS e1
INNER JOIN Employe AS e2 ON e1.Ville = e2.Ville
WHERE e1.NoEmp < e2.NoEmp
ORDER BY e1.Ville;
```

## Bonnes pratiques

1. **Toujours utiliser des alias** pour améliorer la lisibilité
2. **Spécifier les colonnes** au lieu de SELECT *
3. **Utiliser INNER JOIN explicitement** au lieu de l'ancienne syntaxe avec WHERE
4. **Vérifier les NULL** avec LEFT JOIN
5. **Indenter les requêtes complexes** pour la clarté

### Ancienne syntaxe (à éviter)

```sql
-- ❌ Syntaxe obsolète
SELECT p.NomProd, f.Societe
FROM Produit p, Fournisseur f
WHERE p.NoFour = f.NoFour;
```

```sql
-- ✅ Syntaxe moderne recommandée
SELECT p.NomProd, f.Societe
FROM Produit AS p
INNER JOIN Fournisseur AS f ON p.NoFour = f.NoFour;
```

## Exercices pratiques

Testez ces requêtes :

1. Affichez tous les produits avec leur catégorie (nom de la catégorie)
2. Affichez tous les clients avec le nombre de commandes passées
3. Trouvez les fournisseurs qui n'ont aucun produit
4. Affichez les 5 produits les plus commandés en quantité
5. Listez toutes les commandes avec le nom du client et le pays
6. Trouvez les employés qui ont traité des commandes de clients français

## Pour aller plus loin

Le dernier chapitre de ce module vous présentera les **sous-requêtes**, qui permettent d'imbriquer des requêtes pour résoudre des problèmes complexes.

**Liens utiles :**

- [TP3 - Exercice 1](/tp3/exercice1/) : Jointures simples
- [TP3 - Exercice 2](/tp3/exercice2/) : Jointures multiples
- [TP3 - Exercice 3](/tp3/exercice3/) : LEFT JOIN

---

**Points clés du chapitre :**

- ✅ `INNER JOIN` retourne les lignes avec correspondance dans les deux tables
- ✅ `LEFT JOIN` retourne toutes les lignes de gauche + correspondances
- ✅ Utilisez des alias de tables (AS) pour simplifier
- ✅ Les jointures multiples permettent de combiner 3+ tables
- ✅ Préférez la syntaxe JOIN ... ON à l'ancienne syntaxe WHERE
