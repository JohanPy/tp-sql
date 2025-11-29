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

**2. Afficher les employés qui ont traité au moins 20 commandes**

Listez les employés ayant géré 20 commandes ou plus.


**3. Lister les produits dont le prix est supérieur au prix moyen de leur catégorie**

Utilisez une sous-requête pour comparer avec la moyenne de la catégorie.

<details>
<summary>💡 Indice</summary>
Calculez la moyenne des prix par CodeCateg en sous-requête, puis comparez PrixUnit de chaque produit à la moyenne de sa catégorie.
</details>

**4. Trouver les clients qui n'ont jamais commandé un produit spécifique (ex: Refprod = "123")**

Utilisez une sous-requête avec NOT IN.


**5. Lister les produits commandés par tous les clients (couverture client totale)**

Trouvez les produits présents dans toutes les commandes clients.

<details>
<summary>💡 Indice</summary>
Comptez le nombre de clients distincts ayant commandé chaque produit ; comparez avec le nombre total de clients. Utilisez HAVING COUNT(DISTINCT CodeCli) = (SELECT COUNT(DISTINCT CodeCli) FROM Commande).
</details>

**6. Afficher le client qui a dépensé le plus d'argent en achats**

Calculez le total par client et trouvez le maximum.

<details>
<summary>💡 Indice</summary>
Calculez SUM(PrixUnit * Qte * (1 - Remise)) par CodeCli, puis trouvez le maximum avec une sous-requête MAX().
</details>

**7. Afficher les clients ayant une première commande datant de plus de 1 an**

Calculez la date de première commande pour chaque client.


**8. Lister les catégories dont le prix moyen dépasse le prix moyen global**

Comparez la moyenne par catégorie avec la moyenne générale.

<details>
<summary>💡 Indice</summary>
Calculez AVG(PrixUnit) par CodeCateg ; comparez avec la moyenne générale de tous les produits via une sous-requête (SELECT AVG(PrixUnit) FROM Produit).
</details>

## Exemples de requêtes

```sql
-- Exemple de sous-requête pour trouver le max
SELECT * FROM Produit WHERE PrixUnit = (SELECT MAX(PrixUnit) FROM Produit);
```

## Rappel de cours

### Sous-requête scalaire

Retourne une seule valeur. Utilisée souvent avec `=`, `<`, `>`.

```sql
-- Produits plus chers que la moyenne
SELECT NomProd, PrixUnit
FROM Produit
WHERE PrixUnit > (SELECT AVG(PrixUnit) FROM Produit);
```

### Sous-requête de liste (IN)

Retourne une liste de valeurs.

```sql
-- Clients ayant commandé le produit 1
SELECT Societe FROM Client
WHERE CodeCli IN (
    SELECT CodeCli FROM Commande
    JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom
    WHERE RefProd = 1
);
```

### Sous-requête corrélée (EXISTS)

La sous-requête dépend d'une valeur de la requête principale.

```sql
-- Clients ayant passé au moins une commande (alternative au JOIN)
SELECT Societe FROM Client C
WHERE EXISTS (
    SELECT 1 FROM Commande O WHERE O.CodeCli = C.CodeCli
);
```
