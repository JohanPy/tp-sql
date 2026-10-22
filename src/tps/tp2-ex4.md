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

Pour les produits toujours commercialisés (`Indisponible = 0`) dont le stock actuel est strictement inférieur au seuil de réapprovisionnement (`UnitesStock < NiveauReap`), affichez la référence (`Refprod`), le nom (`Nomprod`), le stock actuel (`UnitesStock`), le seuil (`NiveauReap`), le nombre d'unités manquantes (`UnitesManquantes` : `NiveauReap - UnitesStock`) et le coût théorique de réapprovisionnement (`CoutReappro` : `(NiveauReap - UnitesStock) * PrixUnit`, arrondi à 2 décimales). Triez par coût de réapprovisionnement décroissant.

<!-- expected-query: Q1
SELECT Refprod, Nomprod, UnitesStock, NiveauReap, (NiveauReap - UnitesStock) AS UnitesManquantes, ROUND((NiveauReap - UnitesStock) * PrixUnit, 2) AS CoutReappro FROM Produit WHERE Indisponible = 0 AND UnitesStock < NiveauReap ORDER BY CoutReappro DESC;
-->

**2. Simuler une révision tarifaire ciblée et mesurer la plus-value sur le stock**

La direction envisage une hausse tarifaire de 8,5 % sur les boissons (catégorie 1), condiments (catégorie 2) et desserts (catégorie 3) dont le prix unitaire actuel est compris entre 20 € et 120 €.
Affichez la référence (`Refprod`), le nom (`Nomprod`), le code catégorie (`CodeCateg`), le prix actuel (`PrixUnit`), le nouveau prix simulé arrondi à 2 décimales (`NouveauPrix`), le montant de la hausse unitaire arrondi à 2 décimales (`HausseUnitaire`), ainsi que la plus-value totale sur le stock en magasin (`PlusValueStock` : hausse unitaire $\times$ unités en stock, arrondie à 2 décimales). Triez par la plus-value sur le stock décroissante, puis par nom de produit.

<details>
<summary>💡 Indice</summary>

Combinez les opérateurs `IN`, `BETWEEN` et les fonctions arithmétiques avec `ROUND(..., 2)`.
</details>

<!-- expected-query: Q2
SELECT Refprod, Nomprod, CodeCateg, PrixUnit, ROUND(PrixUnit * 1.085, 2) AS NouveauPrix, ROUND(PrixUnit * 0.085, 2) AS HausseUnitaire, ROUND((PrixUnit * 0.085) * UnitesStock, 2) AS PlusValueStock FROM Produit WHERE CodeCateg IN (1, 2, 3) AND PrixUnit BETWEEN 20 AND 120 ORDER BY PlusValueStock DESC, Nomprod ASC;
-->

**3. Auditer les lignes de commande avec forte remise financière**

L'équipe comptable réalise un audit des lignes de commande qui ont bénéficié d'une remise d'au moins 20 % (`Remise >= 0.20`), pour un volume commandé d'au moins 25 unités (`Qte >= 25`), et pour lesquelles le montant total de la remise accordée dépasse 500 €.
Affichez le numéro de commande (`Nocom`), la référence du produit (`Refprod`), la quantité (`Qte`), le taux de remise (`Remise`), le montant brut (`PrixUnit * Qte`), l'économie réalisée par le client en euros (`RemiseEuros` : `ROUND(PrixUnit * Qte * Remise, 2)`), et le montant net facturé (`MontantNet` : `ROUND(PrixUnit * Qte * (1 - Remise), 2)`). Triez par le montant de la remise (`RemiseEuros`) décroissant.

<!-- expected-query: Q3
SELECT Nocom, Refprod, Qte, Remise, ROUND(PrixUnit * Qte, 2) AS MontantBrut, ROUND(PrixUnit * Qte * Remise, 2) AS RemiseEuros, ROUND(PrixUnit * Qte * (1 - Remise), 2) AS MontantNet FROM DetailCommande WHERE Remise >= 0.20 AND Qte >= 25 AND (PrixUnit * Qte * Remise) > 500 ORDER BY RemiseEuros DESC;
-->

**4. Générer des identifiants et e-mails professionnels pour les collaborateurs**

