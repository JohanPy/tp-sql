---
layout: base.njk
title: "Exercice 4 : Synthèse — Requêtes multi-notions"
intitule: "TP 2 — Requêtes Simples, Calculs & Manipulation de Chaînes"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 4
titre: "Exercice 4 : Synthèse — Requêtes multi-notions"
permalink: "/tp2/exercice4/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 4 : Synthèse — Requêtes multi-notions

Cet exercice est le **cœur du TP**. Il combine l'ensemble des notions abordées (filtrage multi-critères, calculs arithmétiques, fonctions de chaînes, pagination et gestion des valeurs nulles). Tout le monde doit le réaliser avant d'envisager les défis bonus.

## Questions

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

**2. Créer des fiches contacts clients avec harmonisation des fonctions**

On cible les clients situés en France, Allemagne ou Espagne dont le contact occupe un poste lié au marketing ou aux ventes (colonne `Fonction` contenant "marketing" ou "ventes").
Affichez :
- `CodeCli` : Le code client
- `FicheClient` : La chaîne sous la forme `NOM_SOCIETE (VILLE, PAYS)` tout en majuscules (ex: `ALFREDS FUTTERKISTE (BERLIN, ALLEMAGNE)`)
- `Contact` : Le nom de la personne de contact
- `FonctionHarmonisee` : La fonction du contact dans laquelle "marketing" est remplacé par "mercatique" et "ventes" par "commercial"

Triez par pays puis par nom de société.

<!-- expected-query: Q2
SELECT CodeCli, (UPPER(Societe) || ' (' || UPPER(Ville) || ', ' || UPPER(Pays) || ')') AS FicheClient, Contact, REPLACE(REPLACE(Fonction, 'marketing', 'mercatique'), 'ventes', 'commercial') AS FonctionHarmonisee FROM Client WHERE Pays IN ('France', 'Allemagne', 'Espagne') AND (Fonction LIKE '%marketing%' OR Fonction LIKE '%ventes%') ORDER BY Pays, Societe;
-->

**3. Générer des identifiants et e-mails professionnels pour les collaborateurs**

Pour chaque employé rattaché à un supérieur hiérarchique (colonne `RendCompteA` renseignée, c'est-à-dire non nulle), générez ses identifiants informatiques :
- `CiviliteNom` : Le titre de courtoisie, suivi d'un espace, puis du prénom et du nom en majuscules (ex: `Mlle Nancy DAVOLIO`)
- `Login` : La première lettre du prénom en minuscule, suivie des 4 premières lettres du nom en minuscule, puis du numéro d'employé (ex: `ndavo1`)
- `EmailPro` : L'adresse e-mail normalisée au format `prenom.nom@comptoir.fr` (tout en minuscules)
- `Poste` : La fonction occupée (colonne `Fonction`)

Triez par nom de famille par ordre alphabétique.

<details>
<summary>💡 Indice</summary>

Pour vérifier qu'un champ contient une valeur (n'est pas vide), utilisez le test `IS NOT NULL`.
</details>

<!-- expected-query: Q3
SELECT (TitreCourtoisie || ' ' || Prenom || ' ' || UPPER(Nom)) AS CiviliteNom, (LOWER(SUBSTR(Prenom, 1, 1) || SUBSTR(Nom, 1, 4)) || NoEmp) AS Login, (LOWER(Prenom || '.' || Nom) || '@comptoir.fr') AS EmailPro, Fonction AS Poste FROM Employe WHERE RendCompteA IS NOT NULL ORDER BY Nom ASC;
-->

**4. Palmarès paginé des produits à plus forte valeur immobilisée en stock**

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

<!-- expected-query: Q4
SELECT Refprod, Nomprod, PrixUnit, UnitesStock, ROUND(PrixUnit * UnitesStock, 2) AS ValeurStock FROM Produit WHERE Indisponible = 0 AND UnitesStock > 0 ORDER BY ValeurStock DESC LIMIT 5 OFFSET 5;
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

### Valeurs NULL et condition `IS NOT NULL`

En SQL, `NULL` représente l'absence de valeur. Une comparaison ordinaire comme `= NULL` ou `<> NULL` renvoie toujours `UNKNOWN` (faux). On utilise donc :

```sql
SELECT Nom, Prenom
FROM Employe
WHERE RendCompteA IS NOT NULL;
```

### Pagination des résultats avec LIMIT et OFFSET

La clause `OFFSET` permet de sauter un certain nombre de lignes avant de renvoyer le résultat :

```sql
-- Affiche 5 lignes en sautant les 5 premières (du 6ème au 10ème)
SELECT * FROM Produit
ORDER BY PrixUnit DESC
LIMIT 5 OFFSET 5;
```
