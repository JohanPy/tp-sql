---
layout: base.njk
title: "Exercice 4 : Bonus - Requêtes complexes"
intitule: "TP 2 — Requêtes Simples, Calculs & Manipulation de Chaînes"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 4
titre: "Exercice 4 : Bonus - Requêtes complexes"
permalink: "/tp2/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Bonus - Requêtes complexes

## Questions bonus

Ces questions combinent les notions vues dans les exercices précédents (sélection, priorités booléennes, calculs arithmétiques, fonctions de manipulation de chaînes et pagination). À faire uniquement si vous avez le temps pour vous dépasser !

**1. Identifier les produits en alerte de stock et estimer le coût de réapprovisionnement**

À partir de la table `Produit`, pour les produits commercialisés (colonne `Indisponible` valant 0) dont le stock actuel est strictement inférieur au seuil d'alerte (colonne `NiveauReap`), affichez :
- La référence (`Refprod`)
- Le nom du produit (`Nomprod`)
- Le stock actuel (`UnitesStock`)
- Le seuil minimal (`NiveauReap`)
- Le nombre d'unités manquantes sous l'alias `UnitesManquantes`
- Le coût estimé de réapprovisionnement pour combler ce manque (au prix unitaire actuel), arrondi à 2 décimales sous l'alias `CoutReappro`

Triez les résultats par coût de réapprovisionnement décroissant.

<!-- expected-query: Q1
SELECT Refprod, Nomprod, UnitesStock, NiveauReap, (NiveauReap - UnitesStock) AS UnitesManquantes, ROUND((NiveauReap - UnitesStock) * PrixUnit, 2) AS CoutReappro FROM Produit WHERE Indisponible = 0 AND UnitesStock < NiveauReap ORDER BY CoutReappro DESC;
-->

**2. Simuler une révision tarifaire ciblée et mesurer la plus-value sur le stock**

À partir de la table `Produit`, pour les boissons (catégorie 1), condiments (catégorie 2) et desserts (catégorie 3) dont le prix unitaire actuel est compris entre 20 € et 120 € inclus, affichez :
- La référence (`Refprod`)
- Le nom du produit (`Nomprod`)
- Le code catégorie (`CodeCateg`)
- Le prix actuel (`PrixUnit`)
- Le nouveau prix unitaire suite à une hausse de 8,5 %, arrondi à 2 décimales sous l'alias `NouveauPrix`
- Le montant de cette hausse unitaire en euros, arrondi à 2 décimales sous l'alias `HausseUnitaire`
- La plus-value totale que cette hausse représente sur la totalité du stock disponible, arrondie à 2 décimales sous l'alias `PlusValueStock`

Triez par la plus-value sur le stock décroissante, puis par nom de produit par ordre alphabétique.

<!-- expected-query: Q2
SELECT Refprod, Nomprod, CodeCateg, PrixUnit, ROUND(PrixUnit * 1.085, 2) AS NouveauPrix, ROUND(PrixUnit * 0.085, 2) AS HausseUnitaire, ROUND((PrixUnit * 0.085) * UnitesStock, 2) AS PlusValueStock FROM Produit WHERE CodeCateg IN (1, 2, 3) AND PrixUnit BETWEEN 20 AND 120 ORDER BY PlusValueStock DESC, Nomprod ASC;
-->

**3. Auditer les lignes de commande avec forte remise financière**

À partir de la table `DetailCommande`, pour les lignes de commande ayant bénéficié d'une remise d'au moins 20 %, d'une quantité commandée d'au moins 25 unités, et dont le montant total de remise accordée dépasse 500 €, affichez :
- Le numéro de commande (`Nocom`)
- La référence du produit (`Refprod`)
- La quantité commandée (`Qte`)
- Le taux de remise (`Remise`)
- Le montant brut avant remise, arrondi à 2 décimales sous l'alias `MontantBrut`
- Le montant en euros économisé grâce à la remise, arrondi à 2 décimales sous l'alias `RemiseEuros`
- Le montant net final facturé, arrondi à 2 décimales sous l'alias `MontantNet`

Triez par le montant de la remise (`RemiseEuros`) décroissant.

<!-- expected-query: Q3
SELECT Nocom, Refprod, Qte, Remise, ROUND(PrixUnit * Qte, 2) AS MontantBrut, ROUND(PrixUnit * Qte * Remise, 2) AS RemiseEuros, ROUND(PrixUnit * Qte * (1 - Remise), 2) AS MontantNet FROM DetailCommande WHERE Remise >= 0.20 AND Qte >= 25 AND (PrixUnit * Qte * Remise) > 500 ORDER BY RemiseEuros DESC;
-->

**4. Générer des identifiants et e-mails professionnels pour les collaborateurs**

Pour chaque employé rattaché à un supérieur hiérarchique (colonne `RendCompteA` renseignée), générez ses identifiants informatiques :
- `CiviliteNom` : Le titre de courtoisie, suivi d'un espace, puis du prénom et du nom en majuscules (ex: `Mlle Nancy DAVOLIO`)
- `Login` : La première lettre du prénom en minuscule, suivie des 4 premières lettres du nom en minuscule, puis du numéro d'employé (ex: `ndavo1`)
- `EmailPro` : L'adresse e-mail normalisée au format `prenom.nom@comptoir.fr` (tout en minuscules)
- `Poste` : La fonction occupée (colonne `Fonction`)