Pour chaque employé rattaché à un responsable hiérarchique (`RendCompteA IS NOT NULL`), générez ses identifiants informatiques :
- `CiviliteNom` : Le titre de courtoisie, suivi d'un espace, puis du prénom et du nom en majuscules (ex: `Mlle Nancy DAVOLIO`)
- `Login` : La première lettre du prénom en minuscule, suivie des 4 premières lettres du nom en minuscule, puis du numéro d'employé (ex: `ndavo1`)
- `EmailPro` : L'adresse e-mail normalisée au format `prenom.nom@comptoir.fr` (tout en minuscules)
- `Poste` : La fonction occupée
Triez par nom de famille par ordre alphabétique.

<details>
<summary>💡 Indice</summary>

Utilisez `SUBSTR` pour découper les lettres, `LOWER` et `UPPER` pour la casse, et `||` pour assembler les différentes parties.
</details>

<!-- expected-query: Q4
SELECT (TitreCourtoisie || ' ' || Prenom || ' ' || UPPER(Nom)) AS CiviliteNom, (LOWER(SUBSTR(Prenom, 1, 1) || SUBSTR(Nom, 1, 4)) || NoEmp) AS Login, (LOWER(Prenom || '.' || Nom) || '@comptoir.fr') AS EmailPro, Fonction AS Poste FROM Employe WHERE RendCompteA IS NOT NULL ORDER BY Nom ASC;
-->

**5. Recherche multicritères sur les conditionnements de produits**

Le responsable des expéditions recherche les produits commercialisés (`Indisponible = 0`) dont le conditionnement (`QteParUnit`) mentionne des cartons ou des boîtes (`LIKE '%carton%'` OU `LIKE '%boîte%'`), ayant un prix unitaire compris entre 30 € et 100 €, et dont le stock disponible est strictement supérieur à 20 unités.
Affichez la référence (`Refprod`), le nom (`Nomprod`), le conditionnement (`QteParUnit`), le prix unitaire (`PrixUnit`) et le nombre d'unités en stock (`UnitesStock`). Triez par prix unitaire croissant, puis par nom de produit.

<details>
<summary>💡 Indice</summary>

Attention aux parenthèses pour combiner correctement les conditions `OR` avec les conditions `AND` !
</details>

<!-- expected-query: Q5
SELECT Refprod, Nomprod, QteParUnit, PrixUnit, UnitesStock FROM Produit WHERE Indisponible = 0 AND PrixUnit BETWEEN 30 AND 100 AND UnitesStock > 20 AND (QteParUnit LIKE '%carton%' OR QteParUnit LIKE '%boîte%') ORDER BY PrixUnit ASC, Nomprod ASC;
-->

**6. Créer des fiches contacts clients avec harmonisation des fonctions**

On cible les clients situés en France, Allemagne ou Espagne dont le contact occupe un poste lié au marketing ou aux ventes (`Fonction LIKE '%marketing%'` OU `Fonction LIKE '%ventes%'`).
Affichez :
- `CodeCli` : Le code client
- `FicheClient` : La chaîne sous la forme `NOM_SOCIETE (VILLE, PAYS)` tout en majuscules (ex: `ALFREDS FUTTERKISTE (BERLIN, ALLEMAGNE)`)
- `Contact` : Le nom de la personne de contact
- `FonctionHarmonisee` : La fonction du contact en remplaçant 'marketing' par 'mercatique' et 'ventes' par 'commercial' (utilisez deux `REPLACE` imbriqués)
Triez par pays puis par nom de société.

<!-- expected-query: Q6
SELECT CodeCli, (UPPER(Societe) || ' (' || UPPER(Ville) || ', ' || UPPER(Pays) || ')') AS FicheClient, Contact, REPLACE(REPLACE(Fonction, 'marketing', 'mercatique'), 'ventes', 'commercial') AS FonctionHarmonisee FROM Client WHERE Pays IN ('France', 'Allemagne', 'Espagne') AND (Fonction LIKE '%marketing%' OR Fonction LIKE '%ventes%') ORDER BY Pays, Societe;
-->

**7. Palmarès paginé des produits à plus forte valeur immobilisée en stock**

On souhaite analyser les produits représentant la plus grande valeur d'actifs immobilisés en stock (`PrixUnit * UnitesStock`), parmi les produits commercialisés (`Indisponible = 0`) ayant un stock positif (`UnitesStock > 0`).
Pour afficher la "deuxième page" du rapport financier (les 5 produits classés du 6ème au 10ème rang inclus) :
Affichez la référence (`Refprod`), le nom du produit (`Nomprod`), le prix unitaire (`PrixUnit`), les unités en stock (`UnitesStock`), ainsi que la valeur totale du stock (`ValeurStock` : `ROUND(PrixUnit * UnitesStock, 2)`).
Triez par valeur de stock décroissante, et combinez `LIMIT` et `OFFSET` pour afficher exactement cette tranche.

