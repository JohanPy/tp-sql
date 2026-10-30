---
layout: base.njk
title: "Exercice 5 : Bonus - Requêtes avancées"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 5
titre: "Exercice 5 : Bonus - Requêtes avancées"
permalink: "/tp3/exercice5/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 5 : Bonus - Requêtes avancées

## Questions bonus

Ces questions s'adressent aux étudiants les plus rapides ayant terminé l'exercice de synthèse. Les **questions 1 à 4** approfondissent les agrégats temporels et conditionnels du TP 3 ; les **questions 5 à 8** sont des défis complets qui mobilisent simultanément les notions des **TP 2 et TP 3** (fonctions de chaînes, calculs de ratios en pourcentage, moyennes conditionnelles, pagination et filtres complexes).

**1. Ancienneté et fidélité des clients réguliers**

À partir de la table `Commande`, affichez pour chaque client :
- `CodeCli` : Le code du client
- `NbCommandes` : Le nombre total de commandes passées
- `PremiereCommande` : La date de sa première commande (`DateCom`)
- `DerniereCommande` : La date de sa dernière commande (`DateCom`)
- `DureeFideliteJours` : Le nombre entier de jours entre sa première et sa dernière commande

Ne gardez que les clients ayant passé **au moins 10 commandes** (10 ou plus). Triez par `DureeFideliteJours` décroissant.

<!-- expected-query: Q1
SELECT CodeCli, COUNT(*) AS NbCommandes, MIN(DateCom) AS PremiereCommande, MAX(DateCom) AS DerniereCommande, CAST(JULIANDAY(MAX(DateCom)) - JULIANDAY(MIN(DateCom)) AS INT) AS DureeFideliteJours FROM Commande GROUP BY CodeCli HAVING COUNT(*) >= 10 ORDER BY DureeFideliteJours DESC;
-->

**2. Bilan des expéditions par trimestre**

À partir de la table `Commande`, prenez uniquement les commandes expédiées (`DateEnv` non nulle) et regroupez-les par trimestre d'expédition au format `'AAAA-TX'` (ex. `'2015-T1'`) :
- `'T1'` pour les mois de janvier à mars (mois 1 à 3)
- `'T2'` pour les mois d'avril à juin (mois 4 à 6)
- `'T3'` pour les mois de juillet à septembre (mois 7 à 9)
- `'T4'` pour les mois d'octobre à décembre (mois 10 à 12)

Pour chaque trimestre, affichez :
- `Trimestre` : L'année et le trimestre d'envoi au format `'AAAA-TX'`
- `NbExpeditions` : Le nombre de commandes expédiées
- `TotalPort` : La somme des frais de port (`Port`), arrondie à 2 décimales

Triez par `Trimestre` croissant.

<!-- expected-query: Q2
SELECT (STRFTIME('%Y', DateEnv) || '-T' || CASE WHEN CAST(STRFTIME('%m', DateEnv) AS INT) <= 3 THEN '1' WHEN CAST(STRFTIME('%m', DateEnv) AS INT) <= 6 THEN '2' WHEN CAST(STRFTIME('%m', DateEnv) AS INT) <= 9 THEN '3' ELSE '4' END) AS Trimestre, COUNT(*) AS NbExpeditions, ROUND(SUM(Port), 2) AS TotalPort FROM Commande WHERE DateEnv IS NOT NULL GROUP BY Trimestre ORDER BY Trimestre ASC;
-->

**3. Valeur du stock et produits en alerte par fournisseur**

À partir de la table `Produit`, affichez pour chaque fournisseur :
- `NoFour` : Le numéro du fournisseur
- `NbReferences` : Le nombre de produits fournis
- `ValeurStock` : La valeur totale du stock de ses produits (prix unitaire multiplié par les unités en stock), arrondie à 2 décimales
- `NbProduitsEnAlerte` : Le nombre de ses produits dont le stock (`UnitesStock`) est strictement inférieur au seuil de réapprovisionnement (`NiveauReap`)

Triez par `ValeurStock` décroissante.

<!-- expected-query: Q3
SELECT NoFour, COUNT(*) AS NbReferences, ROUND(SUM(PrixUnit * UnitesStock), 2) AS ValeurStock, SUM(CASE WHEN UnitesStock < NiveauReap THEN 1 ELSE 0 END) AS NbProduitsEnAlerte FROM Produit GROUP BY NoFour ORDER BY ValeurStock DESC;
-->

**4. Mois ayant le plus grand nombre de commandes**

À partir de la table `Commande`, regroupez les commandes par mois de commande (`DateCom`), sans tenir compte de l'année, et affichez :
- `Mois` : Le numéro du mois sur 2 chiffres (de `'01'` à `'12'`)
- `NbCommandes` : Le nombre total de commandes passées ce mois-ci
- `PortMoyen` : La moyenne des frais de port (`Port`), arrondie à 2 décimales

