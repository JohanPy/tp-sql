---
layout: base.njk
title: "Exercice 4 : Bonus - Requêtes très complexes"
intitule: "TP 4 — Jointures Multi-Tables & Sous-Requêtes"
base: "Comptoir2000.sqlite"
tpNum: 4
exerciceNum: 4
titre: "Exercice 4 : Bonus - Requêtes très complexes"
permalink: "/tp4/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Requêtes très complexes

## Questions bonus

Ces défis s'adressent aux étudiants ayant terminé l'exercice de synthèse. Les **questions 1 à 3** explorent les auto-jointures symétriques et la division relationnelle ; les **questions 4 à 7** sont des défis transversaux complets qui croisent l'ensemble des notions des **TP 2, TP 3 et TP 4** (chaînes, dates, `CASE`, agrégations conditionnelles, jointures externes et sous-requêtes).

**1. Identifier les paires de clients d'un même pays ayant acheté des produits identiques**

Recherchez les clients situés dans le même pays qui ont commandé au moins un produit en commun. Affichez sans doublon le nom du premier client sous l'alias `Client1`, le nom du second client sous l'alias `Client2`, et leur pays d'implantation commun (`Pays`). Évitez les auto-associations et les doublons symétriques en imposant que le code du premier client soit strictement inférieur à celui du second (`C1.CodeCli < C2.CodeCli`).

<details>
<summary>💡 Indice</summary>

Pour former des paires sans générer de doublons inversés (A avec B, puis B avec A) ni associer un enregistrement avec lui-même, appliquez une inégalité stricte sur les identifiants (`C1.CodeCli < C2.CodeCli`).
</details>

<!-- expected-query: Q1
SELECT DISTINCT C1.Societe AS Client1, C2.Societe AS Client2, C1.Pays FROM Client C1 JOIN Client C2 ON C1.Pays = C2.Pays AND C1.CodeCli < C2.CodeCli JOIN Commande Com1 ON C1.CodeCli = Com1.CodeCli JOIN DetailCommande D1 ON Com1.NoCom = D1.NoCom JOIN Commande Com2 ON C2.CodeCli = Com2.CodeCli JOIN DetailCommande D2 ON Com2.NoCom = D2.NoCom AND D1.Refprod = D2.Refprod;
-->

**2. Analyse de panier : découvrir les paires de produits fréquemment commandés ensemble**

Identifiez les affinités entre produits : pour chaque paire de produits différents commandés ensemble au sein d'une même commande dans **au moins 5 commandes distinctes**, affichez :
- La référence du premier produit sous l'alias `Prod1`
- Le nom du premier produit sous l'alias `NomProd1`
- La référence du second produit sous l'alias `Prod2`
- Le nom du second produit sous l'alias `NomProd2`
- Le nombre de commandes distinctes contenant cette paire, sous l'alias `NbCommandesEnsemble`

Évitez les paires en double en imposant que la référence du premier produit soit strictement inférieure à celle du second (`D1.Refprod < D2.Refprod`). Triez par nombre de commandes en commun décroissant.

<!-- expected-query: Q2
SELECT D1.Refprod AS Prod1, P1.Nomprod AS NomProd1, D2.Refprod AS Prod2, P2.Nomprod AS NomProd2, COUNT(DISTINCT D1.NoCom) AS NbCommandesEnsemble FROM DetailCommande D1 JOIN DetailCommande D2 ON D1.NoCom = D2.NoCom AND D1.Refprod < D2.Refprod JOIN Produit P1 ON D1.Refprod = P1.Refprod JOIN Produit P2 ON D2.Refprod = P2.Refprod GROUP BY D1.Refprod, D2.Refprod, P1.Nomprod, P2.Nomprod HAVING COUNT(DISTINCT D1.NoCom) >= 5 ORDER BY NbCommandesEnsemble DESC;
-->

**3. Division relationnelle : lister les produits commandés par tous les clients suisses**

Affichez la référence (`Refprod`) et le nom (`Nomprod`) des produits qui ont été commandés par **l'intégralité des clients établis en Suisse**, sans aucune exception.

<details>
<summary>💡 Indice</summary>

