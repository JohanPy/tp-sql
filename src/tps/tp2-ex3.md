---
layout: base.njk
title: "Exercice 3 : Chaînes de caractères"
intitule: "TP 2 — Requêtes Simples, Calculs & Manipulation de Chaînes"
base: "Comptoir2000.sqlite"
tpNum: 2
exerciceNum: 3
titre: "Exercice 3 : Chaînes de caractères"
permalink: "/tp2/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Chaînes de caractères

## Questions

Les questions suivantes portent toutes sur la table **`Client`** et permettent de pratiquer les fonctions de manipulation de chaînes de caractères :

**1. Concaténer l'adresse postale complète dans un champ unique**

À partir de la table `Client`, concaténez les colonnes `Adresse`, `CodePostal`, `Ville` et `Pays` pour former une seule colonne nommée `AdresseComplete` au format exact : `Adresse, CodePostal Ville, Pays`.

<!-- expected-query: Q1
SELECT (Adresse || ', ' || CodePostal || ' ' || Ville || ', ' || Pays) AS AdresseComplete FROM Client;
-->

**2. Extraire les deux derniers caractères du code client**

À partir de la table `Client`, affichez le code client (colonne `CodeCli`), ainsi que ses 2 derniers caractères sous l'alias `DeuxDerniers`.

<details>
<summary>💡 Indice</summary>

La fonction `SUBSTR()` accepte une position de départ négative pour compter les caractères en partant de la fin de la chaîne.
</details>

<!-- expected-query: Q2
SELECT CodeCli, SUBSTR(CodeCli, -2) AS DeuxDerniers FROM Client;
-->

**3. Convertir en minuscules la raison sociale des sociétés clientes**

À partir de la table `Client`, affichez la raison sociale de chaque société (colonne `Societe`) convertie en minuscules, sous l'alias `SocieteMinuscule`.

<!-- expected-query: Q3
SELECT LOWER(Societe) AS SocieteMinuscule FROM Client;
-->

**4. Harmoniser la fonction des contacts en remplaçant "marketing" par "mercatique"**

À partir de la table `Client`, affichez le nom de la personne de contact (colonne `Contact`), ainsi que son intitulé de poste (colonne `Fonction`) dans lequel le terme 'marketing' est remplacé par 'mercatique', sous l'alias `Fonction`.

<details>
<summary>💡 Précision</summary>

Dans la base de données, l'intitulé 'marketing' est saisi en lettres minuscules.
</details>

<!-- expected-query: Q4
SELECT Contact, REPLACE(Fonction, 'marketing', 'mercatique') AS Fonction FROM Client;
-->

## Rappel de cours

### Concaténation

Pour assembler plusieurs chaînes de caractères, utilisez l'opérateur `||`.

```sql
-- Assembler Nom et Prénom
SELECT Nom || ' ' || Prenom AS NomComplet FROM Employe;
```

### Manipulation de chaînes

```sql
-- Extraire une partie de la chaîne (SUBSTR)
-- SUBSTR(chaine, debut, longueur)
SELECT SUBSTR(Nom, 1, 3) FROM Client; -- 3 premiers caractères
```
```sql
SELECT SUBSTR(Nom, -2) FROM Client;   -- 2 derniers caractères
```
```sql
-- Remplacer du texte (REPLACE)
-- REPLACE(chaine, ancien, nouveau)
SELECT REPLACE(Fonction, 'Manager', 'Directeur') FROM Employe;
```
```sql
-- Minuscules / Majuscules
SELECT LOWER(Nom) FROM Client;
SELECT UPPER(Nom) FROM Client;
```