Ne gardez que les mois totalisant **strictement plus de 60 commandes**. Triez par `NbCommandes` décroissant.

<!-- expected-query: Q4
SELECT STRFTIME('%m', DateCom) AS Mois, COUNT(*) AS NbCommandes, ROUND(AVG(Port), 2) AS PortMoyen FROM Commande GROUP BY Mois HAVING COUNT(*) > 60 ORDER BY NbCommandes DESC;
-->

**5. Défi multi-TP — Suivi des livraisons par zone géographique**

À partir de la table `Commande`, prenez uniquement les commandes expédiées (`DateEnv` non nulle) et regroupez-les selon les **3 premières lettres du pays de livraison en majuscules** (`PaysLiv`).
Pour chaque zone comptant **au moins 25 commandes expédiées** (25 ou plus), affichez :
- `CodeZone` : Les 3 premières lettres de `PaysLiv` en majuscules
- `NbExp` : Le nombre de commandes expédiées vers cette zone
- `ClientsUniques` : Le nombre de clients différents (`CodeCli`) livrés dans cette zone
- `DelaiMoyen` : Le délai moyen d'expédition en jours (écart entre `DateEnv` et `DateCom`), arrondi à 1 décimale
- `TauxRetardPct` : Le pourcentage de commandes expédiées en retard (`DateEnv` strictement après `ALivAvant`) par rapport au nombre d'expéditions de la zone, arrondi à 1 décimale
- `DiagnosticLogistique` : L'évaluation du délai moyen (avant arrondi) :
  - `'Critique'` s'il est strictement supérieur à 10 jours
  - `'À surveiller'` s'il est compris entre 7 et 10 jours inclus
  - `'Optimal'` s'il est strictement inférieur à 7 jours

Triez par `TauxRetardPct` décroissant.

<details>
<summary>💡 Indice</summary>

En SQL, diviser deux nombres entiers donne un entier tronqué. Pour obtenir un pourcentage avec des décimales, multipliez le nombre de retards par `100.0` (et non `100`) avant de diviser par le nombre total d'expéditions.
</details>

<!-- expected-query: Q5
SELECT UPPER(SUBSTR(PaysLiv, 1, 3)) AS CodeZone, COUNT(*) AS NbExp, COUNT(DISTINCT CodeCli) AS ClientsUniques, ROUND(AVG(JULIANDAY(DateEnv) - JULIANDAY(DateCom)), 1) AS DelaiMoyen, ROUND(100.0 * SUM(CASE WHEN JULIANDAY(DateEnv) > JULIANDAY(ALivAvant) THEN 1 ELSE 0 END) / COUNT(*), 1) AS TauxRetardPct, CASE WHEN AVG(JULIANDAY(DateEnv) - JULIANDAY(DateCom)) > 10 THEN 'Critique' WHEN AVG(JULIANDAY(DateEnv) - JULIANDAY(DateCom)) >= 7 THEN 'À surveiller' ELSE 'Optimal' END AS DiagnosticLogistique FROM Commande WHERE DateEnv IS NOT NULL GROUP BY CodeZone HAVING COUNT(*) >= 25 ORDER BY TauxRetardPct DESC;
-->

**6. Défi multi-TP — Les 5 produits ayant le coût de remise le plus élevé**

À partir de la table `DetailCommande`, regroupez les lignes par produit (`Refprod`).
Ne gardez que les produits présents dans **au moins 15 commandes différentes** ET dont le chiffre d'affaires net (avant arrondi) est **strictement supérieur à 10 000 €**.
Affichez uniquement les **5 premiers produits** :
- `Refprod` : La référence du produit
- `NbCommandes` : Le nombre de commandes différentes contenant ce produit
- `CANet` : Le chiffre d'affaires total net (après déduction de la remise), arrondi à 2 décimales
- `ManqueAGagner` : Le montant total des remises accordées sur ce produit (différence entre le prix brut et le prix net), arrondi à 2 décimales
- `PartVentesBradeesPct` : Le pourcentage de lignes de commande de ce produit ayant une remise strictement supérieure à 10 % (soit `0.10`), arrondi à 1 décimale

Triez par `ManqueAGagner` décroissant.

<!-- expected-query: Q6
SELECT Refprod, COUNT(DISTINCT Nocom) AS NbCommandes, ROUND(SUM(PrixUnit * Qte * (1 - Remise)), 2) AS CANet, ROUND(SUM(PrixUnit * Qte * Remise), 2) AS ManqueAGagner, ROUND(100.0 * SUM(CASE WHEN Remise > 0.10 THEN 1 ELSE 0 END) / COUNT(*), 1) AS PartVentesBradeesPct FROM DetailCommande GROUP BY Refprod HAVING COUNT(DISTINCT Nocom) >= 15 AND SUM(PrixUnit * Qte * (1 - Remise)) > 10000 ORDER BY ManqueAGagner DESC LIMIT 5;
-->

