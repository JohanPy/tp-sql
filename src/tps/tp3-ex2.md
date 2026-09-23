---
layout: base.njk
title: "Exercice 2 : Sous-requêtes"
intitule: "TP 3 - Jointures et sous-requêtes"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 2
titre: "Exercice 2 : Sous-requêtes"
permalink: "/tp3/exercice2/"
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

<!-- expected-query: Q1
SELECT DISTINCT Client.Societe FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom WHERE DetailCommande.Refprod = (SELECT Refprod FROM Produit ORDER BY PrixUnit DESC LIMIT 1);
-->

**2. Afficher les employés qui ont traité au moins 20 commandes**

Listez les employés ayant géré 20 commandes ou plus.

<!-- expected-query: Q2
SELECT Employe.Nom, Employe.Prenom, COUNT(Commande.NoCom) AS NbCommandes FROM Employe JOIN Commande ON Employe.NoEmp = Commande.NoEmp GROUP BY Employe.NoEmp, Employe.Nom, Employe.Prenom HAVING COUNT(Commande.NoCom) >= 20;
-->

**3. Lister les produits dont le prix est supérieur au prix moyen de leur catégorie**

Utilisez une sous-requête pour comparer avec la moyenne de la catégorie.

<details>
<summary>💡 Indice</summary>
Calculez la moyenne des prix par CodeCateg en sous-requête, puis comparez PrixUnit de chaque produit à la moyenne de sa catégorie.
</details>

<!-- expected-query: Q3
SELECT P.Nomprod, P.PrixUnit, P.CodeCateg FROM Produit P WHERE P.PrixUnit > (SELECT AVG(P2.PrixUnit) FROM Produit P2 WHERE P2.CodeCateg = P.CodeCateg);
-->

**4. Trouver les clients qui n'ont jamais commandé un produit spécifique (ex: Refprod = "123")**

Utilisez une sous-requête avec NOT IN.

<!-- expected-query: Q4
SELECT Societe FROM Client WHERE CodeCli NOT IN (SELECT DISTINCT CodeCli FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom WHERE Refprod = 1);
-->

**5. Lister les produits commandés par tous les clients (couverture client totale)**

Trouvez les produits présents dans toutes les commandes clients.

<details>
<summary>💡 Indice</summary>
Comptez le nombre de clients distincts ayant commandé chaque produit ; comparez avec le nombre total de clients. Utilisez HAVING COUNT(DISTINCT CodeCli) = (SELECT COUNT(DISTINCT CodeCli) FROM Commande).
</details>

<!-- expected-query: Q5
SELECT Produit.Nomprod FROM Produit JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod JOIN Commande ON DetailCommande.NoCom = Commande.NoCom GROUP BY Produit.Refprod, Produit.Nomprod HAVING COUNT(DISTINCT Commande.CodeCli) = (SELECT COUNT(DISTINCT CodeCli) FROM Commande);
-->

**6. Afficher le client qui a dépensé le plus d'argent en achats**

Calculez le total par client et trouvez le maximum.

<details>
<summary>💡 Indice</summary>
Calculez SUM(PrixUnit * Qte * (1 - Remise)) par CodeCli, puis trouvez le maximum avec une sous-requête MAX().
</details>

<!-- expected-query: Q6
SELECT Client.Societe, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS TotalDepense FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Client.CodeCli, Client.Societe ORDER BY TotalDepense DESC LIMIT 1;
-->

**7. Afficher les clients ayant une première commande datant de plus de 1 an**

Calculez la date de première commande pour chaque client.

<!-- expected-query: Q7
SELECT Client.Societe, MIN(Commande.DateCom) AS PremiereCommande FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli GROUP BY Client.CodeCli, Client.Societe HAVING JULIANDAY('now') - JULIANDAY(MIN(Commande.DateCom)) > 365;
-->

**8. Lister les catégories dont le prix moyen dépasse le prix moyen global**

Comparez la moyenne par catégorie avec la moyenne générale.

<details>
<summary>💡 Indice</summary>
Calculez AVG(PrixUnit) par CodeCateg ; comparez avec la moyenne générale de tous les produits via une sous-requête (SELECT AVG(PrixUnit) FROM Produit).
</details>

<!-- expected-query: Q8
SELECT Categorie.NomCateg, ROUND(AVG(Produit.PrixUnit), 2) AS PrixMoyenCateg FROM Produit JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg GROUP BY Categorie.CodeCateg, Categorie.NomCateg HAVING AVG(Produit.PrixUnit) > (SELECT AVG(PrixUnit) FROM Produit);
-->

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