Triez par nom de famille par ordre alphabétique.

<!-- expected-query: Q4
SELECT (TitreCourtoisie || ' ' || Prenom || ' ' || UPPER(Nom)) AS CiviliteNom, (LOWER(SUBSTR(Prenom, 1, 1) || SUBSTR(Nom, 1, 4)) || NoEmp) AS Login, (LOWER(Prenom || '.' || Nom) || '@comptoir.fr') AS EmailPro, Fonction AS Poste FROM Employe WHERE RendCompteA IS NOT NULL ORDER BY Nom ASC;
-->

**5. Recherche multicritères sur les conditionnements de produits**

À partir de la table `Produit`, sélectionnez les produits commercialisés (colonne `Indisponible` valant 0) dont le conditionnement (colonne `QteParUnit`) mentionne des cartons ou des boîtes, ayant un prix unitaire compris entre 30 € et 100 € inclus, et dont le stock disponible est strictement supérieur à 20 unités.
Affichez les colonnes : `Refprod`, `Nomprod`, `QteParUnit`, `PrixUnit` et `UnitesStock`.
Triez par prix unitaire croissant, puis par nom de produit par ordre alphabétique.

<!-- expected-query: Q5
SELECT Refprod, Nomprod, QteParUnit, PrixUnit, UnitesStock FROM Produit WHERE Indisponible = 0 AND PrixUnit BETWEEN 30 AND 100 AND UnitesStock > 20 AND (QteParUnit LIKE '%carton%' OR QteParUnit LIKE '%boîte%') ORDER BY PrixUnit ASC, Nomprod ASC;
-->

**6. Créer des fiches contacts clients avec harmonisation des fonctions**

On cible les clients situés en France, Allemagne ou Espagne dont le contact occupe un poste lié au marketing ou aux ventes (colonne `Fonction` contenant "marketing" ou "ventes").
Affichez :
- `CodeCli` : Le code client
- `FicheClient` : La chaîne sous la forme `NOM_SOCIETE (VILLE, PAYS)` tout en majuscules (ex: `ALFREDS FUTTERKISTE (BERLIN, ALLEMAGNE)`)
- `Contact` : Le nom de la personne de contact
- `FonctionHarmonisee` : La fonction du contact dans laquelle "marketing" est remplacé par "mercatique" et "ventes" par "commercial"

Triez par pays puis par nom de société.

<!-- expected-query: Q6
SELECT CodeCli, (UPPER(Societe) || ' (' || UPPER(Ville) || ', ' || UPPER(Pays) || ')') AS FicheClient, Contact, REPLACE(REPLACE(Fonction, 'marketing', 'mercatique'), 'ventes', 'commercial') AS FonctionHarmonisee FROM Client WHERE Pays IN ('France', 'Allemagne', 'Espagne') AND (Fonction LIKE '%marketing%' OR Fonction LIKE '%ventes%') ORDER BY Pays, Societe;
-->

**7. Palmarès paginé des produits à plus forte valeur immobilisée en stock**

À partir de la table `Produit`, pour les produits commercialisés (colonne `Indisponible` valant 0) ayant un stock strictement positif, isolez les 5 produits classés du 6ème au 10ème rang inclus selon la valeur totale de leur stock immobilisé (prix unitaire multiplié par le stock).
Affichez :
- La référence (`Refprod`)
- Le nom du produit (`Nomprod`)
- Le prix unitaire (`PrixUnit`)
- Le nombre d'unités en stock (`UnitesStock`)
- La valeur totale du stock, arrondie à 2 décimales sous l'alias `ValeurStock`

Triez par valeur de stock décroissante.

<details>
<summary>💡 Indice</summary>

Pour paginer un résultat et sauter les premières lignes d'un classement, combinez la limitation du nombre de lignes (`LIMIT`) avec un décalage de départ (`OFFSET`).
</details>

<!-- expected-query: Q7
SELECT Refprod, Nomprod, PrixUnit, UnitesStock, ROUND(PrixUnit * UnitesStock, 2) AS ValeurStock FROM Produit WHERE Indisponible = 0 AND UnitesStock > 0 ORDER BY ValeurStock DESC LIMIT 5 OFFSET 5;
-->

**8. Étiquettes d'expédition pour les commandes internationales**

Pour les commandes passées au cours de l'année 2015, déjà expédiées (date d'envoi renseignée), disposant d'un code postal de livraison, et dont le pays de destination se situe en dehors de la France, de la Belgique et de la Suisse :
Affichez :
- `NoCom` : Le numéro de commande
- `DateCom` : La date de commande
- `EtiquetteColis` : Une étiquette d'expédition formatée au modèle :
  `DESTINATAIRE / AdrLiv, CodepostalLiv VilleLiv (PAYSLIV)`
  (avec `Destinataire` et `PaysLiv` affichés en majuscules)

