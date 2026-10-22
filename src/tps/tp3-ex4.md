---
layout: base.njk
title: "Exercice 4 : Bonus - Requêtes avancées"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 4
titre: "Exercice 4 : Bonus - Requêtes avancées"
permalink: "/tp3/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Requêtes avancées

## Questions bonus

Combinez agrégats, CASE et dates pour résoudre des problèmes complexes. À faire uniquement si vous avez le temps !

**1. Bilan d'activité annuel et suivi des frais de port**

À partir de la table `Commande`, affichez pour chaque année de commande :
- L'année sous l'alias `Annee`
- Le nombre total de commandes traitées sous l'alias `NbCommandes`
- Le montant moyen des frais de port (colonne `Port`), arrondi à 2 décimales sous l'alias `FraisPortMoyen`
- Le montant le plus élevé facturé en frais de port sous l'alias `FraisPortMax`

Triez les résultats par ordre chronologique des années.

<!-- expected-query: Q1
SELECT STRFTIME('%Y', DateCom) AS Annee, COUNT(*) AS NbCommandes, ROUND(AVG(Port), 2) AS FraisPortMoyen, MAX(Port) AS FraisPortMax FROM Commande GROUP BY Annee ORDER BY Annee ASC;
-->

**2. Analyse des délais moyens d'expédition par pays de destination**

À partir de la table `Commande`, pour les commandes effectivement expédiées (date d'envoi renseignée), affichez pour chaque pays destinataire (`PaysLiv`) :
- Le pays sous l'alias `PaysLiv`
- Le nombre de commandes expédiées sous l'alias `NbCommandes`
- Le délai moyen d'acheminement en jours (écart entre date d'envoi et date de commande), arrondi à 1 décimale sous l'alias `DelaiMoyenJours`

Triez les résultats par délai moyen d'acheminement décroissant.

<!-- expected-query: Q2
SELECT PaysLiv, COUNT(*) AS NbCommandes, ROUND(AVG(JULIANDAY(DateEnv) - JULIANDAY(DateCom)), 1) AS DelaiMoyenJours FROM Commande WHERE DateEnv IS NOT NULL GROUP BY PaysLiv ORDER BY DelaiMoyenJours DESC;
-->

**3. Segmentation du catalogue de produits par gamme de prix**

À partir de la table `Produit`, classez chaque produit commercialisé (`Indisponible` valant 0) selon son prix unitaire :
- 'Économique' pour un prix strictement inférieur à 50 €
- 'Standard' pour un prix compris entre 50 € et 150 € inclus
- 'Luxe' pour un prix strictement supérieur à 150 €

