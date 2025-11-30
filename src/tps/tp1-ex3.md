---
layout: base.njk
title: "Exercice 3 : Chaînes de caractères"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 3
titre: "Exercice 3 : Chaînes de caractères"
permalink: "/tp1/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Chaînes de caractères

## Questions

Dans une même requête, sur la table Client, vous devez :

**1. Concaténer les champs Adresse, Ville, CodePostal et Pays dans un nouveau champ nommé "AdresseComplete"**

Le format doit être : `Adresse, CodePostal Ville, Pays`

<details>
<summary>💡 Indice</summary>

Utilisez l'opérateur de concaténation `||` pour joindre des chaînes.
</details>

**2. Extraire les deux derniers caractères des codes clients**

Créez une colonne affichant les 2 derniers caractères de `CodeCli`.

**3. Mettre en minuscule le nom des sociétés**

Affichez le nom de chaque société en minuscule.

**4. Affichez le nom des clients et leur fonction en remplaçant le terme "marketing" par "mercatique"**

Remplacez tous les "marketing" dans le champ `Fonction` par "mercatique".

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
SELECT SUBSTR(Nom, -2) FROM Client;   -- 2 derniers caractères

-- Remplacer du texte (REPLACE)
-- REPLACE(chaine, ancien, nouveau)
SELECT REPLACE(Fonction, 'Manager', 'Directeur') FROM Employe;

-- Minuscules / Majuscules
SELECT LOWER(Nom) FROM Client;
SELECT UPPER(Nom) FROM Client;
```

