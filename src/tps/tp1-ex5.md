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
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Requêtes complexes

## Questions bonus

Ces questions combinent les notions vues dans les exercices précédents. À faire uniquement si vous avez le temps !

**1. Lister tous les produits non disponibles commandés au moins une fois**

Affichez les produits marqués comme indisponibles (Indisponible = 1) mais qui ont quand même été commandés.

<details>
<summary>💡 Indice</summary>

Vous devez joindre la table `Produit` avec `DetailCommande` pour vérifier les commandes passées.
</details>

**2. Calculer pour chaque client le montant total de ses commandes avec remise appliquée**

Affichez le nom du client et le montant total avec les remises déduites.

<details>
<summary>💡 Indice</summary>

Vous devez joindre `Client`, `Commande` et `DetailCommande`. Puis calculer `SUM(Qte * PrixUnit * (1 - Remise/100))`.
</details>

**3. Trouver les fournisseurs dont les prix moyens sont supérieurs à la moyenne générale des prix**

Affichez le nom du fournisseur et le prix moyen de ses produits.

<details>
<summary>💡 Indice</summary>

Vous devez calculer la moyenne générale des prix, puis comparer la moyenne par fournisseur avec cette moyenne générale.
</details>

**4. Lister les pays qui ont au moins un client ET un fournisseur**

Affichez les pays où l'entreprise a une présence commerciale complète.

<details>
<summary>💡 Indice</summary>

Vous pouvez utiliser `INTERSECT` pour trouver les pays qui apparaissent dans les deux listes.
</details>

**5. Pour chaque mois de commande, calculer le montant moyen des commandes et le nombre de commandes**

Affichez le mois, le nombre de commandes et le montant moyen.

<details>
<summary>💡 Indice</summary>

Utilisez `STRFTIME('%Y-%m', DateCom)` pour extraire le mois, puis `GROUP BY` sur ce format.
</details>

**6. Trouver les produits commandés par tous les clients (ou au moins 90% des clients)**

Quel produit a la couverture client la plus large ?

<details>
<summary>💡 Indice</summary>

Comptez le nombre de clients distincts ayant commandé chaque produit, puis comparez avec le nombre total de clients.
</details>

**7. Afficher les clients qui ont commandé au moins une fois tous les produits d'une catégorie donnée**

Par exemple, tous les clients ayant commandé au moins une fois TOUS les produits de la catégorie 1.

<details>
<summary>💡 Indice</summary>

Vous pouvez utiliser une sous-requête pour compter le nombre de produits distincts commandés par chaque client dans une catégorie.
</details>

**8. Calculer pour chaque employé son nombre de commandes, le montant total géré et sa performance par rapport à la moyenne**

Affichez le nom de l'employé, son nombre de commandes et un indicateur "Au-dessus/En-dessous de la moyenne".

<details>
<summary>💡 Indice</summary>

Vous devez calculer la moyenne des montants par employé, puis utiliser une fonction `CASE` pour le comparatif.
</details>

**9. Trouver les paires client-fournisseur : clients ayant commandé au moins un produit d'un fournisseur donné**

Affichez pour chaque client tous les fournisseurs dont il a acheté des produits.

<details>
<summary>💡 Indice</summary>

Joignez `Client`, `Commande`, `DetailCommande`, `Produit` et `Fournisseur` pour établir les relations.
</details>

**10. Calculer le Top 5 des meilleures ventes en montant, avec le ratio par rapport au montant total**

Affichez les 5 produits générant le plus de chiffre d'affaires et leur % du CA total.

<details>
<summary>💡 Indice</summary>

Calculez d'abord le CA par produit avec les remises appliquées, puis le CA total. Ensuite, faites le ratio.
</details>