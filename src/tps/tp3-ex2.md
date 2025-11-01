---
layout: base.njk
title: "Exercice 1 : Jointures"
intitule: "TP 3 - Jointures et sous-requêtes"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 2
titre: "Exercice 1 : Jointures"
permalink: "/tp3/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Jointures

## Questions

**1. Afficher toutes les commandes avec les informations du client et de l'employé**

Pour chaque commande, affichez le numéro, la date, le nom du client et le nom de l'employé qui l'a traitée.

<details>
<summary>💡 Indice</summary>

Utilisez `INNER JOIN Commande` avec `Client` sur `CodeCli` et `Employe` sur `NoEmp`.
</details>

**2. Lister tous les produits avec leur catégorie et leur fournisseur**

Affichez le nom du produit, la catégorie et le fournisseur.

<details>
<summary>💡 Indice</summary>

Joignez `Produit` avec `Categorie` (sur CodeCategorie) et `Fournisseur` (sur CodeFournisseur).
</details>

**3. Afficher les détails de toutes les commandes avec les noms des produits**

Pour chaque ligne de commande, affichez le numéro de commande, la référence du produit et son nom.

<details>
<summary>💡 Indice</summary>

Joignez `DetailCommande` avec `Produit` sur `Refprod`.
</details>

**4. Trouver les clients qui n'ont jamais commandé (LEFT JOIN)**

Affichez les clients de la base qui n'ont aucune commande enregistrée.

<details>
<summary>💡 Indice</summary>

Utilisez `LEFT JOIN Commande` et filtrez avec `WHERE NoCom IS NULL`.
</details>

**5. Afficher tous les produits, qu'ils aient été commandés ou non**

Affichez le nom du produit et le nombre de fois qu'il a été commandé (0 si jamais commandé).

<details>
<summary>💡 Indice</summary>

Utilisez `LEFT JOIN DetailCommande` avec `GROUP BY` et `COUNT()`.
</details>

**6. Lister les employés et leurs responsables (auto-jointure)**

Pour chaque employé, affichez son nom et le nom de son responsable.

<details>
<summary>💡 Indice</summary>

Joignez la table `Employe` avec elle-même : `e` et `e_chef`. La liaison est sur le champ `Responsable`.
</details>

**7. Afficher les commandes groupées avec client, employé, et informations complètes**

Pour chaque commande : client, employé, nombre de produits et montant total (avec remise).

<details>
<summary>💡 Indice</summary>

Joignez `Commande`, `Client`, `Employe`, `DetailCommande` et agrégez avec `SUM()` et `COUNT()`.
</details>

**8. Trouver les clients et les fournisseurs du même pays**

Affichez les paires client-fournisseur pour chaque pays.

<details>
<summary>💡 Indice</summary>

Joignez `Client` et `Fournisseur` sur le champ `Pays` (CROSS JOIN avec condition).
</details>

**9. Afficher les commandes avec délai de livraison (DateLivraison - DateCom)**

Affichez le numéro de commande, la date de commande, la date de livraison et le délai en jours.

<details>
<summary>💡 Indice</summary>

Calculez `CAST(JULIANDAY(DateLivraison) - JULIANDAY(DateCom) AS INTEGER)` dans votre SELECT.
</details>

**10. Créer un résumé complet : client → commandes → produits avec tous les détails**

Affichez pour chaque commande : Societe, DateCom, NoCom, Nomprod, Qte, Remise, montant ligne.

<details>
<summary>💡 Indice</summary>

Joignez les 4 tables principales : `Client`, `Commande`, `DetailCommande`, `Produit`.
</details>

