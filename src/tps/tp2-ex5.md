---
layout: base.njk
title: "Exercice 5 : Bonus - Requêtes complexes"
intitule: "TP 2 — Requêtes Simples, Calculs & Manipulation de Chaînes"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 5
titre: "Exercice 5 : Bonus - Requêtes complexes"
permalink: "/tp2/exercice5/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 5 : Bonus - Requêtes complexes

## Questions bonus

Ces défis supplémentaires poussent l'analyse et la manipulation de données plus loin (simulations financières, calculs conditionnels, audits et clés composées). À faire si vous avez terminé l'exercice de synthèse et souhaitez vous perfectionner !

**1. Simuler une révision tarifaire ciblée et mesurer la plus-value sur le stock**

À partir de la table `Produit`, pour les boissons (catégorie 1), condiments (catégorie 2) et desserts (catégorie 3) dont le prix unitaire actuel est compris entre 20 € et 120 € inclus, affichez :
- La référence (`Refprod`)
- Le nom du produit (`Nomprod`)
- Le code catégorie (`CodeCateg`)
- Le prix actuel (`PrixUnit`)
- Le nouveau prix unitaire suite à une hausse de 8,5 %, arrondi à 2 décimales sous l'alias `NouveauPrix`
- Le montant de cette hausse unitaire en euros, arrondi à 2 décimales sous l'alias `HausseUnitaire`
- La plus-value totale que cette hausse représente sur la totalité du stock disponible, arrondie à 2 décimales sous l'alias `PlusValueStock`

Triez par la plus-value sur le stock décroissante, puis par nom de produit par ordre alphabétique.

<!-- expected-query: Q1
SELECT Refprod, Nomprod, CodeCateg, PrixUnit, ROUND(PrixUnit * 1.085, 2) AS NouveauPrix, ROUND(PrixUnit * 0.085, 2) AS HausseUnitaire, ROUND((PrixUnit * 0.085) * UnitesStock, 2) AS PlusValueStock FROM Produit WHERE CodeCateg IN (1, 2, 3) AND PrixUnit BETWEEN 20 AND 120 ORDER BY PlusValueStock DESC, Nomprod ASC;
-->

**2. Auditer les lignes de commande avec forte remise financière**

À partir de la table `DetailCommande`, pour les lignes de commande ayant bénéficié d'une remise d'au moins 20 %, d'une quantité commandée d'au moins 25 unités, et dont le montant total de remise accordée dépasse 500 €, affichez :
- Le numéro de commande (`Nocom`)
- La référence du produit (`Refprod`)
- La quantité commandée (`Qte`)
- Le taux de remise (`Remise`)
- Le montant brut avant remise, arrondi à 2 décimales sous l'alias `MontantBrut`
- Le montant en euros économisé grâce à la remise, arrondi à 2 décimales sous l'alias `RemiseEuros`
- Le montant net final facturé, arrondi à 2 décimales sous l'alias `MontantNet`

Triez par le montant de la remise (`RemiseEuros`) décroissant. Limitez aux 10 premiers résultats.

<!-- expected-query: Q2
SELECT Nocom, Refprod, Qte, Remise, ROUND(PrixUnit * Qte, 2) AS MontantBrut, ROUND(PrixUnit * Qte * Remise, 2) AS RemiseEuros, ROUND(PrixUnit * Qte * (1 - Remise), 2) AS MontantNet FROM DetailCommande WHERE Remise >= 0.20 AND Qte >= 25 AND (PrixUnit * Qte * Remise) > 500 ORDER BY RemiseEuros DESC LIMIT 10;
-->

**3. Étiquettes d'expédition pour les commandes internationales**

Pour les commandes passées au cours de l'année 2015, déjà expédiées (date d'envoi `DateEnv` non nulle), disposant d'un code postal de livraison (`CodepostalLiv` non nul), et dont le pays de destination se situe en dehors de la France, de la Belgique et de la Suisse :
Affichez :
- `NoCom` : Le numéro de commande
- `DateCom` : La date de commande
- `EtiquetteColis` : Une étiquette d'expédition formatée au modèle :
  `DESTINATAIRE / AdrLiv, CodepostalLiv VilleLiv (PAYSLIV)`
  (avec `Destinataire` et `PaysLiv` affichés en majuscules)

Triez par date de commande chronologique, puis par numéro de commande. Limitez l'affichage aux 10 premières commandes.

<!-- expected-query: Q3
SELECT NoCom, DateCom, (UPPER(Destinataire) || ' / ' || AdrLiv || ', ' || CodepostalLiv || ' ' || VilleLiv || ' (' || UPPER(PaysLiv) || ')') AS EtiquetteColis FROM Commande WHERE DateCom LIKE '2015%' AND DateEnv IS NOT NULL AND CodepostalLiv IS NOT NULL AND PaysLiv NOT IN ('France', 'Belgique', 'Suisse') ORDER BY DateCom ASC, NoCom ASC LIMIT 10;
-->

**4. Génération de clés de facturation internationale pour l'Amérique latine**

Pour les clients d'Amérique latine (Brésil, Argentine, Mexique, Venezuela) dont la région administrative (colonne `Region`) est renseignée (non nulle) :
Affichez :
- Le code client (`CodeCli`)
- Le nom de société (`Societe`)
- Le pays (`Pays`)
- Une clé de facturation nommée `CleFacturation` composée des 3 premières lettres du pays en majuscules, d'un tiret, des 2 premiers caractères du code client, d'un tiret, et des 2 derniers caractères du code client (ex: pour le client `ANATR` au Mexique : `MEX-AN-TR`)

Triez par pays puis par cette clé de facturation.

<!-- expected-query: Q4
SELECT CodeCli, Societe, Pays, (UPPER(SUBSTR(Pays, 1, 3)) || '-' || SUBSTR(CodeCli, 1, 2) || '-' || SUBSTR(CodeCli, -2)) AS CleFacturation FROM Client WHERE Pays IN ('Brésil', 'Argentine', 'Mexique', 'Venezuela') AND Region IS NOT NULL ORDER BY Pays, CleFacturation;
-->

