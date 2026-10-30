---
layout: base.njk
title: "Exercice 4 : Synthèse — Dates, CASE & Agrégats"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 4
titre: "Exercice 4 : Synthèse — Dates, CASE & Agrégats"
permalink: "/tp3/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Synthèse — Dates, CASE & Agrégats

Cet exercice est le **cœur du TP**. Il croise la manipulation des dates (`STRFTIME`, `JULIANDAY`), les branchements conditionnels (`CASE`) et les regroupements statistiques (`GROUP BY`, `HAVING`, `COUNT(DISTINCT ...)`). Tout le monde doit le réaliser avant d'aborder le bonus.

## Questions

**1. Délai moyen d'expédition par pays de livraison**

À partir de la table `Commande`, pour les commandes déjà expédiées (`DateEnv` non nulle), affichez pour chaque pays de livraison :
- `PaysLiv` : Le pays de livraison
- `NbCommandes` : Le nombre de commandes expédiées
- `DelaiMoyenJours` : Le délai moyen d'expédition en jours (écart entre `DateEnv` et `DateCom`), arrondi à 1 décimale

Triez les résultats par `DelaiMoyenJours` décroissant.

<!-- expected-query: Q1
SELECT PaysLiv, COUNT(*) AS NbCommandes, ROUND(AVG(JULIANDAY(DateEnv) - JULIANDAY(DateCom)), 1) AS DelaiMoyenJours FROM Commande WHERE DateEnv IS NOT NULL GROUP BY PaysLiv ORDER BY DelaiMoyenJours DESC;
-->

**2. Répartition des produits disponibles par tranche de prix**

À partir de la table `Produit`, ne gardez que les produits actuellement en vente (colonne `Indisponible` égale à 0). Classez ces produits en trois tranches selon leur prix unitaire (`PrixUnit`) :
- `'Économique'` si le prix est strictement inférieur à 50 €
- `'Standard'` si le prix est compris entre 50 € et 150 € inclus
- `'Luxe'` si le prix est strictement supérieur à 150 €

Pour chaque tranche de prix, affichez :
- `TranchePrix` : Le nom de la tranche (`'Économique'`, `'Standard'` ou `'Luxe'`)
- `NbProduitsDispos` : Le nombre de produits disponibles dans cette tranche
- `PrixMoyen` : Le prix unitaire moyen de la tranche, arrondi à 2 décimales

Triez par `PrixMoyen` croissant.

<!-- expected-query: Q2
SELECT CASE WHEN PrixUnit < 50 THEN 'Économique' WHEN PrixUnit BETWEEN 50 AND 150 THEN 'Standard' ELSE 'Luxe' END AS TranchePrix, COUNT(*) AS NbProduitsDispos, ROUND(AVG(PrixUnit), 2) AS PrixMoyen FROM Produit WHERE Indisponible = 0 GROUP BY TranchePrix ORDER BY PrixMoyen ASC;
-->

**3. Suivi annuel des commandes expédiées en retard**

Dans la table `Commande`, une commande est expédiée en retard lorsque sa date d'envoi (`DateEnv`) est strictement après la date limite prévue (`ALivAvant`).
En prenant uniquement les commandes déjà expédiées (`DateEnv` non nulle), affichez pour chaque année de commande (`DateCom`) :
- `Annee` : L'année de la commande (sur 4 chiffres)
- `TotalExpediees` : Le nombre total de commandes expédiées cette année-là
- `NbRetards` : Le nombre de commandes expédiées en retard cette année-là

Triez par `Annee` croissante.

<details>
<summary>💡 Indice</summary>

Pour compter uniquement les commandes en retard à l'intérieur de chaque année sans filtrer le reste du groupe, additionnez une expression `CASE` qui vaut `1` en cas de retard et `0` sinon (voir le rappel de cours ci-dessous).
</details>

<!-- expected-query: Q3
SELECT STRFTIME('%Y', DateCom) AS Annee, COUNT(*) AS TotalExpediees, SUM(CASE WHEN JULIANDAY(DateEnv) > JULIANDAY(ALivAvant) THEN 1 ELSE 0 END) AS NbRetards FROM Commande WHERE DateEnv IS NOT NULL GROUP BY Annee ORDER BY Annee ASC;
-->

**4. Sélection des grosses commandes multi-produits**

À partir de la table `DetailCommande`, affichez pour chaque numéro de commande :
- `Nocom` : Le numéro de commande
- `NbReferences` : Le nombre de produits différents (`Refprod`) présents dans la commande
- `TotalArticles` : La somme totale des quantités commandées (`Qte`)
- `MontantNet` : Le montant total net de la commande (remise déduite), arrondi à 2 décimales

Ne gardez que les commandes qui contiennent **au moins 5 produits différents** (5 ou plus) ET dont le montant total net (avant arrondi) est **strictement supérieur à 5 000 €**. Triez par `MontantNet` décroissant.

<!-- expected-query: Q4
SELECT Nocom, COUNT(DISTINCT Refprod) AS NbReferences, SUM(Qte) AS TotalArticles, ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS MontantNet FROM DetailCommande GROUP BY Nocom HAVING COUNT(DISTINCT Refprod) >= 5 AND SUM(PrixUnit * Qte * (1 - Remise)) > 5000 ORDER BY MontantNet DESC;
-->

## Rappel de cours

### Comptage conditionnel avec `CASE` et `SUM`

Pour compter les lignes qui vérifient une condition précise à l'intérieur d'un groupe (`GROUP BY`), on additionne `1` lorsque la condition est vraie et `0` sinon :

```sql
-- Compter le nombre total de produits et le nombre de produits en rupture par catégorie
SELECT CodeCateg,
       COUNT(*) AS TotalProduits,
       SUM(CASE WHEN UnitesStock = 0 THEN 1 ELSE 0 END) AS NbEnRupture
FROM Produit
GROUP BY CodeCateg;
```

### Regroupement sur une colonne calculée

Vous pouvez regrouper les lignes (`GROUP BY`) directement avec l'alias d'une expression `CASE` ou `STRFTIME` définie dans le `SELECT` :

```sql
-- Compter les employés embauchés par année
SELECT STRFTIME('%Y', DateEmbauche) AS AnneeEmbauche, COUNT(*) AS NbEmployes
FROM Employe
GROUP BY AnneeEmbauche;
```

### Valeurs distinctes (`COUNT(DISTINCT ...)`) et conditions multiples dans `HAVING`

`COUNT(DISTINCT colonne)` compte le nombre de valeurs différentes dans chaque groupe. La clause `HAVING` accepte plusieurs conditions reliées par `AND` ou `OR` :

```sql
SELECT NoFour, COUNT(DISTINCT CodeCateg) AS NbCategories, AVG(PrixUnit) AS PrixMoyen
FROM Produit
GROUP BY NoFour
HAVING COUNT(*) >= 3 AND AVG(PrixUnit) > 50;
```
