---
layout: base.njk
title: "Exercice 4 : Bonus - Requêtes complexes"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 4
titre: "Exercice 4 : Bonus - Requêtes complexes"
permalink: "/tp1/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Requêtes complexes

## Questions bonus

Ces questions combinent les notions vues dans les exercices précédents. À faire uniquement si vous avez le temps !

**1. Lister tous les produits non disponibles commandés au moins une fois**

Affichez les produits marqués comme indisponibles (Indisponible = 1) mais qui ont quand même été commandés.

<!-- expected-query: Q1
SELECT DISTINCT Produit.Refprod, Produit.Nomprod FROM Produit JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod WHERE Produit.Indisponible = 1;
-->

**2. Calculer pour chaque client le montant total de ses commandes avec remise appliquée**

Affichez le nom du client et le montant total avec les remises déduites.

<!-- expected-query: Q2
SELECT Client.CodeCli, Client.Societe, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS MontantTotal FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Client.CodeCli, Client.Societe;
-->

**3. Trouver les fournisseurs dont les prix moyens sont supérieurs à la moyenne générale des prix**

Affichez le nom du fournisseur et le prix moyen de ses produits.

<!-- expected-query: Q3
SELECT Fournisseur.Societe, ROUND(AVG(Produit.PrixUnit), 2) AS PrixMoyen FROM Fournisseur JOIN Produit ON Fournisseur.NoFour = Produit.NoFour GROUP BY Fournisseur.NoFour, Fournisseur.Societe HAVING AVG(Produit.PrixUnit) > (SELECT AVG(PrixUnit) FROM Produit);
-->

**4. Lister les pays qui ont au moins un client ET un fournisseur**

Affichez les pays où l'entreprise a une présence commerciale complète.

<details>
<summary>💡 Indice</summary>

Pensez à l'opérateur `INTERSECT` pour trouver les valeurs communes entre deux ensembles.
</details>

<!-- expected-query: Q4
SELECT Pays FROM Client INTERSECT SELECT Pays FROM Fournisseur;
-->

**5. Pour chaque mois de commande, calculer le montant moyen des commandes et le nombre de commandes**

Affichez le mois, le nombre de commandes et le montant moyen.

<!-- expected-query: Q5
SELECT strftime('%Y-%m', Commande.DateCom) AS Mois, COUNT(DISTINCT Commande.NoCom) AS NbCommandes, ROUND(AVG(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS MontantMoyen FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Mois;
-->

**6. Trouver les produits commandés par tous les clients (ou au moins 90% des clients)**

Quel produit a la couverture client la plus large ?

<!-- expected-query: Q6
SELECT Produit.Nomprod, COUNT(DISTINCT Commande.CodeCli) AS NbClients FROM Produit JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod JOIN Commande ON DetailCommande.NoCom = Commande.NoCom GROUP BY Produit.Refprod, Produit.Nomprod ORDER BY NbClients DESC;
-->

**7. Afficher les clients qui ont commandé au moins une fois tous les produits d'une catégorie donnée**

Par exemple, tous les clients ayant commandé au moins une fois TOUS les produits de la catégorie 1.

<!-- expected-query: Q7
SELECT Client.CodeCli, Client.Societe FROM Client WHERE NOT EXISTS (SELECT Refprod FROM Produit WHERE CodeCateg = 1 EXCEPT SELECT DetailCommande.Refprod FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom WHERE Commande.CodeCli = Client.CodeCli);
-->

**8. Calculer pour chaque employé son nombre de commandes, le montant total géré et sa performance par rapport à la moyenne**

Affichez le nom de l'employé, son nombre de commandes et un indicateur "Au-dessus/En-dessous de la moyenne".

<!-- expected-query: Q8
SELECT Employe.Nom, Employe.Prenom, COUNT(Commande.NoCom) AS NbCommandes FROM Employe LEFT JOIN Commande ON Employe.NoEmp = Commande.NoEmp GROUP BY Employe.NoEmp, Employe.Nom, Employe.Prenom;
-->

**9. Trouver les paires client-fournisseur : clients ayant commandé au moins un produit d'un fournisseur donné**

Affichez pour chaque client tous les fournisseurs dont il a acheté des produits.

<!-- expected-query: Q9
SELECT DISTINCT Client.Societe AS Client, Fournisseur.Societe AS Fournisseur FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom JOIN Produit ON DetailCommande.Refprod = Produit.Refprod JOIN Fournisseur ON Produit.NoFour = Fournisseur.NoFour;
-->

**10. Calculer le Top 5 des meilleures ventes en montant, avec le ratio par rapport au montant total**

Affichez les 5 produits générant le plus de chiffre d'affaires et leur % du CA total.

<!-- expected-query: Q10
SELECT Produit.Nomprod, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS ChiffreAffaires FROM Produit JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod GROUP BY Produit.Refprod, Produit.Nomprod ORDER BY ChiffreAffaires DESC LIMIT 5;
-->

## Rappel de cours

### Agrégation (GROUP BY)

Permet de regrouper les lignes ayant des valeurs communes.

```sql
-- Compter le nombre de produits par catégorie
SELECT CodeCateg, COUNT(*) 
FROM Produit 
GROUP BY CodeCateg;
```

### Filtrer sur les groupes (HAVING)

`WHERE` filtre les lignes avant le regroupement, `HAVING` filtre les groupes après.

```sql
-- Catégories ayant plus de 10 produits
SELECT CodeCateg, COUNT(*) 
FROM Produit 
GROUP BY CodeCateg 
HAVING COUNT(*) > 10;
```

### Jointures (JOIN)

Permet de combiner des données de plusieurs tables.

```sql
-- Récupérer les produits avec le nom de leur catégorie
SELECT Produit.NomProd, Categorie.NomCateg
FROM Produit
JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg;
```

### Opérateurs ensemblistes

```sql
-- INTERSECT : Valeurs communes aux deux requêtes
SELECT Pays FROM Client
INTERSECT
SELECT Pays FROM Fournisseur;
```