<details>
<summary>💡 Indice</summary>

La clause `LIMIT nombre OFFSET depart` permet de sauter des lignes pour paginer un résultat.
</details>

<!-- expected-query: Q7
SELECT Refprod, Nomprod, PrixUnit, UnitesStock, ROUND(PrixUnit * UnitesStock, 2) AS ValeurStock FROM Produit WHERE Indisponible = 0 AND UnitesStock > 0 ORDER BY ValeurStock DESC LIMIT 5 OFFSET 5;
-->

**8. Étiquettes d'expédition complètes pour les commandes internationales**

Pour les commandes passées au cours de l'année 2015 (`DateCom LIKE '2015%'`), qui ont déjà été expédiées (`DateEnv IS NOT NULL`), disposent d'un code postal de livraison (`CodepostalLiv IS NOT NULL`) et dont la destination se situe en dehors de France, Belgique et Suisse :
Affichez :
- `NoCom` : Le numéro de commande
- `DateCom` : La date de commande
- `EtiquetteColis` : Une étiquette d'expédition formatée au modèle :
  `DESTINATAIRE / AdrLiv, CodepostalLiv VilleLiv (PAYSLIV)`
  (avec `Destinataire` et `PaysLiv` en majuscules)
Triez par date de commande chronologique (`DateCom ASC`), puis par numéro de commande. Limitez l'affichage aux 10 premières commandes.

<!-- expected-query: Q8
SELECT NoCom, DateCom, (UPPER(Destinataire) || ' / ' || AdrLiv || ', ' || CodepostalLiv || ' ' || VilleLiv || ' (' || UPPER(PaysLiv) || ')') AS EtiquetteColis FROM Commande WHERE DateCom LIKE '2015%' AND DateEnv IS NOT NULL AND CodepostalLiv IS NOT NULL AND PaysLiv NOT IN ('France', 'Belgique', 'Suisse') ORDER BY DateCom ASC, NoCom ASC LIMIT 10;
-->

**9. Génération de clés de facturation internationale pour l'Amérique latine**

Pour les clients d'Amérique latine (Brésil, Argentine, Mexique, Venezuela) ayant une région administrative renseignée (`Region IS NOT NULL`) :
Affichez le code client (`CodeCli`), le nom de société (`Societe`), le pays (`Pays`), ainsi qu'une clé de facturation nommée `CleFacturation`.
Cette clé doit être composée des 3 premières lettres du pays en majuscules, suivies d'un tiret, des 2 premiers caractères du code client, d'un autre tiret, et des 2 derniers caractères du code client (ex: pour le client `ANATR` au Mexique : `MEX-AN-TR`).
Triez par pays puis par cette clé de facturation.

<!-- expected-query: Q9
SELECT CodeCli, Societe, Pays, (UPPER(SUBSTR(Pays, 1, 3)) || '-' || SUBSTR(CodeCli, 1, 2) || '-' || SUBSTR(CodeCli, -2)) AS CleFacturation FROM Client WHERE Pays IN ('Brésil', 'Argentine', 'Mexique', 'Venezuela') AND Region IS NOT NULL ORDER BY Pays, CleFacturation;
-->

**10. Détection des 10 plus gros montants nets facturés sur une ligne de commande**

Identifiez les 10 lignes de commande ayant généré le montant net facturé le plus élevé de toute la base.
Filtrez uniquement les lignes où la quantité commandée est strictement supérieure à 30 unités (`Qte > 30`) et dont le prix unitaire du produit était d'au moins 50 € (`PrixUnit >= 50`).
Affichez le numéro de commande (`Nocom`), la référence du produit (`Refprod`), la quantité (`Qte`), le prix unitaire (`PrixUnit`), le montant brut (`MontantBrut` : `ROUND(PrixUnit * Qte, 2)`), le montant économisé par la remise (`EconomieRemise` : `ROUND(PrixUnit * Qte * Remise, 2)`), et le montant net final payé (`MontantNet` : `ROUND(PrixUnit * Qte * (1 - Remise), 2)`).
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
