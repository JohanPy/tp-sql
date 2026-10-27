---
layout: base.njk
title: "Exercice 1 : Jointures"
intitule: "TP 4 — Jointures Multi-Tables & Sous-Requêtes"
base: "Comptoir2000.sqlite"
tpNum: 4
exerciceNum: 1
titre: "Exercice 1 : Jointures"
permalink: "/tp4/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Jointures

## Questions

**1. Afficher toutes les commandes avec les informations du client et de l'employé**

Pour chaque commande, affichez :
- Le numéro de commande (`NoCom`)
- La date de commande (`DateCom`)
- La raison sociale du client (colonne `Societe`) sous l'alias `Client`
- Le nom complet de l'employé ayant traité la commande (nom suivi d'un espace et du prénom) sous l'alias `Employe`

<!-- expected-query: Q1
SELECT Commande.NoCom, Commande.DateCom, Client.Societe AS Client, (Employe.Nom || ' ' || Employe.Prenom) AS Employe FROM Commande JOIN Client ON Commande.CodeCli = Client.CodeCli JOIN Employe ON Commande.NoEmp = Employe.NoEmp;
-->

**2. Lister tous les produits avec leur catégorie et leur fournisseur**

Pour chaque produit, affichez le nom du produit (`Nomprod`), le nom de sa catégorie (`NomCateg`) et la raison sociale de son fournisseur (`Societe`) sous l'alias `Fournisseur`.

<!-- expected-query: Q2
SELECT Produit.Nomprod, Categorie.NomCateg, Fournisseur.Societe AS Fournisseur FROM Produit JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg JOIN Fournisseur ON Produit.NoFour = Fournisseur.NoFour;
-->

**3. Afficher les détails de toutes les commandes avec les noms des produits**

Pour chaque ligne de détail de commande, affichez le numéro de commande (`NoCom`), la référence du produit (`Refprod`) et le nom du produit (`Nomprod`).

<!-- expected-query: Q3
SELECT DetailCommande.NoCom, DetailCommande.Refprod, Produit.Nomprod FROM DetailCommande JOIN Produit ON DetailCommande.Refprod = Produit.Refprod;
-->

**4. Identifier les clients sans aucune commande**

Affichez la raison sociale (colonne `Societe`) des clients de la base pour lesquels aucune commande n'a encore été enregistrée.

<details>
<summary>💡 Indice</summary>

Une jointure externe (`LEFT JOIN`) combinée à un test sur une valeur inexistante (`IS NULL`) permet d'isoler les lignes de la table de gauche sans correspondance à droite.
</details>

<!-- expected-query: Q4
SELECT Client.Societe FROM Client LEFT JOIN Commande ON Client.CodeCli = Commande.CodeCli WHERE Commande.NoCom IS NULL;
-->

**5. Dénombrer les commandes pour chaque produit du catalogue**

Affichez pour chaque produit son nom (`Nomprod`) ainsi que le nombre de fois où il a été commandé sous l'alias `NbCommandes`. Veillez à ce que les produits n'ayant jamais été commandés figurent bien dans le résultat avec la valeur 0.

<details>
<summary>💡 Indice</summary>

Attention : après une jointure externe, `COUNT(*)` compte la ligne même si ses attributs sont nuls (affichant 1 au lieu de 0). Pour obtenir 0 sur les éléments non commandés, appliquez `COUNT` sur une colonne issue de la table liée.
</details>

<!-- expected-query: Q5
SELECT Produit.Nomprod, COUNT(DetailCommande.NoCom) AS NbCommandes FROM Produit LEFT JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod GROUP BY Produit.Refprod, Produit.Nomprod;
-->

**6. Établir l'organigramme des employés et de leurs responsables**

Pour chaque employé, affichez son nom de famille sous l'alias `Employe` ainsi que le nom de famille de son supérieur hiérarchique sous l'alias `Responsable`. L'employé au sommet de la hiérarchie (qui ne rend compte à personne) doit également apparaître, avec une valeur nulle pour son responsable.

<details>
<summary>💡 Indice</summary>

Les responsables sont eux-mêmes des enregistrements de la table des employés (pensez à une auto-jointure avec deux alias de table distincts).
</details>

