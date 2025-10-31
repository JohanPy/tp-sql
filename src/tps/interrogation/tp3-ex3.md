---
layout: base.njk
category: interrogation
title: "Exercice 2 : Sous-requêtes"
intitule: "TP 3 - Jointures et sous-requêtes"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 3
titre: "Exercice 2 : Sous-requêtes"
permalink: "/tp3/exercice3/"
tags: tp
---

# Exercice 2 : Sous-requêtes

## Questions

**1. Afficher les clients qui ont commandé le produit le plus cher**

Trouvez d'abord le produit le plus cher, puis les clients qui ont commandé ce produit.

<details>
<summary>💡 Indice</summary>

Utilisez une sous-requête pour trouver le produit max : `(SELECT Refprod FROM Produit ORDER BY PrixUnit DESC LIMIT 1)`.
</details>

**2. Afficher les employés qui ont traité plus de commandes que la moyenne**

<details>
<summary>💡 Indice</summary>

Calculez la moyenne des commandes par employé, puis filtrez avec `HAVING COUNT(*) > (SELECT AVG(...))`.
</details>

**3. Lister les produits dont le prix est supérieur au prix moyen de leur catégorie**

<details>
<summary>💡 Indice</summary>

Utilisez une sous-requête corrélée : `WHERE PrixUnit > (SELECT AVG(PrixUnit) FROM Produit WHERE Categorie = p.Categorie)`.
</details>

**4. Trouver les clients qui n'ont jamais commandé un produit spécifique (ex: Refprod = "123")**

<details>
<summary>💡 Indice</summary>

Utilisez `NOT IN` avec une sous-requête : `WHERE CodeCli NOT IN (SELECT DISTINCT CodeCli FROM...)`.
</details>

**5. Afficher les commandes avec un montant supérieur au montant moyen**

<details>
<summary>💡 Indice</summary>

Calculez le montant total par commande, puis comparez avec `(SELECT AVG(...))`.
</details>

**6. Lister les produits commandés par tous les clients (couverture client totale)**

<details>
<summary>💡 Indice</summary>

Comptez le nombre de clients distincts ayant commandé chaque produit et comparez avec le nombre total de clients.
</details>

**7. Afficher le client qui a dépensé le plus d'argent en achats**

<details>
<summary>💡 Indice</summary>

Utilisez une sous-requête pour calculer le total par client, puis `ORDER BY ... DESC LIMIT 1`.
</details>

**8. Trouver les produits jamais commandés (NOT IN ou LEFT JOIN alternative)**

<details>
<summary>💡 Indice</summary>

Utilisez `NOT IN (SELECT Refprod FROM DetailCommande)` ou une sous-requête EXISTS négative.
</details>

**9. Afficher les clients ayant une première commande datant de plus de 1 an**

<details>
<summary>💡 Indice</summary>

Calculez `MIN(DateCom)` par client et comparez avec une date de 1 an avant aujourd'hui.
</details>

**10. Lister les catégories dont le prix moyen dépasse le prix moyen global**

<details>
<summary>💡 Indice</summary>

Calculez le prix moyen global, puis comparez avec la moyenne par catégorie en utilisant `HAVING` avec une sous-requête.
</details>


## Exemples de requêtes

```sql
SELECT p.NomProduit, SUM(d.Quantite * d.PrixUnitaire) AS ChiffreAffaires
FROM Produits p
JOIN Details d ON p.IdProduit = d.IdProduit
GROUP BY p.IdProduit
ORDER BY ChiffreAffaires DESC;
```

```sql
SELECT c.Pays, SUM(d.Quantite * d.PrixUnitaire) AS TotalVentes, COUNT(DISTINCT co.IdCommande) AS NombreCommandes
FROM Clients c
JOIN Commandes co ON c.IdClient = co.IdClient
JOIN Details d ON co.IdCommande = d.IdCommande
GROUP BY c.Pays
ORDER BY TotalVentes DESC;
```
