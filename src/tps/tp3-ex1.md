---
layout: base.njk
title: "Exercice 1 : Jointures"
intitule: "TP 3 - Jointures et sous-requêtes"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 1
titre: "Exercice 1 : Jointures"
permalink: "/tp3/exercice1/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 1 : Jointures

## Questions

**1. Afficher toutes les commandes avec les informations du client et de l'employé**

Pour chaque commande, affichez le numéro, la date, le nom du client et le nom de l'employé qui l'a traitée.

<!-- expected-query: Q1
SELECT Commande.NoCom, Commande.DateCom, Client.Societe AS Client, (Employe.Nom || ' ' || Employe.Prenom) AS Employe FROM Commande JOIN Client ON Commande.CodeCli = Client.CodeCli JOIN Employe ON Commande.NoEmp = Employe.NoEmp;
-->

**2. Lister tous les produits avec leur catégorie et leur fournisseur**

Affichez le nom du produit, le nom de la catégorie et le nom du fournisseur.

<!-- expected-query: Q2
SELECT Produit.Nomprod, Categorie.NomCateg, Fournisseur.Societe AS Fournisseur FROM Produit JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg JOIN Fournisseur ON Produit.NoFour = Fournisseur.NoFour;
-->

**3. Afficher les détails de toutes les commandes avec les noms des produits**

Pour chaque ligne de commande, affichez le numéro de commande, la référence du produit et son nom.

<!-- expected-query: Q3
SELECT DetailCommande.NoCom, DetailCommande.Refprod, Produit.Nomprod FROM DetailCommande JOIN Produit ON DetailCommande.Refprod = Produit.Refprod;
-->

**4. Trouver les clients qui n'ont jamais commandé (LEFT JOIN)**

Affichez les clients (societe) de la base qui n'ont aucune commande enregistrée.

<details>
<summary>💡 Indice</summary>

Pensez au LEFT JOIN qui conserve toutes les lignes de la table de gauche, même sans correspondance.
</details>

<!-- expected-query: Q4
SELECT Client.Societe FROM Client LEFT JOIN Commande ON Client.CodeCli = Commande.CodeCli WHERE Commande.NoCom IS NULL;
-->

**5. Afficher tous les produits, qu'ils aient été commandés ou non**

Affichez le nom du produit et le nombre de fois qu'il a été commandé et 0 si le produit n'a jamais été commandé (ne confondez pas avec le champs uniteCom).

<!-- expected-query: Q5
SELECT Produit.Nomprod, COUNT(DetailCommande.NoCom) AS NbCommandes FROM Produit LEFT JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod GROUP BY Produit.Refprod, Produit.Nomprod;
-->

**6. Lister les employés et leurs responsables**

Pour chaque employé, affichez son nom et le nom de son responsable.
Regardez bien le schéma de la table Employe pour comprendre comment les employés sont liés à leurs responsables.

<details>
<summary>💡 Indice</summary>
Les responsables sont aussi des employés.
Joignez la table Employe avec elle-même en utilisant deux alias différents. 
</details>

<!-- expected-query: Q6
SELECT E.Nom AS Employe, Chef.Nom AS Responsable FROM Employe E LEFT JOIN Employe Chef ON E.RendCompteA = Chef.NoEmp;
-->

**7. Afficher les commandes groupées avec client, employé, et informations complètes**

Pour chaque commande : client, employé, nombre de produits et montant total (avec remise).

<!-- expected-query: Q7
SELECT Commande.NoCom, Client.Societe AS Client, Employe.Nom AS Employe, COUNT(DetailCommande.Refprod) AS NbProduits, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS MontantTotal FROM Commande JOIN Client ON Commande.CodeCli = Client.CodeCli JOIN Employe ON Commande.NoEmp = Employe.NoEmp JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Commande.NoCom, Client.Societe, Employe.Nom;
-->

**8. Trouver les clients et les fournisseurs du même pays**

Affichez les paires client-fournisseur pour chaque pays.

<!-- expected-query: Q8
SELECT DISTINCT Client.Pays, Client.Societe AS Client, Fournisseur.Societe AS Fournisseur FROM Client JOIN Fournisseur ON Client.Pays = Fournisseur.Pays;
-->

**9. Afficher les commandes avec délai de livraison**

Affichez le numéro de commande, la date de commande, la date de livraison et le délai en jours.

<!-- expected-query: Q9
SELECT NoCom, DateCom, DateEnv AS DateLivraison, CAST(JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS INT) AS DelaiJours FROM Commande WHERE DateEnv IS NOT NULL;
-->

**10. Créer un résumé complet : client → commandes → produits avec tous les détails**

Affichez pour chaque commande : Societe, DateCom, NoCom, Nomprod, Qte, Remise, montant ligne.

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