Filtrez les commandes des clients suisses (`C.Pays = 'Suisse'`), regroupez par produit, puis vérifiez dans `HAVING` que le nombre de clients suisses distincts ayant acheté ce produit (`COUNT(DISTINCT C.CodeCli)`) est égal au nombre total de clients suisses répertoriés dans la table `Client`.
</details>

<!-- expected-query: Q3
SELECT P.Refprod, P.Nomprod FROM Produit P JOIN DetailCommande D ON P.Refprod = D.Refprod JOIN Commande O ON D.NoCom = O.NoCom JOIN Client C ON O.CodeCli = C.CodeCli WHERE C.Pays = 'Suisse' GROUP BY P.Refprod, P.Nomprod HAVING COUNT(DISTINCT C.CodeCli) = (SELECT COUNT(*) FROM Client WHERE Pays = 'Suisse');
-->

**4. Défi multi-TP — Audit de performance logistique des transporteurs**

En croisant les tables `Messager` et `Commande` pour les commandes expédiées (`DateEnv` non nulle), dressez le bilan comparatif de chaque transporteur :
- `Transporteur` : Le nom du messager (`NomMess`)
- `NbCommandes` : Le nombre de commandes expédiées par ce transporteur
- `DelaiMoyenJours` : Le délai moyen d'acheminement en jours (`DateEnv` moins `DateCom`), arrondi à 1 décimale
- `TauxRetardPct` : Le pourcentage de commandes livrées après la date limite (`DateEnv` strictement postérieure à `ALivAvant`), arrondi à 1 décimale
- `TotalFraisPort` : La somme totale des frais de port facturés, arrondie à 2 décimales
- `Evaluation` : `'Lent'` si le délai moyen non arrondi est strictement supérieur à 8,5 jours, et `'Rapide'` sinon

Triez par nombre de commandes décroissant.

<!-- expected-query: Q4
SELECT M.NomMess AS Transporteur, COUNT(DISTINCT O.NoCom) AS NbCommandes, ROUND(AVG(JULIANDAY(O.DateEnv) - JULIANDAY(O.DateCom)), 1) AS DelaiMoyenJours, ROUND(100.0 * SUM(CASE WHEN JULIANDAY(O.DateEnv) > JULIANDAY(O.ALivAvant) THEN 1 ELSE 0 END) / COUNT(O.NoCom), 1) AS TauxRetardPct, ROUND(SUM(O.Port), 2) AS TotalFraisPort, CASE WHEN AVG(JULIANDAY(O.DateEnv) - JULIANDAY(O.DateCom)) > 8.5 THEN 'Lent' ELSE 'Rapide' END AS Evaluation FROM Messager M JOIN Commande O ON M.NoMess = O.NoMess WHERE O.DateEnv IS NOT NULL GROUP BY M.NoMess, M.NomMess ORDER BY NbCommandes DESC;
-->

**5. Défi multi-TP — Détection des clients à frais de port disproportionnés dans leur pays**

Identifiez les clients réguliers (ayant passé **au moins 5 commandes**) dont la moyenne des frais de port par commande dépasse de plus de **50 %** la moyenne des frais de port des commandes passées par l'ensemble des clients de leur propre pays (multipliée par `1.5`).
Affichez :
- Le code client (`CodeCli`)
- La raison sociale (`Societe`)
- Le pays (`Pays`)
- Le nombre de commandes (`NbCommandes`)
- Le montant moyen des frais de port du client, arrondi à 2 décimales sous l'alias `PortMoyenClient`

Triez par `PortMoyenClient` décroissant.

<!-- expected-query: Q5
SELECT C.CodeCli, C.Societe, C.Pays, COUNT(O.NoCom) AS NbCommandes, ROUND(AVG(O.Port), 2) AS PortMoyenClient FROM Client C JOIN Commande O ON C.CodeCli = O.CodeCli GROUP BY C.CodeCli, C.Societe, C.Pays HAVING COUNT(O.NoCom) >= 5 AND AVG(O.Port) > (SELECT AVG(O2.Port) * 1.5 FROM Commande O2 JOIN Client C2 ON O2.CodeCli = C2.CodeCli WHERE C2.Pays = C.Pays) ORDER BY PortMoyenClient DESC;
-->

