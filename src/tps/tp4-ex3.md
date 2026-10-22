---
layout: base.njk
title: "Exercice 3 : Bonus - Requêtes très complexes"
intitule: "TP 4 — Jointures Multi-Tables & Sous-Requêtes"
base: "Comptoir2000.sqlite"
tpNum: 4
exerciceNum: 3
titre: "Exercice 3 : Bonus - Requêtes très complexes"
permalink: "/tp4/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Bonus - Requêtes plus complexes

## Questions bonus

Combinez jointures avancées, sous-requêtes corrélées et agrégations complexes. À faire si vous avez le temps après avoir terminé les exercices précédents.

**1. Dénombrer la diversité du portefeuille client par employé**

Pour chaque employé, affichez son nom (`Nom`), son prénom (`Prenom`) et le nombre de clients distincts pour lesquels il a traité au moins une commande, sous l'alias `NbClientsDistincts`. Triez les résultats par ordre croissant de ce nombre de clients.

<!-- expected-query: Q1
SELECT Employe.Nom, Employe.Prenom, COUNT(DISTINCT Commande.CodeCli) AS NbClientsDistincts FROM Employe JOIN Commande ON Employe.NoEmp = Commande.NoEmp GROUP BY Employe.NoEmp, Employe.Nom, Employe.Prenom ORDER BY NbClientsDistincts ASC;
-->

**2. Calculer un indice de fréquence d'achat par client**

Pour chaque client (`CodeCli`), déterminez son indice de fréquence d'achat sous l'alias `CoeffFidelite` (défini par le rapport entre son nombre total de commandes et le nombre de jours écoulés entre sa première et sa dernière commande augmenté de 1). Arrondissez cet indice à 4 décimales. Triez par indice décroissant.

<!-- expected-query: Q2
SELECT CodeCli, ROUND(CAST(COUNT(NoCom) AS FLOAT) / (JULIANDAY(MAX(DateCom)) - JULIANDAY(MIN(DateCom)) + 1), 4) AS CoeffFidelite FROM Commande GROUP BY CodeCli ORDER BY CoeffFidelite DESC;
-->

**3. Évolution mensuelle du chiffre d'affaires par catégorie de produits**

