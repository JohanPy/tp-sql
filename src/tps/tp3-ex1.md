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

## Questions

**1. Compter le nombre total de commandes**

À partir de la table `Commande`, affichez le nombre total de commandes enregistrées sous l'alias `TotalCommandes`.

<!-- expected-query: Q1
SELECT COUNT(*) AS TotalCommandes FROM Commande;
-->

**2. Calculer le chiffre d'affaires total facturé**

À partir de la table `DetailCommande`, calculez le montant total cumulé de l'ensemble des ventes en appliquant les remises accordées. Arrondissez le résultat à 2 décimales sous l'alias `ChiffreAffairesTotal`.

<!-- expected-query: Q2
SELECT ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS ChiffreAffairesTotal FROM DetailCommande;
-->

**3. Afficher le nombre de clients par pays**

À partir de la table `Client`, affichez pour chaque pays (colonne `Pays`) le nombre de clients enregistrés, sous l'alias `NbClients`. Triez le résultat par ordre décroissant du nombre de clients.

<!-- expected-query: Q3
SELECT Pays, COUNT(*) AS NbClients FROM Client GROUP BY Pays ORDER BY NbClients DESC;
-->

**4. Calculer le prix unitaire moyen des produits par catégorie**

À partir de la table `Produit`, affichez pour chaque code de catégorie (`CodeCateg`) le prix unitaire moyen des produits, arrondi à 2 décimales sous l'alias `PrixMoyen`.

<!-- expected-query: Q4
SELECT CodeCateg, ROUND(AVG(PrixUnit), 2) AS PrixMoyen FROM Produit GROUP BY CodeCateg;
-->

**5. Identifier les catégories dont le prix unitaire moyen dépasse 100 €**

À partir de la table `Produit`, affichez le code de catégorie (`CodeCateg`) et le prix unitaire moyen arrondi à 2 décimales sous l'alias `PrixMoyen`, en ne conservant que les catégories dont ce prix unitaire moyen est strictement supérieur à 100 €.

<details>
<summary>💡 Indice</summary>

Attention : la clause `WHERE` filtre les lignes individuelles avant regroupement et ne peut pas porter sur le résultat d'un agrégat. Pour filtrer des groupes après calcul, utilisez la clause `HAVING`.
</details>

<!-- expected-query: Q5
SELECT CodeCateg, ROUND(AVG(PrixUnit), 2) AS PrixMoyen FROM Produit GROUP BY CodeCateg HAVING AVG(PrixUnit) > 100;
-->

**6. Dénombrer les commandes traitées par chaque employé**

À partir de la table `Commande`, affichez pour chaque identifiant d'employé (colonne `NoEmp`) le nombre de commandes qu'il a prises en charge, sous l'alias `NbCommandes`.

<!-- expected-query: Q6
SELECT NoEmp, COUNT(*) AS NbCommandes FROM Commande GROUP BY NoEmp;
-->

**7. Déterminer les quantités extrêmes commandées sur une ligne**

À partir de la table `DetailCommande`, identifiez sur l'ensemble des lignes de commande la quantité minimale commandée sous l'alias `QteMin` et la quantité maximale commandée sous l'alias `QteMax`.

<!-- expected-query: Q7
SELECT MIN(Qte) AS QteMin, MAX(Qte) AS QteMax FROM DetailCommande;
-->

**8. Filtrer les volumes de vente cumulés par produit**

À partir de la table `DetailCommande`, affichez pour chaque référence de produit (`Refprod`) la somme totale des quantités commandées sous l'alias `TotalVendu`. Ne retenez que les produits dont le cumul vendu est supérieur ou égal à 10 unités.

<!-- expected-query: Q8
SELECT Refprod, SUM(Qte) AS TotalVendu FROM DetailCommande GROUP BY Refprod HAVING SUM(Qte) >= 10;
-->

## Rappel de cours

### Fonctions d'agrégation

Ces fonctions permettent d'effectuer des calculs sur un ensemble de lignes.

```sql
-- Compter le nombre de lignes
SELECT COUNT(*) FROM Client;
```

```sql
-- Calculer la somme
SELECT SUM(PrixUnit) FROM Produit;
```

```sql
-- Calculer la moyenne
SELECT AVG(PrixUnit) FROM Produit;
```

```sql  
-- Trouver le minimum et le maximum
SELECT MIN(PrixUnit), MAX(PrixUnit) FROM Produit;
```

### Regroupement (GROUP BY)

Permet de grouper les résultats selon une ou plusieurs colonnes.

```sql
-- Compter le nombre de produits par fournisseur
SELECT NoFour, COUNT(*) 
FROM Produit 
GROUP BY NoFour;
```

### Filtrage sur les groupes (HAVING)

`HAVING` s'utilise après `GROUP BY` pour filtrer les résultats agrégés.

```sql
-- Fournisseurs ayant plus de 5 produits
SELECT NoFour, COUNT(*) 
FROM Produit 
GROUP BY NoFour 
HAVING COUNT(*) > 5;
```