<!-- expected-query: Q6
SELECT E.Nom AS Employe, Chef.Nom AS Responsable FROM Employe E LEFT JOIN Employe Chef ON E.RendCompteA = Chef.NoEmp;
-->

**7. Synthèse des commandes avec détails client et employé**

Pour chaque commande, affichez :
- Le numéro de commande (`NoCom`)
- La raison sociale du client sous l'alias `Client`
- Le nom de l'employé sous l'alias `Employe`
- Le nombre de lignes d'articles commandés sous l'alias `NbProduits`
- Le montant net total de la commande (remises appliquées), arrondi à 2 décimales sous l'alias `MontantTotal`

<!-- expected-query: Q7
SELECT Commande.NoCom, Client.Societe AS Client, Employe.Nom AS Employe, COUNT(DetailCommande.Refprod) AS NbProduits, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS MontantTotal FROM Commande JOIN Client ON Commande.CodeCli = Client.CodeCli JOIN Employe ON Commande.NoEmp = Employe.NoEmp JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Commande.NoCom, Client.Societe, Employe.Nom;
-->

**8. Associer les clients et les fournisseurs implantés dans un même pays**

Identifiez les synergies géographiques en affichant sans doublon le pays (`Pays`), la raison sociale du client sous l'alias `Client` et la raison sociale du fournisseur sous l'alias `Fournisseur` pour toutes les paires partageant le même pays d'implantation.

<!-- expected-query: Q8
SELECT DISTINCT Client.Pays, Client.Societe AS Client, Fournisseur.Societe AS Fournisseur FROM Client JOIN Fournisseur ON Client.Pays = Fournisseur.Pays;
-->

**9. Calculer le délai d'expédition des commandes traitées**

À partir de la table `Commande`, pour les commandes déjà expédiées, affichez le numéro de commande (`NoCom`), sa date de commande (`DateCom`), sa date d'expédition (colonne `DateEnv`) sous l'alias `DateLivraison`, ainsi que le délai d'acheminement en nombre entier de jours sous l'alias `DelaiJours`.

<!-- expected-query: Q9
SELECT NoCom, DateCom, DateEnv AS DateLivraison, CAST(JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS INT) AS DelaiJours FROM Commande WHERE DateEnv IS NOT NULL;
-->

**10. Suivi détaillé du flux client-commande-produit**

Pour chaque ligne de commande passée dans l'entreprise, affichez :
- Le nom de la société cliente (`Societe`)
- La date de la commande (`DateCom`)
- Le numéro de commande (`NoCom`)
- Le nom du produit (`Nomprod`)
- La quantité commandée (`Qte`)
- Le taux de remise (`Remise`)
- Le montant net facturé de la ligne (après remise), arrondi à 2 décimales sous l'alias `MontantLigne`

<!-- expected-query: Q10
SELECT Client.Societe, Commande.DateCom, Commande.NoCom, Produit.Nomprod, DetailCommande.Qte, DetailCommande.Remise, ROUND(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise), 2) AS MontantLigne FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom JOIN Produit ON DetailCommande.Refprod = Produit.Refprod;
-->

## Rappel de cours

### Jointure Interne (INNER JOIN)

Ne retourne que les lignes qui ont une correspondance dans les deux tables.

```sql
-- Clients ayant passé au moins une commande
SELECT Client.Societe, Commande.DateCom
FROM Client
INNER JOIN Commande ON Client.CodeCli = Commande.CodeCli;
```

### Jointure Externe (LEFT JOIN)

Retourne toutes les lignes de la table de gauche, même s'il n'y a pas de correspondance à droite (les colonnes de droite seront NULL).

```sql
-- Tous les clients, avec leurs commandes s'ils en ont
SELECT Client.Societe, Commande.NoCom
FROM Client
LEFT JOIN Commande ON Client.CodeCli = Commande.CodeCli;
```

### Auto-jointure (Self-Join)

Joindre une table avec elle-même. Utile pour les hiérarchies (Employé -> Chef).

```sql
-- Employés et leur responsable
SELECT E.Nom AS Employe, Chef.Nom AS Responsable
FROM Employe E
LEFT JOIN Employe Chef ON E.RendCompteA = Chef.NoEmp;
```

