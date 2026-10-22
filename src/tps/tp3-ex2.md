---
layout: base.njk
title: "Exercice 2 : Choix multiple (CASE)"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 2
titre: "Exercice 2 : Choix multiple (CASE)"
permalink: "/tp3/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Choix multiple (CASE)

## Questions

**1. Classer les produits par gamme de prix**

À partir de la table `Produit`, affichez la référence (`Refprod`), le nom (`Nomprod`), le prix unitaire (`PrixUnit`) et une colonne sous l'alias `Gamme` indiquant :
- 'Économique' si le prix unitaire est strictement inférieur à 50 €
- 'Standard' si le prix unitaire est compris entre 50 et 200 € inclus
- 'Premium' si le prix unitaire est strictement supérieur à 200 €

<details>
<summary>💡 Indice</summary>

La structure générale d'un branchement conditionnel s'écrit :
`CASE WHEN condition1 THEN valeur1 WHEN condition2 THEN valeur2 ELSE valeur_par_defaut END`
</details>

<!-- expected-query: Q1
SELECT Refprod, Nomprod, PrixUnit, CASE WHEN PrixUnit < 50 THEN 'Économique' WHEN PrixUnit BETWEEN 50 AND 200 THEN 'Standard' ELSE 'Premium' END AS Gamme FROM Produit;
-->

**2. Attribuer un statut de disponibilité aux produits**

À partir de la table `Produit`, affichez la référence (`Refprod`), le nom (`Nomprod`) et une colonne sous l'alias `Statut` affichant 'Indispo' lorsque le produit n'est plus commercialisé (champ `Indisponible` à 1), et 'Disponible' dans le cas contraire.

<!-- expected-query: Q2
SELECT Refprod, Nomprod, CASE WHEN Indisponible = 1 THEN 'Indispo' ELSE 'Disponible' END AS Statut FROM Produit;
-->

**3. Catégoriser les commandes par volume financier**

À partir de la table `DetailCommande`, pour chaque numéro de commande (`Nocom`), calculez le montant total net facturé (avec remises appliquées) arrondi à 2 décimales sous l'alias `MontantTotal`. Ajoutez une colonne sous l'alias `CategorieCommande` classant la commande selon ce montant total :
- 'Petit' pour un total strictement inférieur à 100 €
- 'Moyen' pour un total compris entre 100 et 500 € inclus
- 'Gros' pour un total strictement supérieur à 500 €

<!-- expected-query: Q3
SELECT Nocom, ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS MontantTotal, CASE WHEN SUM(PrixUnit * Qte * (1 - Remise)) < 100 THEN 'Petit' WHEN SUM(PrixUnit * Qte * (1 - Remise)) BETWEEN 100 AND 500 THEN 'Moyen' ELSE 'Gros' END AS CategorieCommande FROM DetailCommande GROUP BY Nocom;
-->

## Rappel de cours

### Expression CASE

L'expression `CASE` permet d'ajouter de la logique conditionnelle dans vos requêtes (comme un IF/ELSE).

```sql
-- Créer une colonne personnalisée selon une condition
SELECT NomProd, PrixUnit,
    CASE
        WHEN PrixUnit < 10 THEN 'Pas cher'
        WHEN PrixUnit BETWEEN 10 AND 50 THEN 'Moyen'
        ELSE 'Cher'
    END AS CategoriePrix
FROM Produit;
```
