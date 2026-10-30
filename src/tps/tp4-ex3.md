---
layout: base.njk
title: "Exercice 3 : Synthèse — Jointures, Agrégats & Sous-requêtes"
intitule: "TP 4 — Jointures Multi-Tables & Sous-Requêtes"
base: "Comptoir2000.sqlite"
tpNum: 4
exerciceNum: 3
titre: "Exercice 3 : Synthèse — Jointures, Agrégats & Sous-requêtes"
permalink: "/tp4/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Synthèse — Jointures, Agrégats & Sous-requêtes

Cet exercice est le **cœur du TP**. Il combine les jointures multi-tables (`JOIN` et `LEFT JOIN`), les agrégations financières et temporelles (`SUM`, `COUNT(DISTINCT ...)`, `STRFTIME`) et les sous-requêtes corrélées. Tout le monde doit le réaliser avant de passer aux défis bonus.

## Questions

**1. Synthèse financière des commandes avec détails client et employé**

Pour chaque commande enregistrée, affichez :
- Le numéro de commande (`NoCom`)
- La raison sociale du client sous l'alias `Client`
- Le nom de famille de l'employé sous l'alias `Employe`
- Le nombre de lignes d'articles commandés sous l'alias `NbProduits`
- Le montant net total de la commande (remises appliquées), arrondi à 2 décimales sous l'alias `MontantTotal`

<!-- expected-query: Q1
SELECT Commande.NoCom, Client.Societe AS Client, Employe.Nom AS Employe, COUNT(DetailCommande.Refprod) AS NbProduits, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS MontantTotal FROM Commande JOIN Client ON Commande.CodeCli = Client.CodeCli JOIN Employe ON Commande.NoEmp = Employe.NoEmp JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Commande.NoCom, Client.Societe, Employe.Nom;
-->

**2. Évolution mensuelle du chiffre d'affaires par catégorie de produits**

Affichez pour chaque mois de commande (format `'AAAA-MM'` sous l'alias `Mois`) et chaque nom de catégorie (`NomCateg`) le chiffre d'affaires total facturé (montant net après remises), arrondi à 2 décimales sous l'alias `CA_Categorie`. Triez chronologiquement par mois.

<!-- expected-query: Q2
SELECT STRFTIME('%Y-%m', Commande.DateCom) AS Mois, Categorie.NomCateg, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS CA_Categorie FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom JOIN Produit ON DetailCommande.Refprod = Produit.Refprod JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg GROUP BY Mois, Categorie.CodeCateg, Categorie.NomCateg ORDER BY Mois;
-->

**3. Cartographie de la chaîne de distribution par fournisseur**

Pour chaque fournisseur de l'entreprise, affichez :
- La raison sociale du fournisseur (colonne `Societe`) sous l'alias `Fournisseur`
- Le nombre de produits distincts référencés sous l'alias `NbProduits`
- Le nombre de commandes distinctes dans lesquelles au moins un de ses produits a été acheté, sous l'alias `NbCommandes`
- Le nombre de clients distincts ayant commandé ses produits, sous l'alias `NbClientsDistincts`

<details>
<summary>💡 Indice</summary>

Utilisez des jointures externes (`LEFT JOIN`) vers `DetailCommande` et `Commande` combinées à `COUNT(DISTINCT ...)` pour ne perdre aucun produit ni aucun fournisseur.
</details>

<!-- expected-query: Q3
SELECT Fournisseur.Societe AS Fournisseur, COUNT(DISTINCT Produit.Refprod) AS NbProduits, COUNT(DISTINCT DetailCommande.NoCom) AS NbCommandes, COUNT(DISTINCT Commande.CodeCli) AS NbClientsDistincts FROM Fournisseur JOIN Produit ON Fournisseur.NoFour = Produit.NoFour LEFT JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod LEFT JOIN Commande ON DetailCommande.NoCom = Commande.NoCom GROUP BY Fournisseur.NoFour, Fournisseur.Societe;
-->

**4. Détecter les lignes de commande avec volumes d'achat atypiques**

Identifiez les lignes de commande exceptionnelles : affichez le numéro de commande (`NoCom`), la référence du produit (`Refprod`), le nom du produit (`Nomprod`) et la quantité commandée (`Qte`), pour toutes les lignes dont la quantité commandée est strictement supérieure au double de la quantité moyenne commandée pour ce même produit.

<!-- expected-query: Q4
SELECT DetailCommande.NoCom, DetailCommande.Refprod, Produit.Nomprod, DetailCommande.Qte FROM DetailCommande JOIN Produit ON DetailCommande.Refprod = Produit.Refprod WHERE DetailCommande.Qte > (SELECT AVG(Qte) * 2 FROM DetailCommande D2 WHERE D2.Refprod = DetailCommande.Refprod);
-->

## Rappel de cours

### Méthodologie pour requêtes multi-tables avec agrégats

1. **Identifier le chemin de jointure (`FROM ... JOIN ...`)** : Reliez les tables de proche en proche via leurs clés primaires/étrangères (`Client` -> `Commande` -> `DetailCommande` -> `Produit` -> `Categorie`).
2. **Choisir `INNER JOIN` ou `LEFT JOIN`** : Utilisez `LEFT JOIN` dès que vous souhaitez conserver les entités qui n'ont pas encore d'historique de vente.
3. **Éviter la multiplication des comptages (`COUNT(DISTINCT ...)`)** : Lorsqu'on joint plusieurs tables de détail, une même commande ou un même produit apparaît sur plusieurs lignes ; utilisez `COUNT(DISTINCT ColonneCle)` pour compter les entités uniques.
4. **Grouper (`GROUP BY`)** : Regroupez sur la clé primaire et les colonnes descriptives affichées dans le `SELECT`.