Pour chacune de ces gammes (sous l'alias `TranchePrix`), affichez :
- L'intitulé de la tranche (`TranchePrix`)
- Le nombre de produits disponibles sous l'alias `NbProduitsDispos`
- Le prix unitaire moyen, arrondi à 2 décimales sous l'alias `PrixMoyen`

Triez par prix unitaire moyen croissant.

<!-- expected-query: Q3
SELECT CASE WHEN PrixUnit < 50 THEN 'Économique' WHEN PrixUnit BETWEEN 50 AND 150 THEN 'Standard' ELSE 'Luxe' END AS TranchePrix, COUNT(*) AS NbProduitsDispos, ROUND(AVG(PrixUnit), 2) AS PrixMoyen FROM Produit WHERE Indisponible = 0 GROUP BY TranchePrix ORDER BY PrixMoyen ASC;
-->

**4. Synthèse financière des ventes par niveau de remise**

À partir de la table `DetailCommande`, répartissez l'ensemble des lignes de vente en 3 catégories selon le taux de remise appliqué :
- 'Sans remise' si la remise est égale à 0
- 'Remise modérée' si la remise est strictement supérieure à 0 et inférieure ou égale à 15 %
- 'Forte remise' si la remise est strictement supérieure à 15 %

Pour chaque catégorie sous l'alias `TypeRemise`, affichez :
- La catégorie (`TypeRemise`)
- Le nombre total de lignes de commande correspondantes sous l'alias `NbLignes`
- Le montant net total facturé (après remise), arrondi à 2 décimales sous l'alias `TotalNet`

Triez par montant net total décroissant.

<!-- expected-query: Q4
SELECT CASE WHEN Remise = 0 THEN 'Sans remise' WHEN Remise <= 0.15 THEN 'Remise modérée' ELSE 'Forte remise' END AS TypeRemise, COUNT(*) AS NbLignes, ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS TotalNet FROM DetailCommande GROUP BY TypeRemise ORDER BY TotalNet DESC;
-->

**5. Mesure de la longévité et de la fidélité client**

À partir de la table `Commande`, pour chaque client (`CodeCli`), affichez :
- Le code client (`CodeCli`)
- Le nombre total de commandes passées sous l'alias `NbCommandes`
- La date de sa première commande sous l'alias `PremiereCommande`
- La date de sa commande la plus récente sous l'alias `DerniereCommande`
- Le nombre total de jours écoulés entre sa toute première et sa dernière commande, sous l'alias `DureeFideliteJours`

Ne retenez que les clients réguliers ayant passé au moins 10 commandes au total. Triez les résultats par durée de fidélité décroissante.

<!-- expected-query: Q5
SELECT CodeCli, COUNT(*) AS NbCommandes, MIN(DateCom) AS PremiereCommande, MAX(DateCom) AS DerniereCommande, CAST(JULIANDAY(MAX(DateCom)) - JULIANDAY(MIN(DateCom)) AS INT) AS DureeFideliteJours FROM Commande GROUP BY CodeCli HAVING COUNT(*) >= 10 ORDER BY DureeFideliteJours DESC;
-->

**6. Détection des commandes à fort volume et diversité de références**

À partir de la table `DetailCommande`, identifiez les commandes d'envergure. Pour chaque numéro de commande (`Nocom`), affichez :
- Le numéro de commande (`Nocom`)
- Le nombre de produits différents commandés sous l'alias `NbReferences`
- La quantité totale d'articles commandés sous l'alias `TotalArticles`
- Le montant net total de la commande (remises déduites), arrondi à 2 décimales sous l'alias `MontantNet`

Ne conservez que les commandes comportant au moins 5 références distinctes ET dont le montant net total dépasse 5 000 €. Triez par montant net décroissant.

<!-- expected-query: Q6
SELECT Nocom, COUNT(DISTINCT Refprod) AS NbReferences, SUM(Qte) AS TotalArticles, ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS MontantNet FROM DetailCommande GROUP BY Nocom HAVING COUNT(DISTINCT Refprod) >= 5 AND SUM(PrixUnit * Qte * (1 - Remise)) > 5000 ORDER BY MontantNet DESC;
-->

**7. Bilan trimestriel des expéditions**

À partir de la table `Commande`, regroupez les commandes expédiées par trimestre d'expédition sous la forme 'AAAA-TX' sous l'alias `Trimestre` (par exemple '2015-T1' pour les mois de janvier à mars). Pour chaque trimestre, affichez :
- Le trimestre (`Trimestre`)
- Le nombre total de commandes expédiées sous l'alias `NbExpeditions`
- Le montant cumulé des frais de port facturés, arrondi à 2 décimales sous l'alias `TotalPort`

Ne traitez que les commandes disposant d'une date d'envoi. Triez par ordre chronologique sur le trimestre.

<!-- expected-query: Q7
SELECT (STRFTIME('%Y', DateEnv) || '-T' || CASE WHEN CAST(STRFTIME('%m', DateEnv) AS INT) <= 3 THEN '1' WHEN CAST(STRFTIME('%m', DateEnv) AS INT) <= 6 THEN '2' WHEN CAST(STRFTIME('%m', DateEnv) AS INT) <= 9 THEN '3' ELSE '4' END) AS Trimestre, COUNT(*) AS NbExpeditions, ROUND(SUM(Port), 2) AS TotalPort FROM Commande WHERE DateEnv IS NOT NULL GROUP BY Trimestre ORDER BY Trimestre ASC;
-->

**8. Audit annuel des commandes expédiées hors délai**

Dans la table `Commande`, chaque commande indique la date limite d'acheminement souhaitée (`ALivAvant`) et la date d'envoi effective (`DateEnv`). Une commande est considérée expédiée en retard si sa date d'envoi est postérieure à la date limite.
Pour chaque année de commande (`DateCom`), affichez :
- L'année sous l'alias `Annee`
- Le nombre total de commandes expédiées sous l'alias `TotalExpediees`
- Le nombre de commandes expédiées en retard sous l'alias `NbRetards`

Ne prenez en compte que les commandes ayant été expédiées. Triez par année croissante.

<details>
<summary>💡 Indice</summary>

Pour compter uniquement les commandes vérifiant une condition au sein de chaque groupe annuel, pensez à sommer une expression conditionnelle (`SUM(CASE WHEN ... THEN 1 ELSE 0 END)`).
</details>

<!-- expected-query: Q8
SELECT STRFTIME('%Y', DateCom) AS Annee, COUNT(*) AS TotalExpediees, SUM(CASE WHEN JULIANDAY(DateEnv) > JULIANDAY(ALivAvant) THEN 1 ELSE 0 END) AS NbRetards FROM Commande WHERE DateEnv IS NOT NULL GROUP BY Annee ORDER BY Annee ASC;
-->

**9. Valorisation des stocks et alertes d'approvisionnement par fournisseur**

À partir de la table `Produit`, dressez pour chaque fournisseur (colonne `NoFour`) un état des lieux de son catalogue :
- L'identifiant du fournisseur (`NoFour`)
- Le nombre de références de produits qu'il fournit sous l'alias `NbReferences`
- La valeur financière totale de son stock disponible en entrepôt, arrondie à 2 décimales sous l'alias `ValeurStock`
- Le nombre de ses produits dont le stock actuel est strictement inférieur au niveau de réapprovisionnement (`NiveauReap`), sous l'alias `NbProduitsEnAlerte`

Triez les résultats par valeur financière de stock décroissante.

<!-- expected-query: Q9
SELECT NoFour, COUNT(*) AS NbReferences, ROUND(SUM(PrixUnit * UnitesStock), 2) AS ValeurStock, SUM(CASE WHEN UnitesStock < NiveauReap THEN 1 ELSE 0 END) AS NbProduitsEnAlerte FROM Produit GROUP BY NoFour ORDER BY ValeurStock DESC;
-->

**10. Identification des mois de forte affluence commerciale**

À partir de la table `Commande`, analysez la saisonnalité des ventes en regroupant toutes les commandes selon leur mois de création (valeurs de '01' à '12' sous l'alias `Mois`, toutes années confondues). Affichez :
- Le numéro du mois (`Mois`)
- Le nombre total de commandes enregistrées sous l'alias `NbCommandes`
- La moyenne des frais de port facturés pour ce mois, arrondie à 2 décimales sous l'alias `PortMoyen`

Ne conservez que les mois ayant enregistré strictement plus de 60 commandes au total. Triez par nombre de commandes décroissant.

<!-- expected-query: Q10
SELECT STRFTIME('%m', DateCom) AS Mois, COUNT(*) AS NbCommandes, ROUND(AVG(Port), 2) AS PortMoyen FROM Commande GROUP BY Mois HAVING COUNT(*) > 60 ORDER BY NbCommandes DESC;
-->

## Rappel de cours

### Comptage conditionnel avec CASE et SUM

Pour compter des lignes satisfaisant une condition spécifique au sein d'un groupe, on utilise couramment la somme d'une expression conditionnelle renvoyant 1 ou 0 :

```sql
-- Compte le nombre de produits en rupture dans chaque catégorie
SELECT CodeCateg,
       COUNT(*) AS TotalProduits,
       SUM(CASE WHEN UnitesStock = 0 THEN 1 ELSE 0 END) AS NbEnRupture
FROM Produit
GROUP BY CodeCateg;
```

### Regroupement sur expressions calculées

Vous pouvez utiliser une expression `CASE` ou une fonction `STRFTIME` directement dans le `GROUP BY` :

```sql
SELECT STRFTIME('%Y', DateCom) AS Annee, COUNT(*) AS Total
FROM Commande
GROUP BY Annee;
```

### Combinaison de filtres HAVING

La clause `HAVING` peut combiner plusieurs conditions d'agrégation avec `AND` ou `OR` :

```sql
SELECT NoFour, COUNT(*) AS Total, AVG(PrixUnit) AS Moyenne
FROM Produit
GROUP BY NoFour
HAVING COUNT(*) >= 3 AND AVG(PrixUnit) > 50;
```

