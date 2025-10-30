---
layout: base.njk
title: "Exercice 1 : Agrégats"
intitule: "TP 2 - Dates et agrégats"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 2
titre: "Exercice 1 : Agrégats"
permalink: "/tp2/exercice2/"
tags: tp
---

# Exercice 1 : Agrégats

## Questions

**1. Compter le nombre total de commandes**

Affichez le nombre de commandes passées.

<details>
<summary>💡 Indice</summary>

Utilisez `COUNT(NoCom)` sur la table `Commande`.
</details>

**2. Calculer le montant total de toutes les commandes avec remise appliquée**

Affichez le chiffre d'affaires total (quantité × prix unitaire × (1 - remise%)).

<details>
<summary>💡 Indice</summary>

Vous devez joindre `Commande` et `DetailCommande`, puis calculer `SUM(Qte * PrixUnit * (1 - Remise/100))`.
</details>

**3. Afficher le nombre de clients par pays**

Affichez le pays et le nombre de clients pour chaque pays, trié par nombre décroissant.

<details>
<summary>💡 Indice</summary>

Utilisez `GROUP BY Pays` et `COUNT(CodeCli)`, puis `ORDER BY COUNT DESC`.
</details>

**4. Calculer le prix moyen des produits par catégorie**

Affichez le nom de la catégorie et le prix moyen des produits.

<details>
<summary>💡 Indice</summary>

Vous devez joindre `Categorie` et `Produit`, puis utiliser `GROUP BY` et `AVG(PrixUnit)`.
</details>

**5. Trouver les catégories dont le prix moyen est supérieur à 100**

<details>
<summary>💡 Indice</summary>

Utilisez `HAVING AVG(PrixUnit) > 100` pour filtrer après l'agrégation.
</details>

**6. Afficher pour chaque employé le nombre de commandes qu'il a gérées**

<details>
<summary>💡 Indice</summary>

Joignez `Employe` et `Commande`, puis `GROUP BY NoEmp` avec `COUNT(NoCom)`.
</details>

**7. Calculer le nombre minimum et maximum d'unités commandées dans une seule ligne de commande**

<details>
<summary>💡 Indice</summary>

Utilisez `MIN(Qte)` et `MAX(Qte)` sur la table `DetailCommande`.
</details>

**8. Afficher les produits avec leur quantité totale vendue, en excluant les ventes inférieures à 10 unités**

<details>
<summary>💡 Indice</summary>

Utilisez `GROUP BY` et  `HAVING SUM(Qte) >= 10`.
</details>

