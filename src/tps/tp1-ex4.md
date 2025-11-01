---
layout: base.njk
title: "Exercice 3 : Chaînes de caractères"
intitule: "TP 1 - Bien démarrer avec les requêtes SQL"
base: "Comptoir2000.sqlite"
tpNum: 1
exerciceNum: 4
titre: "Exercice 3 : Chaînes de caractères"
permalink: "/tp1/exercice4/"
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

