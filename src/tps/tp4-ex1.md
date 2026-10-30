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

Cet exercice permet de valider rapidement chaque grande famille de jointure vue en cours et TD : jointure interne multi-tables (`INNER JOIN`), anti-jointure externe (`LEFT JOIN ... IS NULL`), jointure externe avec agrégat (`LEFT JOIN` + `COUNT`), auto-jointure hiérarchique et jointure sur attribut non-clé.

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

**2. Identifier les clients sans aucune commande**

Affichez la raison sociale (colonne `Societe`) des clients de la base pour lesquels aucune commande n'a encore été enregistrée.

<details>
<summary>💡 Indice</summary>

Une jointure externe (`LEFT JOIN`) combinée à un test sur une valeur inexistante (`IS NULL`) permet d'isoler les lignes de la table de gauche sans correspondance à droite.
</details>

<!-- expected-query: Q2
SELECT Client.Societe FROM Client LEFT JOIN Commande ON Client.CodeCli = Commande.CodeCli WHERE Commande.NoCom IS NULL;
-->

**3. Dénombrer les commandes pour chaque produit du catalogue**

Affichez pour chaque produit son nom (`Nomprod`) ainsi que le nombre de fois où il a été commandé sous l'alias `NbCommandes`. Veillez à ce que les produits n'ayant jamais été commandés figurent bien dans le résultat avec la valeur `0`.

<details>
<summary>💡 Indice</summary>

Attention : après une jointure externe, `COUNT(*)` compte la ligne même si ses attributs de droite sont nuls (affichant 1 au lieu de 0). Pour obtenir 0 sur les éléments non commandés, appliquez `COUNT(DetailCommande.NoCom)` sur une colonne issue de la table liée.
</details>

<!-- expected-query: Q3
SELECT Produit.Nomprod, COUNT(DetailCommande.NoCom) AS NbCommandes FROM Produit LEFT JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod GROUP BY Produit.Refprod, Produit.Nomprod;
-->

**4. Établir l'organigramme des employés et de leurs responsables**

Pour chaque employé, affichez son nom de famille sous l'alias `Employe` ainsi que le nom de famille de son supérieur hiérarchique sous l'alias `Responsable`. L'employé au sommet de la hiérarchie (qui ne rend compte à personne) doit également apparaître, avec une valeur nulle pour son responsable.

<details>
<summary>💡 Indice</summary>

Les responsables sont eux-mêmes des enregistrements de la table `Employe` : utilisez une auto-jointure externe (`LEFT JOIN`) avec deux alias de table distincts.
</details>

<!-- expected-query: Q4
SELECT E.Nom AS Employe, Chef.Nom AS Responsable FROM Employe E LEFT JOIN Employe Chef ON E.RendCompteA = Chef.NoEmp;
-->

**5. Associer les clients et les fournisseurs implantés dans un même pays**

Identifiez les synergies géographiques en affichant sans doublon le pays (`Pays`), la raison sociale du client sous l'alias `Client` et la raison sociale du fournisseur sous l'alias `Fournisseur` pour toutes les paires partageant le même pays d'implantation.

<!-- expected-query: Q5
SELECT DISTINCT Client.Pays, Client.Societe AS Client, Fournisseur.Societe AS Fournisseur FROM Client JOIN Fournisseur ON Client.Pays = Fournisseur.Pays;
-->

## Rappel de cours

### Jointure Interne (`INNER JOIN` / `JOIN`)

Ne retourne que les lignes qui ont une correspondance dans les deux tables :

```sql
SELECT Client.Societe, Commande.DateCom
FROM Client
JOIN Commande ON Client.CodeCli = Commande.CodeCli;
```

### Jointure Externe (`LEFT JOIN`)

Retourne toutes les lignes de la table de gauche, même s'il n'y a pas de correspondance à droite (les colonnes de droite valent alors `NULL`) :

```sql
SELECT Client.Societe, Commande.NoCom
FROM Client
LEFT JOIN Commande ON Client.CodeCli = Commande.CodeCli;
```

### Auto-jointure (`Self-Join`)

Permet de joindre une table avec elle-même en lui donnant deux alias distincts :

```sql
SELECT E.Nom AS Employe, Chef.Nom AS Responsable
FROM Employe E
LEFT JOIN Employe Chef ON E.RendCompteA = Chef.NoEmp;
```
