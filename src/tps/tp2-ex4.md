---
layout: base.njk
title: "Exercice 4 : Bonus - Requêtes avancées"
intitule: "TP 2 - Agrégats et Choix multiple"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 4
titre: "Exercice 4 : Bonus - Requêtes avancées"
permalink: "/tp2/exercice4/"
tags: tp
---

# Exercice 4 : Bonus - Requêtes avancées

## Questions bonus

Combinez agrégats, CASE et dates pour résoudre des problèmes complexes. À faire uniquement si vous avez le temps !

**1. Calculer le montant moyen des commandes par semestre**

Affichez le semestre, le nombre de commandes et le montant moyen par semestre.

<details>
<summary>💡 Indice</summary>

Vous devez d'abord extraire le mois, puis convertir en semestre (01-06 = S1, 07-12 = S2).
</details>

<!-- expected-query: Q1
SELECT (STRFTIME('%Y', Commande.DateCom) || '-' || CASE WHEN CAST(STRFTIME('%m', Commande.DateCom) AS INT) <= 6 THEN 'S1' ELSE 'S2' END) AS Semestre, COUNT(DISTINCT Commande.NoCom) AS NbCommandes, ROUND(AVG(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)), 2) AS MontantMoyen FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Semestre;
-->

**2. Identifier les produits "saisonniers" : vendus intensivement certains mois seulement**

Un produit est saisonnier s'il a une vente 3x supérieure certains mois vs autres mois.

<!-- expected-query: Q2
SELECT Produit.Nomprod, STRFTIME('%m', Commande.DateCom) AS Mois, SUM(DetailCommande.Qte) AS TotalQte FROM Produit JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod JOIN Commande ON DetailCommande.NoCom = Commande.NoCom GROUP BY Produit.Refprod, Mois ORDER BY TotalQte DESC;
-->

**3. Afficher les commandes "à risque" : délai de livraison > 30 jours OU remise > 15%**

Listez les commandes avec un problème potentiel.

<!-- expected-query: Q3
SELECT DISTINCT Commande.NoCom, (JULIANDAY(Commande.DateEnv) - JULIANDAY(Commande.DateCom)) AS DelaiLivraison, DetailCommande.Remise FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom WHERE (JULIANDAY(Commande.DateEnv) - JULIANDAY(Commande.DateCom)) > 30 OR DetailCommande.Remise > 0.15;
-->

**4. Créer un "classement" mensuel des employés par nombre de commande**

Affichez le mois et les employés en fonction de leurs chiffre d'affaires.

<!-- expected-query: Q4
SELECT STRFTIME('%Y-%m', Commande.DateCom) AS Mois, Employe.Nom, COUNT(Commande.NoCom) AS NbCommandes FROM Employe JOIN Commande ON Employe.NoEmp = Commande.NoEmp GROUP BY Mois, Employe.NoEmp, Employe.Nom ORDER BY Mois, NbCommandes DESC;
-->

**5. Calculer le "cycle de vie" du client : temps écoulé depuis première commande**

Affichez le client, sa première commande et le nombre de jours depuis.

<!-- expected-query: Q5
SELECT CodeCli, MIN(DateCom) AS PremiereCommande, CAST(JULIANDAY('now') - JULIANDAY(MIN(DateCom)) AS INT) AS JoursEcoules FROM Commande GROUP BY CodeCli;
-->

**6. Identifier les produits "à relancer" : peu vendus mais en stock**

Produits avec stock > moyenne ET quantité vendue < 10 unités.

<!-- expected-query: Q6
SELECT Produit.Refprod, Produit.Nomprod, Produit.UnitesStock, COALESCE(SUM(DetailCommande.Qte), 0) AS TotalVendu FROM Produit LEFT JOIN DetailCommande ON Produit.Refprod = DetailCommande.Refprod GROUP BY Produit.Refprod, Produit.Nomprod, Produit.UnitesStock HAVING Produit.UnitesStock > (SELECT AVG(UnitesStock) FROM Produit) AND COALESCE(SUM(DetailCommande.Qte), 0) < 10;
-->

**7. Calculer la marge potentielle par catégorie**

Affichez la catégorie et le pourcentage de marge moyenne (supposez un coût = 60% du PrixUnit).

<!-- expected-query: Q7
SELECT Categorie.NomCateg, ROUND(AVG((PrixUnit - PrixUnit * 0.60) / PrixUnit * 100), 2) AS MargeMoyennePct FROM Produit JOIN Categorie ON Produit.CodeCateg = Categorie.CodeCateg GROUP BY Categorie.CodeCateg, Categorie.NomCateg;
-->

**8. Afficher les anomalies : commandes sans livraison (DateLivraison NULL) après 60 jours**

Identifiez les commandes potentiellement problématiques.

<!-- expected-query: Q8
SELECT NoCom, DateCom, DateEnv FROM Commande WHERE DateEnv IS NULL;
-->

**9. Créer une segmentation client : "VIP" (> 5000€), "Régulier" (1000-5000€), "Occasionnel" (< 1000€)**

Affichez la segmentation avec le nombre de clients par catégorie.

<!-- expected-query: Q9
SELECT Segment, COUNT(*) AS NbClients FROM (SELECT Client.CodeCli, CASE WHEN SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)) > 5000 THEN 'VIP' WHEN SUM(DetailCommande.PrixUnit * DetailCommande.Qte * (1 - DetailCommande.Remise)) BETWEEN 1000 AND 5000 THEN 'Régulier' ELSE 'Occasionnel' END AS Segment FROM Client JOIN Commande ON Client.CodeCli = Commande.CodeCli JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Client.CodeCli) GROUP BY Segment;
-->

**10. Analyser la tendance : comparer le CA des 3 premiers mois vs les 3 derniers mois**

Affichez la croissance ou décroissance en %.

<!-- expected-query: Q10
SELECT STRFTIME('%Y-%m', DateCom) AS Mois, ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS ChiffreAffaires FROM Commande JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom GROUP BY Mois ORDER BY Mois;
-->

## Rappel de cours

### Combinaison de concepts

Pour les requêtes complexes, vous devrez souvent combiner `JOIN`, `GROUP BY`, `HAVING` et `CASE`.

```sql
-- Exemple complexe : CA par année avec classification
SELECT 
    STRFTIME('%Y', DateCom) AS Annee,
    SUM(PrixUnit * Qte) AS CA,
    CASE 
        WHEN SUM(PrixUnit * Qte) > 100000 THEN 'Excellent'
        ELSE 'Normal'
    END AS Performance
FROM Commande
JOIN DetailCommande ON Commande.NoCom = DetailCommande.NoCom
GROUP BY Annee;
```