**6. Défi multi-TP — Bilan RH, hiérarchique et commercial complet par employé**

Pour chaque employé ayant enregistré des commandes, affichez un rapport croisant sa position hiérarchique et ses résultats commerciaux :
- `Collaborateur` : Son nom de famille en majuscules suivi d'un espace et de son prénom (ex: `PEACOCK Margaret`)
- `Responsable` : Le nom en majuscules suivi d'un espace et du prénom de son supérieur hiérarchique, ou `'Direction Générale'` s'il n'a pas de supérieur (`RendCompteA` nul)
- `NbCommandes` : Le nombre de commandes distinctes qu'il a traitées
- `NbClients` : Le nombre de clients distincts servis
- `ChiffreAffairesNet` : Le chiffre d'affaires net total généré (après remises), arrondi à 2 décimales
- `PanierMoyenCommande` : Le chiffre d'affaires net moyen par commande (`ChiffreAffairesNet` divisé par le nombre de commandes distinctes), arrondi à 2 décimales

Triez par `ChiffreAffairesNet` décroissant.

<!-- expected-query: Q6
SELECT (UPPER(E.Nom) || ' ' || E.Prenom) AS Collaborateur, CASE WHEN Chef.NoEmp IS NULL THEN 'Direction Générale' ELSE (UPPER(Chef.Nom) || ' ' || Chef.Prenom) END AS Responsable, COUNT(DISTINCT O.NoCom) AS NbCommandes, COUNT(DISTINCT O.CodeCli) AS NbClients, ROUND(SUM(D.PrixUnit * D.Qte * (1 - D.Remise)), 2) AS ChiffreAffairesNet, ROUND(SUM(D.PrixUnit * D.Qte * (1 - D.Remise)) / COUNT(DISTINCT O.NoCom), 2) AS PanierMoyenCommande FROM Employe E LEFT JOIN Employe Chef ON E.RendCompteA = Chef.NoEmp JOIN Commande O ON E.NoEmp = O.NoEmp JOIN DetailCommande D ON O.NoCom = D.NoCom GROUP BY E.NoEmp, E.Nom, E.Prenom, Chef.NoEmp, Chef.Nom, Chef.Prenom ORDER BY ChiffreAffairesNet DESC;
-->

**7. Défi multi-TP — Poids économique et taux d'invendus par catégorie**

Pour chaque catégorie de produits (`Categorie`), analysez la couverture du catalogue et sa contribution au chiffre d'affaires global de l'entreprise :
- `NomCateg` : Le nom de la catégorie
- `NbProduitsCatalogue` : Le nombre total de produits distincts appartenant à cette catégorie
- `NbProduitsJamaisVendus` : Le nombre de produits distincts de cette catégorie qui n'apparaissent dans aucune ligne de `DetailCommande`
- `CACategorie` : Le chiffre d'affaires net total généré par la catégorie, arrondi à 2 décimales
- `PartCAGlobalPct` : La part en pourcentage que représente le chiffre d'affaires net de cette catégorie par rapport au chiffre d'affaires net total de toute la table `DetailCommande` (calculé via une sous-requête scalaire), arrondie à 1 décimale

Triez par `CACategorie` décroissant.

<!-- expected-query: Q7
SELECT Cat.NomCateg, COUNT(DISTINCT P.Refprod) AS NbProduitsCatalogue, COUNT(DISTINCT CASE WHEN D.Refprod IS NULL THEN P.Refprod END) AS NbProduitsJamaisVendus, ROUND(SUM(D.PrixUnit * D.Qte * (1 - D.Remise)), 2) AS CACategorie, ROUND(100.0 * SUM(D.PrixUnit * D.Qte * (1 - D.Remise)) / (SELECT SUM(PrixUnit * Qte * (1 - Remise)) FROM DetailCommande), 1) AS PartCAGlobalPct FROM Categorie Cat JOIN Produit P ON Cat.CodeCateg = P.CodeCateg LEFT JOIN DetailCommande D ON P.Refprod = D.Refprod GROUP BY Cat.CodeCateg, Cat.NomCateg ORDER BY CACategorie DESC;
-->

