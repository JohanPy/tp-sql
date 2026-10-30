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

Les questions suivantes portent sur la table **`Client`** et permettent de pratiquer les fonctions scalaires essentielles de manipulation de chaînes.

## Questions

**1. Concaténer l'adresse postale complète avec mise en majuscules du pays**

À partir de la table `Client`, concaténez les colonnes `Adresse`, `CodePostal`, `Ville` et `Pays` (ce dernier converti en majuscules) pour former une seule colonne nommée `AdresseComplete` au format exact : `Adresse, CodePostal Ville, PAYS_EN_MAJUSCULES`.

<!-- expected-query: Q1
SELECT (Adresse || ', ' || CodePostal || ' ' || Ville || ', ' || UPPER(Pays)) AS AdresseComplete FROM Client;
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

**3. Harmoniser la fonction des contacts en remplaçant "marketing" par "mercatique"**

À partir de la table `Client`, affichez le nom de la personne de contact (colonne `Contact`), ainsi que son intitulé de poste (colonne `Fonction`) dans lequel le terme 'marketing' est remplacé par 'mercatique', sous l'alias `Fonction`.

<details>
<summary>💡 Précision</summary>

Dans la base de données, l'intitulé 'marketing' est saisi en minuscules.
</details>

<!-- expected-query: Q3
SELECT Contact, REPLACE(Fonction, 'marketing', 'mercatique') AS Fonction FROM Client;
-->

## Rappel de cours

### Concaténation (`||`)

Pour assembler plusieurs chaînes de caractères ou colonnes, utilisez l'opérateur `||` :

```sql
SELECT Nom || ' ' || Prenom AS NomComplet FROM Employe;
```

### Fonctions de casse (`UPPER`, `LOWER`)

```sql
SELECT UPPER(Nom) FROM Client;   -- Convertit en majuscules
SELECT LOWER(Nom) FROM Client;   -- Convertit en minuscules
```

### Extraction de sous-chaîne (`SUBSTR`)

```sql
-- SUBSTR(chaine, debut, longueur)
SELECT SUBSTR(Nom, 1, 3) FROM Client; -- 3 premiers caractères
SELECT SUBSTR(Nom, -2) FROM Client;   -- 2 derniers caractères (en partant de la fin)
```

### Remplacement de texte (`REPLACE`)

```sql
-- REPLACE(chaine, ancien_texte, nouveau_texte)
SELECT REPLACE(Fonction, 'Manager', 'Directeur') FROM Employe;
```
