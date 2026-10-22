---
layout: base.njk
title: "Exercice 2 : Sous-requêtes"
intitule: "TP 4 — Jointures Multi-Tables & Sous-Requêtes"
base: "Comptoir2000.sqlite"
tpNum: 4
exerciceNum: 2
titre: "Exercice 2 : Sous-requêtes"
permalink: "/tp4/exercice2/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 2 : Sous-requêtes

## Questions

**1. Afficher les clients ayant commandé le produit le plus cher**

Affichez sans doublon le nom des sociétés clientes (colonne `Societe`) ayant commandé le produit ayant le prix unitaire le plus élevé du catalogue.

<details>
<summary>💡 Indice</summary>

Décomposez votre raisonnement : utilisez d'abord une sous-requête pour isoler la référence du produit le plus cher, puis utilisez ce résultat comme critère de filtre pour retrouver les clients.
</details>

<!-- expected-query: Q1
SELECT DISTINCT Client.Societe FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom WHERE DetailCommande.Refprod = (SELECT Refprod FROM Produit ORDER BY PrixUnit DESC LIMIT 1);
-->

**2. Afficher les employés ayant traité au moins 20 commandes**

Affichez le nom, le prénom et le nombre de commandes traitées sous l'alias `NbCommandes` pour les employés ayant pris en charge 20 commandes ou plus.

<!-- expected-query: Q2
SELECT Employe.Nom, Employe.Prenom, COUNT(Commande.NoCom) AS NbCommandes FROM Employe JOIN Commande ON Employe.NoEmp = Commande.NoEmp GROUP BY Employe.NoEmp, Employe.Nom, Employe.Prenom HAVING COUNT(Commande.NoCom) >= 20;
-->

**3. Lister les produits plus chers que la moyenne de leur propre catégorie**

Affichez le nom du produit (`Nomprod`), son prix unitaire (`PrixUnit`) et son code de catégorie (`CodeCateg`), pour tous les produits dont le prix unitaire est strictement supérieur au prix moyen des produits de leur catégorie.

<details>
<summary>💡 Indice</summary>

Une sous-requête corrélée permet de recalculer la moyenne des prix pour la catégorie spécifique du produit actuellement évalué dans la requête principale.
</details>

<!-- expected-query: Q3
SELECT P.Nomprod, P.PrixUnit, P.CodeCateg FROM Produit P WHERE P.PrixUnit > (SELECT AVG(P2.PrixUnit) FROM Produit P2 WHERE P2.CodeCateg = P.CodeCateg);
-->

**4. Identifier les clients n'ayant jamais commandé le produit n° 1**

Affichez le nom (colonne `Societe`) des clients qui n'ont jamais commandé le produit de référence 1 (`Refprod = 1`).

<!-- expected-query: Q4
SELECT Societe FROM Client WHERE CodeCli NOT IN (SELECT DISTINCT CodeCli FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom WHERE Refprod = 1);
-->

**5. Lister les produits commandés par tous les clients sans exception**

Trouvez les produits plébiscités par l'ensemble de la clientèle : affichez le nom des produits (`Nomprod`) commandés par l'intégralité des clients ayant passé au moins une commande sur la plateforme.

<details>
<summary>💡 Indice</summary>

Pour vérifier qu'un produit a été commandé par tous les clients, comparez le nombre de clients distincts l'ayant acheté au nombre total de clients distincts ayant passé au moins une commande.
</details>

<!-- expected-query: Q5
SELECT Produit.Nomprod FROM Produit JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod JOIN Commande ON DetailCommande.NoCom = Commande.NoCom GROUP BY Produit.Refprod, Produit.Nomprod HAVING COUNT(DISTINCT Commande.CodeCli) = (SELECT COUNT(DISTINCT CodeCli) FROM Commande);
-->

**6. Identifier le client ayant réalisé le plus grand total d'achats**

Affichez la raison sociale (`Societe`) du client qui a généré le chiffre d'affaires cumulé le plus important (montant net après déduction des remises), ainsi que ce montant total arrondi à 2 décimales sous l'alias `TotalDepense`.

<!-- expected-query: Q6
SELECT Client.Societe, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS TotalDepense FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Client.CodeCli, Client.Societe ORDER BY TotalDepense DESC LIMIT 1;
-->

**7. Cibler les clients anciens dont la première commande date de plus d'un an**

Pour chaque client dont la commande initiale date de plus de 365 jours par rapport à aujourd'hui, affichez sa raison sociale (`Societe`) et la date de sa toute première commande sous l'alias `PremiereCommande`.

<!-- expected-query: Q7
SELECT Client.Societe, MIN(Commande.DateCom) AS PremiereCommande FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli GROUP BY Client.CodeCli, Client.Societe HAVING JULIANDAY('now') - JULIANDAY(MIN(Commande.DateCom)) > 365;
-->

**8. Identifier les catégories dont le prix moyen dépasse la moyenne générale**

Affichez le nom de la catégorie (`NomCateg`) et son prix unitaire moyen arrondi à 2 décimales sous l'alias `PrixMoyenCateg`, uniquement pour les catégories dont le prix unitaire moyen est strictement supérieur au prix unitaire moyen de l'ensemble du catalogue.

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