Triez par date de commande chronologique, puis par numéro de commande. Limitez l'affichage aux 10 premières commandes.

<!-- expected-query: Q8
SELECT NoCom, DateCom, (UPPER(Destinataire) || ' / ' || AdrLiv || ', ' || CodepostalLiv || ' ' || VilleLiv || ' (' || UPPER(PaysLiv) || ')') AS EtiquetteColis FROM Commande WHERE DateCom LIKE '2015%' AND DateEnv IS NOT NULL AND CodepostalLiv IS NOT NULL AND PaysLiv NOT IN ('France', 'Belgique', 'Suisse') ORDER BY DateCom ASC, NoCom ASC LIMIT 10;
-->

**9. Génération de clés de facturation internationale pour l'Amérique latine**

Pour les clients d'Amérique latine (Brésil, Argentine, Mexique, Venezuela) dont la région administrative (colonne `Region`) est renseignée :
Affichez :
- Le code client (`CodeCli`)
- Le nom de société (`Societe`)
- Le pays (`Pays`)
- Une clé de facturation nommée `CleFacturation` composée des 3 premières lettres du pays en majuscules, d'un tiret, des 2 premiers caractères du code client, d'un tiret, et des 2 derniers caractères du code client (ex: pour le client `ANATR` au Mexique : `MEX-AN-TR`)

Triez par pays puis par cette clé de facturation.

<!-- expected-query: Q9
SELECT CodeCli, Societe, Pays, (UPPER(SUBSTR(Pays, 1, 3)) || '-' || SUBSTR(CodeCli, 1, 2) || '-' || SUBSTR(CodeCli, -2)) AS CleFacturation FROM Client WHERE Pays IN ('Brésil', 'Argentine', 'Mexique', 'Venezuela') AND Region IS NOT NULL ORDER BY Pays, CleFacturation;
-->

**10. Détection des 10 plus gros montants nets facturés sur une ligne de commande**

À partir de la table `DetailCommande`, identifiez les 10 lignes de commande ayant généré le montant net facturé le plus élevé de la base, pour une quantité strictement supérieure à 30 unités et un prix unitaire d'au moins 50 €.
Affichez :
- Le numéro de commande (`Nocom`)
- La référence du produit (`Refprod`)
- La quantité (`Qte`)
- Le prix unitaire (`PrixUnit`)
- Le montant brut avant remise, arrondi à 2 décimales sous l'alias `MontantBrut`
- Le montant économisé grâce à la remise, arrondi à 2 décimales sous l'alias `EconomieRemise`
- Le montant net final payé, arrondi à 2 décimales sous l'alias `MontantNet`

Triez par montant net décroissant, puis par quantité décroissante. Limitez aux 10 premiers résultats.

<!-- expected-query: Q10
SELECT Nocom, Refprod, Qte, PrixUnit, ROUND(PrixUnit * Qte, 2) AS MontantBrut, ROUND(PrixUnit * Qte * Remise, 2) AS EconomieRemise, ROUND(PrixUnit * Qte * (1 - Remise), 2) AS MontantNet FROM DetailCommande WHERE Qte > 30 AND PrixUnit >= 50 ORDER BY MontantNet DESC, Qte DESC LIMIT 10;
-->

## Rappel de cours

### Priorité des opérateurs logiques

Lorsque vous combinez des `AND` et des `OR`, l'opérateur `AND` est prioritaire sur le `OR`. Pour forcer l'ordre d'évaluation, utilisez impérativement des parenthèses :

```sql
-- Sélectionne les produits de catégorie 1 ou 2, dont le prix est inférieur à 50€
SELECT Nomprod, PrixUnit, CodeCateg
FROM Produit
WHERE (CodeCateg = 1 OR CodeCateg = 2) AND PrixUnit < 50;
```

### Imbrication et composition de fonctions de chaînes

Vous pouvez combiner plusieurs fonctions scalaires dans une même expression :

```sql
-- Nettoyage multiple : remplacer deux termes successifs
SELECT REPLACE(REPLACE(Fonction, 'Manager', 'Responsable'), 'Sales', 'Ventes')
FROM Employe;

-- Extraire et formater en majuscules
SELECT UPPER(SUBSTR(Pays, 1, 3)) FROM Client;
```

### Valeurs NULL et concaténation

En SQL, toute opération ou concaténation avec `NULL` donne `NULL` : `'A' || NULL` produit `NULL`.
Pour éviter les résultats nuls indésirables, pensez à tester l'existence des données :

```sql
SELECT Nom || ' (' || Region || ')'
FROM Client
WHERE Region IS NOT NULL;
```

### Pagination des résultats avec LIMIT et OFFSET

La clause `OFFSET` permet de sauter un certain nombre de lignes avant de renvoyer le résultat :

```sql
-- Affiche 10 lignes à partir de la 21ème ligne (lignes 21 à 30)
SELECT * FROM Produit
ORDER BY PrixUnit DESC
LIMIT 10 OFFSET 20;
```
