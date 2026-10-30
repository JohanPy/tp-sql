---
layout: base.njk
title: "Exercice 1 : Agrégats"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 1
titre: "Exercice 1 : Agrégats"
permalink: "/tp3/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Agrégats

Cet exercice permet de réviser rapidement les fonctions d'agrégation (`COUNT`, `MIN`, `MAX`, `SUM`, `AVG`), le regroupement (`GROUP BY`) et le filtrage sur groupes (`HAVING`) vus en CM et TD.

## Questions

**1. Synthèse globale des lignes de commande**

À partir de la table `DetailCommande`, affichez en une seule requête :
- `NbLignes` : Le nombre total de lignes de commande
- `QteMin` : La plus petite quantité commandée (`Qte`)
- `QteMax` : La plus grande quantité commandée (`Qte`)

<!-- expected-query: Q1
SELECT COUNT(*) AS NbLignes, MIN(Qte) AS QteMin, MAX(Qte) AS QteMax FROM DetailCommande;
-->

**2. Calculer le chiffre d'affaires total net**

À partir de la table `DetailCommande`, calculez le montant total de toutes les ventes après application de la remise (à partir du prix unitaire `PrixUnit`, de la quantité `Qte` et du taux de remise `Remise`).
Affichez ce résultat arrondi à 2 décimales sous l'alias `ChiffreAffairesTotal`.

<!-- expected-query: Q2
SELECT ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS ChiffreAffairesTotal FROM DetailCommande;
-->

**3. Compter le nombre de clients par pays**

À partir de la table `Client`, affichez pour chaque pays :
- `Pays` : Le nom du pays
- `NbClients` : Le nombre de clients situés dans ce pays

Triez le résultat par nombre de clients décroissant.

<!-- expected-query: Q3
SELECT Pays, COUNT(*) AS NbClients FROM Client GROUP BY Pays ORDER BY NbClients DESC;
-->

**4. Identifier les catégories dont le prix moyen dépasse 100 €**

À partir de la table `Produit`, affichez pour chaque catégorie :
- `CodeCateg` : Le code de la catégorie
- `NbProduits` : Le nombre de produits dans cette catégorie
- `PrixMoyen` : Le prix unitaire moyen (`PrixUnit`), arrondi à 2 décimales

Ne gardez que les catégories dont le prix unitaire moyen (avant arrondi) est strictement supérieur à 100 €.

<details>
<summary>💡 Indice</summary>

La clause `WHERE` filtre les lignes individuelles avant le regroupement et ne peut pas utiliser de fonction d'agrégation. Utilisez `HAVING` pour filtrer les groupes après le calcul de la moyenne.
</details>

<!-- expected-query: Q4
SELECT CodeCateg, COUNT(*) AS NbProduits, ROUND(AVG(PrixUnit), 2) AS PrixMoyen FROM Produit GROUP BY CodeCateg HAVING AVG(PrixUnit) > 100;
-->

## Rappel de cours

### Fonctions d'agrégation

Ces fonctions permettent d'effectuer des calculs statistiques sur un ensemble de lignes :

```sql
-- Compter, trouver les extrêmes, sommer et calculer une moyenne
SELECT COUNT(*) AS Total,
       MIN(PrixUnit) AS Minimum,
       MAX(PrixUnit) AS Maximum,
       SUM(UnitesStock) AS StockTotal,
       ROUND(AVG(PrixUnit), 2) AS Moyenne
FROM Produit;
```

### Regroupement (`GROUP BY`) et filtrage sur groupes (`HAVING`)

`GROUP BY` regroupe les lignes partageant la même valeur, et `HAVING` filtre les groupes obtenus après agrégation :

```sql
-- Fournisseurs proposant plus de 3 produits
SELECT NoFour, COUNT(*) AS NbProduits
FROM Produit
GROUP BY NoFour
HAVING COUNT(*) > 3;
```
