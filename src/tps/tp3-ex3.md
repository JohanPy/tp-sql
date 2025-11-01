---
layout: base.njk
title: "Exercice 2 : Sous-requêtes"
intitule: "TP 3 - Jointures et sous-requêtes"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 3
titre: "Exercice 2 : Sous-requêtes"
permalink: "/tp3/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Sous-requêtes

## Questions

**1. Afficher les clients qui ont commandé le produit le plus cher**
Afficher le nom des sociétés clientes qui ont commandé le produit le plus cher.

<details>
<summary>💡 Indice</summary>
Trouvez d'abord le produit avec le prix maximum, puis les clients qui ont commandé ce produit.
</details>

**2. Afficher les employés qui ont traité plus de commandes que la moyenne**

Comparez le nombre de commandes de chaque employé avec la moyenne.

**3. Lister les produits dont le prix est supérieur au prix moyen de leur catégorie**

Utilisez une sous-requête pour comparer avec la moyenne de la catégorie.

**4. Trouver les clients qui n'ont jamais commandé un produit spécifique (ex: Refprod = "123")**

Utilisez une sous-requête avec NOT IN.

**5. Afficher les commandes avec un montant supérieur au montant moyen**

Calculez le montant total par commande et comparez.

**6. Lister les produits commandés par tous les clients (couverture client totale)**

Trouvez les produits présents dans toutes les commandes clients.

**7. Afficher le client qui a dépensé le plus d'argent en achats**

Calculez le total par client et trouvez le maximum.

**8. Trouver les produits jamais commandés**

Alternative avec sous-requête NOT IN.

**9. Afficher les clients ayant une première commande datant de plus de 1 an**

Calculez la date de première commande pour chaque client.

**10. Lister les catégories dont le prix moyen dépasse le prix moyen global**

Comparez la moyenne par catégorie avec la moyenne générale.

## Exemples de requêtes

```sql
-- Exemple de sous-requête pour trouver le max
SELECT * FROM Produit WHERE PrixUnit = (SELECT MAX(PrixUnit) FROM Produit);
```
