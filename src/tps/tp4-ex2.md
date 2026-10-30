---
layout: base.njk
title: "Exercice 2 : Sous-requêtes"
intitule: "TP 4 — Jointures Multi-Tables & Sous-Requêtes"
base: "Comptoir2000.sqlite"
tpNum: 4
exerciceNum: 2
titre: "Exercice 2 : Sous-requêtes"
permalink: "/tp4/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Sous-requêtes

Cet exercice permet de pratiquer les 4 grands schémas de sous-requêtes : sous-requête scalaire dans `WHERE`, sous-requête de liste avec `NOT IN`, sous-requête scalaire dans `HAVING` et sous-requête corrélée.

## Questions

**1. Afficher les clients ayant commandé le produit le plus cher**

Affichez sans doublon le nom des sociétés clientes (colonne `Societe`) ayant commandé le produit ayant le prix unitaire le plus élevé du catalogue.

<details>
<summary>💡 Indice</summary>

Utilisez une sous-requête scalaire pour isoler la référence (`Refprod`) du produit le plus cher, puis filtrez les commandes correspondantes.
</details>

<!-- expected-query: Q1
SELECT DISTINCT Client.Societe FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom WHERE DetailCommande.Refprod = (SELECT Refprod FROM Produit ORDER BY PrixUnit DESC LIMIT 1);
-->

**2. Identifier les clients n'ayant jamais commandé le produit n° 1**

Affichez le nom (colonne `Societe`) des clients qui n'ont jamais commandé le produit de référence 1 (`Refprod = 1`).

<details>
<summary>💡 Indice</summary>

Construisez d'abord la sous-requête listant les `CodeCli` ayant acheté le produit n° 1, puis excluez-les avec l'opérateur `NOT IN (...)`.
</details>

<!-- expected-query: Q2
SELECT Societe FROM Client WHERE CodeCli NOT IN (SELECT DISTINCT CodeCli FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom WHERE Refprod = 1);
-->

**3. Identifier les catégories dont le prix moyen dépasse la moyenne générale**

Affichez le nom de la catégorie (`NomCateg`) et son prix unitaire moyen arrondi à 2 décimales sous l'alias `PrixMoyenCateg`, uniquement pour les catégories dont le prix unitaire moyen est strictement supérieur au prix unitaire moyen de l'ensemble du catalogue.

<!-- expected-query: Q3
SELECT Categorie.NomCateg, ROUND(AVG(Produit.PrixUnit), 2) AS PrixMoyenCateg FROM Produit JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg GROUP BY Categorie.CodeCateg, Categorie.NomCateg HAVING AVG(Produit.PrixUnit) > (SELECT AVG(PrixUnit) FROM Produit);
-->

**4. Lister les produits plus chers que la moyenne de leur propre catégorie**

Affichez le nom du produit (`Nomprod`), son prix unitaire (`PrixUnit`) et son code de catégorie (`CodeCateg`), pour tous les produits dont le prix unitaire est strictement supérieur au prix moyen des produits de leur propre catégorie.

<details>
<summary>💡 Indice</summary>

Utilisez une **sous-requête corrélée** faisant référence à la catégorie du produit courant de la requête externe (`WHERE P2.CodeCateg = P.CodeCateg`).
</details>

<!-- expected-query: Q4
SELECT P.Nomprod, P.PrixUnit, P.CodeCateg FROM Produit P WHERE P.PrixUnit > (SELECT AVG(P2.PrixUnit) FROM Produit P2 WHERE P2.CodeCateg = P.CodeCateg);
-->

## Rappel de cours

### Sous-requête scalaire (dans `WHERE` ou `HAVING`)

Retourne une valeur unique (1 ligne, 1 colonne) et s'utilise avec les opérateurs `=`, `<`, `>`, `<=`, `>=` :

```sql
-- Produits plus chers que la moyenne globale du catalogue
SELECT Nomprod, PrixUnit
FROM Produit
WHERE PrixUnit > (SELECT AVG(PrixUnit) FROM Produit);
```

### Sous-requête de liste (`IN` / `NOT IN`)

Retourne un ensemble de valeurs (1 colonne, plusieurs lignes) :

```sql
-- Clients ayant commandé le produit 1
SELECT Societe FROM Client
WHERE CodeCli IN (
    SELECT CodeCli FROM Commande
    JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom
    WHERE Refprod = 1
);
```

### Sous-requête corrélée

La sous-requête dépend d'un alias défini dans la requête externe et est réévaluée pour chaque ligne :

```sql
SELECT P.Nomprod, P.PrixUnit
FROM Produit P
WHERE P.PrixUnit > (
    SELECT AVG(P2.PrixUnit)
    FROM Produit P2
    WHERE P2.NoFour = P.NoFour
);
```
