---
layout: base.njk
category: interrogation
title: "Exercice 3 : Chaînes de caractères"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 4
titre: "Exercice 3 : Chaînes de caractères"
permalink: "/tp1/exercice4/"
tags: tp
---

# Exercice 3 : Chaînes de caractères

## Questions

Dans une même requête, sur la table Client, vous devez :

**1. Concaténer les champs Adresse, Ville, CodePostal et Pays dans un nouveau champ nommé "AdresseComplete"**

Le format doit être : `Adresse, CodePostal Ville, Pays`

<details>
<summary>💡 Indice</summary>

Utilisez l'opérateur de concaténation `||` pour joindre des chaînes :
```sql
SELECT Adresse || ', ' || CodePostal || ' ' || Ville || ', ' || Pays AS AdresseComplete
```
</details>

**2. Extraire les deux derniers caractères des codes clients**

Créez une colonne affichant les 2 derniers caractères de `CodeCli`.

<details>
<summary>💡 Indice</summary>

Utilisez la fonction `SUBSTR()` ou `RIGHT()` pour extraire une partie de chaîne. En SQLite, `SUBSTR(CodeCli, -2)` récupère les 2 derniers caractères.
</details>

**3. Mettre en minuscule le nom des sociétés**

Affichez le nom de chaque société en minuscule.

<details>
<summary>💡 Indice</summary>

Utilisez la fonction `LOWER()` pour convertir en minuscules.
</details>

**4. Affichez le nom des clients et leur fonction en remplaçant le terme "marketing" par "mercatique"**

Remplacez tous les "marketing" dans le champ `Fonction` par "mercatique".

<details>
<summary>💡 Indice</summary>

Utilisez la fonction `REPLACE()` :
```sql
REPLACE(Fonction, 'marketing', 'mercatique')
```
</details>