**7. Défi multi-TP — Bilan d'activité et suivi des envois par employé**

À partir de la table `Commande`, affichez pour chaque employé :
- `NoEmp` : Le numéro de l'employé
- `NbCommandes` : Le nombre total de commandes qu'il a gérées
- `NbClientsDistincts` : Le nombre de clients différents (`CodeCli`) qu'il a servis
- `PortMoyen` : Le montant moyen des frais de port (`Port`), arrondi à 2 décimales
- `EnAttenteExp` : Le nombre de commandes non expédiées (sans date d'envoi `DateEnv`)
- `ExpHorsDelai` : Le nombre de commandes expédiées en retard (`DateEnv` strictement après `ALivAvant`)
- `StatutActivite` : Le niveau d'activité selon son nombre total de commandes :
  - `'Pilier'` pour 100 commandes ou plus
  - `'Confirmé'` entre 60 et 99 commandes incluses
  - `'Standard'` pour strictement moins de 60 commandes

Triez par `NbCommandes` décroissant.

<!-- expected-query: Q7
SELECT NoEmp, COUNT(*) AS NbCommandes, COUNT(DISTINCT CodeCli) AS NbClientsDistincts, ROUND(AVG(Port), 2) AS PortMoyen, SUM(CASE WHEN DateEnv IS NULL THEN 1 ELSE 0 END) AS EnAttenteExp, SUM(CASE WHEN JULIANDAY(DateEnv) > JULIANDAY(ALivAvant) THEN 1 ELSE 0 END) AS ExpHorsDelai, CASE WHEN COUNT(*) >= 100 THEN 'Pilier' WHEN COUNT(*) >= 60 THEN 'Confirmé' ELSE 'Standard' END AS StatutActivite FROM Commande GROUP BY NoEmp ORDER BY NbCommandes DESC;
-->

**8. Défi multi-TP — Analyse des produits par type d'emballage**

À partir de la table `Produit`, classez les produits selon le texte contenu dans la colonne `QteParUnit` :
- `'Liquide (Bouteille/Canette)'` si `QteParUnit` contient le mot `'bouteille'` ou `'canette'`
- `'Boîte ou Carton'` si `QteParUnit` contient le mot `'boîte'` ou `'carton'`
- `'Pot ou Verre'` si `QteParUnit` contient le mot `'pot'` ou `'verre'`
- `'Autre conditionnement'` dans tous les autres cas

Pour chaque type d'emballage, affichez :
- `TypeEmballage` : La catégorie d'emballage
- `NbTotal` : Le nombre total de produits (en vente ou non)
- `NbActifs` : Le nombre de produits actuellement en vente (colonne `Indisponible` égale à 0)
- `PrixMoyenActif` : Le prix unitaire moyen calculé **uniquement sur les produits en vente** (`Indisponible` égal à 0), arrondi à 2 décimales
- `ValeurTotaleStock` : La valeur totale du stock de tous les produits du groupe (prix unitaire multiplié par le stock), arrondie à 2 décimales

Triez par `ValeurTotaleStock` décroissante.

<details>
<summary>💡 Indice</summary>

La fonction `AVG()` ignore automatiquement les valeurs `NULL`. Pour calculer une moyenne sur une partie seulement des lignes d'un groupe, placez à l'intérieur de `AVG()` une expression `CASE` qui renvoie le prix lorsque le produit est en vente, et `NULL` sinon.
</details>

<!-- expected-query: Q8
SELECT CASE WHEN QteParUnit LIKE '%bouteille%' OR QteParUnit LIKE '%canette%' THEN 'Liquide (Bouteille/Canette)' WHEN QteParUnit LIKE '%boîte%' OR QteParUnit LIKE '%carton%' THEN 'Boîte ou Carton' WHEN QteParUnit LIKE '%pot%' OR QteParUnit LIKE '%verre%' THEN 'Pot ou Verre' ELSE 'Autre conditionnement' END AS TypeEmballage, COUNT(*) AS NbTotal, SUM(CASE WHEN Indisponible = 0 THEN 1 ELSE 0 END) AS NbActifs, ROUND(AVG(CASE WHEN Indisponible = 0 THEN PrixUnit END), 2) AS PrixMoyenActif, ROUND(SUM(PrixUnit * UnitesStock), 2) AS ValeurTotaleStock FROM Produit GROUP BY TypeEmballage ORDER BY ValeurTotaleStock DESC;
-->

