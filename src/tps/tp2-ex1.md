---
layout: base.njk
title: "Exercice 1 : Agrégats"
intitule: "TP 2 - Dates et agrégats"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 1
titre: "Exercice 1 : Agrégats"
permalink: "/tp2/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Agrégats

## Questions

**1. Compter le nombre total de commandes**

Affichez le nombre de commandes passées.

<!-- expected-query: Q1
SELECT COUNT(*) AS TotalCommandes FROM Commande;
-->

**2. Calculer le montant total de toutes les commandes avec remise appliquée**

Calculez le chiffre d'affaires total en tenant compte des remises.

<!-- expected-query: Q2
SELECT ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS ChiffreAffairesTotal FROM DetailCommande;
-->

**3. Afficher le nombre de clients par pays**

Affichez le pays et le nombre de clients pour chaque pays, trié par nombre décroissant.

<!-- expected-query: Q3
SELECT Pays, COUNT(*) AS NbClients FROM Client GROUP BY Pays ORDER BY NbClients DESC;
-->

**4. Calculer le prix moyen des produits par catégorie**

Affichez le nom de la catégorie et le prix moyen des produits.

<!-- expected-query: Q4
SELECT Categorie.NomCateg, ROUND(AVG(Produit.PrixUnit), 2) AS PrixMoyen FROM Produit JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg GROUP BY Categorie.CodeCateg, Categorie.NomCateg;
-->

**5. Trouver les catégories dont le prix moyen est supérieur à 100**

Utilisez une clause de filtrage après agrégation.

<!-- expected-query: Q5
SELECT Categorie.NomCateg, ROUND(AVG(Produit.PrixUnit), 2) AS PrixMoyen FROM Produit JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg GROUP BY Categorie.CodeCateg, Categorie.NomCateg HAVING AVG(Produit.PrixUnit) > 100;
-->

**6. Afficher pour chaque employé le nombre de commandes qu'il a gérées**

Affichez le nom, prénom et le nombre de commandes traitées.

<!-- expected-query: Q6
SELECT Employe.Nom, Employe.Prenom, COUNT(Commande.NoCom) AS NbCommandes FROM Employe JOIN Commande ON Employe.NoEmp = Commande.NoEmp GROUP BY Employe.NoEmp, Employe.Nom, Employe.Prenom;
-->

**7. Calculer le nombre minimum et maximum d'unités commandées dans une seule ligne de commande**

Trouvez les quantités extrêmes dans la table DetailCommande.

<!-- expected-query: Q7
SELECT MIN(Qte) AS QteMin, MAX(Qte) AS QteMax FROM DetailCommande;
-->

**8. Afficher les produits avec leur quantité totale vendue, en excluant les ventes inférieures à 10 unités**

Filtrez les produits peu vendus.

<!-- expected-query: Q8
SELECT Produit.Nomprod, SUM(DetailCommande.Qte) AS TotalVendu FROM Produit JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod GROUP BY Produit.Refprod, Produit.Nomprod HAVING SUM(DetailCommande.Qte) >= 10;
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