Affichez pour chaque mois de commande (format 'AAAA-MM' sous l'alias `Mois`) et chaque nom de catégorie (`NomCateg`) le chiffre d'affaires total facturé (montant net après remises), arrondi à 2 décimales sous l'alias `CA_Categorie`. Triez chronologiquement par mois.

<!-- expected-query: Q3
SELECT STRFTIME('%Y-%m', Commande.DateCom) AS Mois, Categorie.NomCateg, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS CA_Categorie FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom JOIN Produit ON DetailCommande.Refprod = Produit.Refprod JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg GROUP BY Mois, Categorie.CodeCateg, Categorie.NomCateg ORDER BY Mois;
-->

**4. Estimer l'intervalle moyen de réapprovisionnement par client**

Pour les clients ayant passé strictement plus d'une commande, affichez le code client (`CodeCli`), son nombre total de commandes sous l'alias `NbCommandes`, ainsi que l'intervalle moyen entre deux commandes successives en jours (délai total entre sa première et sa dernière commande divisé par son nombre de commandes moins une), arrondi à 1 décimale sous l'alias `DelaiMoyenReappro`.

<!-- expected-query: Q4
SELECT CodeCli, COUNT(NoCom) AS NbCommandes, ROUND((JULIANDAY(MAX(DateCom)) - JULIANDAY(MIN(DateCom))) / NULLIF(COUNT(NoCom) - 1, 0), 1) AS DelaiMoyenReappro FROM Commande GROUP BY CodeCli HAVING COUNT(NoCom) > 1;
-->

**5. Cartographie de la chaîne de distribution par fournisseur**

Pour chaque fournisseur de l'entreprise, affichez :
- La raison sociale du fournisseur (colonne `Societe`) sous l'alias `Fournisseur`
- Le nombre de produits distincts référencés sous l'alias `NbProduits`
- Le nombre de commandes distinctes dans lesquelles au moins un de ses produits a été acheté, sous l'alias `NbCommandes`
- Le nombre de clients distincts ayant commandé ses produits, sous l'alias `NbClientsDistincts`

<!-- expected-query: Q5
SELECT Fournisseur.Societe AS Fournisseur, COUNT(DISTINCT Produit.Refprod) AS NbProduits, COUNT(DISTINCT DetailCommande.NoCom) AS NbCommandes, COUNT(DISTINCT Commande.CodeCli) AS NbClientsDistincts FROM Fournisseur JOIN Produit ON Fournisseur.NoFour = Produit.NoFour LEFT JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod LEFT JOIN Commande ON DetailCommande.NoCom = Commande.NoCom GROUP BY Fournisseur.NoFour, Fournisseur.Societe;
-->

**6. Volume d'affaires généré par couple employé-client**

Pour chaque employé et chaque client avec lequel il a interagi, affichez l'identifiant de l'employé (`NoEmp`), son nom de famille sous l'alias `NomEmploye`, le code du client (`CodeCli`), et le montant total net facturé à ce client sous l'alias `MontantTotalClient` (arrondi à 2 décimales). Triez par identifiant d'employé puis par montant d'achats décroissant.

<!-- expected-query: Q6
SELECT Commande.NoEmp, Employe.Nom AS NomEmploye, Commande.CodeCli, ROUND(SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS MontantTotalClient FROM Commande JOIN Employe ON Commande.NoEmp = Employe.NoEmp JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Commande.NoEmp, Employe.Nom, Commande.CodeCli ORDER BY Commande.NoEmp, MontantTotalClient DESC;
-->

**7. Identifier les paires de clients d'un même pays ayant acheté des produits identiques**

Recherchez les clients situés dans le même pays qui ont commandé au moins un produit en commun. Affichez sans doublon le nom du premier client sous l'alias `Client1`, le nom du second client sous l'alias `Client2`, et leur pays d'implantation commun (`Pays`). Évitez les auto-associations et les doublons symétriques en imposant que le code du premier client soit strictement inférieur à celui du second.

<details>
<summary>💡 Indice</summary>

Pour former des paires sans générer de doublons inversés (A avec B, puis B avec A) ni associer un enregistrement avec lui-même, appliquez une inégalité stricte sur les identifiants (`Id1 < Id2`).
</details>

<!-- expected-query: Q7
SELECT DISTINCT C1.Societe AS Client1, C2.Societe AS Client2, C1.Pays FROM Client C1 JOIN Client C2 ON C1.Pays = C2.Pays AND C1.CodeCli < C2.CodeCli JOIN Commande Com1 ON C1.CodeCli = Com1.CodeCli JOIN DetailCommande D1 ON Com1.NoCom = D1.NoCom JOIN Commande Com2 ON C2.CodeCli = Com2.CodeCli JOIN DetailCommande D2 ON Com2.NoCom = D2.NoCom AND D1.Refprod = D2.Refprod;
-->

**8. Détecter les commandes avec volumes d'achat atypiques**

Identifiez les lignes de commande exceptionnelles : affichez le numéro de commande (`NoCom`), la référence du produit (`Refprod`), le nom du produit (`Nomprod`) et la quantité commandée (`Qte`), pour toutes les lignes dont la quantité commandée est strictement supérieure au double de la quantité moyenne commandée pour ce même produit.

<!-- expected-query: Q8
SELECT DetailCommande.NoCom, DetailCommande.Refprod, Produit.Nomprod, DetailCommande.Qte FROM DetailCommande JOIN Produit ON DetailCommande.Refprod = Produit.Refprod WHERE DetailCommande.Qte > (SELECT AVG(Qte) * 2 FROM DetailCommande D2 WHERE D2.Refprod = DetailCommande.Refprod);
-->

**9. Découvrir les paires de produits fréquemment commandés ensemble**

Identifiez les affinités entre produits : pour chaque paire de produits différents commandés ensemble dans au moins 5 commandes distinctes, affichez :
- La référence du premier produit sous l'alias `Prod1`
- Le nom du premier produit sous l'alias `NomProd1`
- La référence du second produit sous l'alias `Prod2`
- Le nom du second produit sous l'alias `NomProd2`
- Le nombre de commandes distinctes contenant cette paire, sous l'alias `NbCommandesEnsemble`

Évitez les paires en double en imposant que la référence du premier produit soit strictement inférieure à celle du second. Triez par nombre de commandes en commun décroissant.

<!-- expected-query: Q9
SELECT D1.Refprod AS Prod1, P1.Nomprod AS NomProd1, D2.Refprod AS Prod2, P2.Nomprod AS NomProd2, COUNT(DISTINCT D1.NoCom) AS NbCommandesEnsemble FROM DetailCommande D1 JOIN DetailCommande D2 ON D1.NoCom = D2.NoCom AND D1.Refprod < D2.Refprod JOIN Produit P1 ON D1.Refprod = P1.Refprod JOIN Produit P2 ON D2.Refprod = P2.Refprod GROUP BY D1.Refprod, D2.Refprod, P1.Nomprod, P2.Nomprod HAVING COUNT(DISTINCT D1.NoCom) >= 5 ORDER BY NbCommandesEnsemble DESC;
-->

## Rappel de cours

### Stratégie pour requêtes complexes

1. **Décomposer le problème** : Ne cherchez pas à tout écrire d'un coup.
2. **Commencer par le "FROM"** : Quelles tables contiennent les données ? Comment sont-elles liées ?
3. **Filtrer (WHERE)** : Quelles lignes garder ?
4. **Grouper (GROUP BY)** : Quel est le niveau de détail (par client, par mois...) ?
5. **Filtrer les groupes (HAVING)** : Conditions sur les agrégats ?
6. **Trier (ORDER BY)** : Ordre final ?

### Exemple de structure complexe

```sql
SELECT C.Societe, COUNT(O.NoCom) AS NbCommandes
FROM Client C
LEFT JOIN Commande O ON C.CodeCli = O.CodeCli
WHERE C.Pays = 'France'
GROUP BY C.Societe
HAVING COUNT(O.NoCom) > 10
ORDER BY NbCommandes DESC;
```

