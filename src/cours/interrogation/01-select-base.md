---
layout: cours.njk
title: "Chapitre 1 : Les bases du SELECT"
category: interrogation
categoryTitle: "Interrogation de bases de données"
chapNum: 1
base: Comptoir2000.sqlite
permalink: "/cours/interrogation/chapitre-1/"
---

## Introduction

La commande `SELECT` est la pierre angulaire du langage SQL. Elle permet d'**interroger** une base de données pour récupérer des informations. C'est la commande que vous utiliserez le plus souvent.

Dans ce chapitre, vous allez découvrir :
- Comment sélectionner toutes les colonnes d'une table
- Comment sélectionner des colonnes spécifiques
- Comment renommer les colonnes avec des alias
- Les bonnes pratiques pour écrire des requêtes lisibles

## Syntaxe de base

La forme la plus simple d'une requête SQL est :

```sql
SELECT * FROM nom_table;
```

- `SELECT` : indique que vous voulez récupérer des données
- `*` : signifie "toutes les colonnes"
- `FROM` : indique depuis quelle table récupérer les données
- `nom_table` : le nom de la table à interroger
- `;` : termine la requête (optionnel dans certains contextes)

### Exemple : Afficher tous les clients

```sql
SELECT * FROM Client;
```

Cette requête affiche **toutes les colonnes** et **toutes les lignes** de la table `Client`.

> **💡 À retenir** : L'astérisque `*` est pratique pour explorer une table, mais en production, il est recommandé de sélectionner uniquement les colonnes nécessaires pour optimiser les performances.

## Sélectionner des colonnes spécifiques

Au lieu de récupérer toutes les colonnes, vous pouvez choisir celles qui vous intéressent :

```sql
SELECT colonne1, colonne2, colonne3 FROM nom_table;
```

### Exemple : Afficher le nom et la ville des clients

```sql
SELECT Societe, Ville FROM Client;
```

Cette requête ne retourne que les colonnes `Societe` et `Ville` de la table `Client`.

**Avantages de la sélection explicite :**
- Performances améliorées (moins de données transférées)
- Lisibilité accrue
- Maintenance facilitée

## Les alias avec AS

Un **alias** est un nom temporaire donné à une colonne dans les résultats de la requête. Cela permet de :
- Rendre les noms de colonnes plus explicites
- Raccourcir des noms trop longs
- Calculer des expressions et leur donner un nom

### Syntaxe

```sql
SELECT colonne AS nouveau_nom FROM table;
```

Le mot-clé `AS` est optionnel mais recommandé pour la lisibilité :

```sql
SELECT colonne nouveau_nom FROM table;  -- Fonctionne aussi
```

### Exemples d'alias

```sql
SELECT 
    Societe AS NomEntreprise,
    Contact AS NomContact,
    Ville AS VilleClient
FROM Client;
```

```sql
SELECT 
    RefProd AS Reference,
    NomProd AS Produit,
    PrixUnit AS Prix
FROM Produit;
```

> **💡 À retenir** : Les alias ne modifient pas la structure de la base de données, ils affectent uniquement l'affichage des résultats de la requête.

## Expressions et calculs

Vous pouvez effectuer des calculs directement dans le `SELECT` :

```sql
SELECT 
    NomProd,
    PrixUnit,
    PrixUnit * 1.20 AS PrixTTC
FROM Produit;
```

Cette requête calcule le prix TTC (avec 20% de TVA) pour chaque produit.

## Chaînes de caractères littérales

Vous pouvez ajouter du texte fixe dans vos résultats :

```sql
SELECT 
    'Produit : ' || NomProd AS Description,
    PrixUnit || ' €' AS PrixFormate
FROM Produit;
```

**Note** : SQLite utilise `||` pour concaténer des chaînes de caractères.

## Bonnes pratiques

1. **Indentation** : Écrivez vos requêtes sur plusieurs lignes pour améliorer la lisibilité

```sql
-- ✅ Recommandé
SELECT 
    Societe,
    Contact,
    Ville
FROM Client;

-- ❌ Moins lisible
SELECT Societe, Contact, Ville FROM Client;
```

2. **Colonnes explicites** : Évitez `SELECT *` en production

3. **Alias significatifs** : Choisissez des noms d'alias descriptifs

4. **Commentaires** : Utilisez `--` pour commenter vos requêtes

```sql
-- Récupération des informations essentielles des clients
SELECT 
    Societe AS Entreprise,
    Ville
FROM Client;
```

## Exercices pratiques

Utilisez la console SQL à droite pour tester ces requêtes :

1. Affichez toutes les informations de la table `Produit`
2. Affichez uniquement le nom et le prix des produits
3. Créez une requête qui affiche le nom du produit avec l'alias "Article" et le prix avec l'alias "Tarif"
4. Calculez le prix HT en partant du principe que `PrixUnit` est le prix TTC (divisez par 1.20)

## Pour aller plus loin

Maintenant que vous maîtrisez les bases du `SELECT`, vous êtes prêt à découvrir comment **filtrer** les résultats avec la clause `WHERE` dans le prochain chapitre.

**Liens utiles :**
- [TP1 - Exercice 1](/tp1/exercice1/) : Premières requêtes SELECT
- [TP1 - Exercice 2](/tp1/exercice2/) : Sélections avec alias

---

**Points clés du chapitre :**
- ✅ `SELECT *` récupère toutes les colonnes
- ✅ Sélectionnez des colonnes spécifiques pour optimiser
- ✅ Utilisez `AS` pour créer des alias
- ✅ Vous pouvez faire des calculs dans le SELECT
- ✅ Écrivez des requêtes lisibles avec une bonne indentation
