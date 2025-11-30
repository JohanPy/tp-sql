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

**2. Calculer le montant total de toutes les commandes avec remise appliquée**

Calculez le chiffre d'affaires total en tenant compte des remises.

**3. Afficher le nombre de clients par pays**

Affichez le pays et le nombre de clients pour chaque pays, trié par nombre décroissant.

**4. Calculer le prix moyen des produits par catégorie**

Affichez le nom de la catégorie et le prix moyen des produits.

**5. Trouver les catégories dont le prix moyen est supérieur à 100**

Utilisez une clause de filtrage après agrégation.

**6. Afficher pour chaque employé le nombre de commandes qu'il a gérées**

Affichez le nom, prénom et le nombre de commandes traitées.

**7. Calculer le nombre minimum et maximum d'unités commandées dans une seule ligne de commande**

Trouvez les quantités extrêmes dans la table DetailCommande.

**8. Afficher les produits avec leur quantité totale vendue, en excluant les ventes inférieures à 10 unités**

Filtrez les produits peu vendus.

## Rappel de cours

### Fonctions d'agrégation

Ces fonctions permettent d'effectuer des calculs sur un ensemble de lignes.

```sql
-- Compter le nombre de lignes
SELECT COUNT(*) FROM Client;

-- Calculer la somme
SELECT SUM(PrixUnit) FROM Produit;

-- Calculer la moyenne
SELECT AVG(PrixUnit) FROM Produit;

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

