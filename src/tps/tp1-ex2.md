---
layout: base.njk
title: "Exercice 1 : Fonctions basiques"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 2
titre: "Exercice 1 : Fonctions basiques"
permalink: "/tp1/exercice2/"
tags: tp
---

# Exercice 1 : Fonctions basiques

## Questions

**1. Trier tous les produits par leur prix unitaire**

Ordonnez les produits du moins cher au plus cher.

**2. Lister les trois produits les plus chers**

Affichez les 3 produits avec les prix les plus élevés.

**3. Lister les clients suisses, allemands et belges**

Filtrez les clients selon leur pays (Suisse, Allemagne, Belgique).

<details>
<summary>💡 Indice</summary>

Utilisez l'opérateur `IN` pour filtrer sur plusieurs valeurs.
</details>

**4. Lister les noms des Sociétés dont le nom contient "restaurant"**

Recherchez les sociétés clients ayant "restaurant" dans leur nom.

**5. Lister les différents pays des clients (sans doublons)**

Affichez la liste unique des pays où se trouvent les clients.

**6. Idem en ajoutant les villes, le tout trié par ordre alphabétique du pays et de la ville**

Affichez les couples (Pays, Ville) sans doublon, triés par pays puis par ville.

**7. Lister tous les produits vendus en bouteilles ou en canettes**

Recherchez les produits dont l'unité de vente (QteParUnit) contient "bouteille" ou "canette".

**8. Lister les produits du fournisseur n° 8 dont le prix unitaire est entre 10 et 100€**

Affichez le nom et la référence du produit en majuscule.

<details>
<summary>💡 Indice</summary>

Pour convertir en majuscule, utilisez la fonction `UPPER()`.
</details>

**9. Lister les numéros d'employés ayant réalisé une commande à livrer à Lille, Lyon ou Nantes**

Récupérez les `NoEmp` des employés pour des commandes destinées à ces villes.

**10. Lister les produits dont le nom contient "tofu" ou "choco", dont le prix est inférieur à 100€**

Affichez le nom et le prix de ces produits.

<details>
<summary>💡 Indice</summary>

Attention à la priorité des opérateurs ! Utilisez des parenthèses pour grouper les conditions OR.
</details>

## Exemples de requêtes SQL

```sql
-- Exemple de tri
SELECT * FROM Produit ORDER BY PrixUnit ASC;
```

```sql
-- Exemple d'utilisation de IN
SELECT * FROM Client WHERE Pays IN ('Suisse', 'Allemagne');
```
