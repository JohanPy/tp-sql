---
layout: base.njk
title: "Exercice 4 : Bonus - Requêtes complexes"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 5
titre: "Exercice 4 : Bonus - Requêtes complexes"
permalink: "/tp1/exercice5/"
tags: tp
---

# Exercice 4 : Bonus - Requêtes complexes

## Questions bonus

Ces questions combinent les notions vues dans les exercices précédents. À faire uniquement si vous avez le temps !

**1. Lister tous les produits non disponibles commandés au moins une fois**

Affichez les produits marqués comme indisponibles (Indisponible = 1) mais qui ont quand même été commandés.

**2. Calculer pour chaque client le montant total de ses commandes avec remise appliquée**

Affichez le nom du client et le montant total avec les remises déduites.

**3. Trouver les fournisseurs dont les prix moyens sont supérieurs à la moyenne générale des prix**

Affichez le nom du fournisseur et le prix moyen de ses produits.

**4. Lister les pays qui ont au moins un client ET un fournisseur**

Affichez les pays où l'entreprise a une présence commerciale complète.

<details>
<summary>💡 Indice</summary>

Pensez à l'opérateur `INTERSECT` pour trouver les valeurs communes entre deux ensembles.
</details>

**5. Pour chaque mois de commande, calculer le montant moyen des commandes et le nombre de commandes**

Affichez le mois, le nombre de commandes et le montant moyen.

**6. Trouver les produits commandés par tous les clients (ou au moins 90% des clients)**

Quel produit a la couverture client la plus large ?

**7. Afficher les clients qui ont commandé au moins une fois tous les produits d'une catégorie donnée**

Par exemple, tous les clients ayant commandé au moins une fois TOUS les produits de la catégorie 1.

**8. Calculer pour chaque employé son nombre de commandes, le montant total géré et sa performance par rapport à la moyenne**

Affichez le nom de l'employé, son nombre de commandes et un indicateur "Au-dessus/En-dessous de la moyenne".

**9. Trouver les paires client-fournisseur : clients ayant commandé au moins un produit d'un fournisseur donné**

Affichez pour chaque client tous les fournisseurs dont il a acheté des produits.

**10. Calculer le Top 5 des meilleures ventes en montant, avec le ratio par rapport au montant total**

Affichez les 5 produits générant le plus de chiffre d'affaires et leur % du CA total.