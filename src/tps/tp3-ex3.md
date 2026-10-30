---
layout: base.njk
title: "Exercice 3 : Dates et Formats"
intitule: "TP 3 — Dates, Agrégats & Choix Multiple (CASE)"
base: "Comptoir2000.sqlite"
tpNum: 3
exerciceNum: 3
titre: "Exercice 3 : Dates et Formats"
permalink: "/tp3/exercice3/"
tags: tp
show_load_db: false
show_save_db: false
---

# Exercice 3 : Dates et Formats

Cet exercice permet de manipuler les fonctions de formatage temporel (`STRFTIME`) et de calcul d'écarts en jours (`JULIANDAY`).

## Questions

**1. Filtrer les commandes de décembre 2014**

À partir de la table `Commande`, sélectionnez uniquement les commandes passées en décembre 2014 et affichez :
- `NoCom` : Le numéro de commande
- `CodeCli` : Le code du client
- `DateCom` : La date de commande
- `AnneeMois` : L'année et le mois de la commande au format `'AAAA-MM'` (ex. `'2014-12'`)

<!-- expected-query: Q1
SELECT NoCom, CodeCli, DateCom, STRFTIME('%Y-%m', DateCom) AS AnneeMois FROM Commande WHERE STRFTIME('%Y-%m', DateCom) = '2014-12';
-->

**2. Calculer le délai d'expédition en jours**

À partir de la table `Commande`, sélectionnez les commandes déjà expédiées (la date d'envoi `DateEnv` est renseignée, c'est-à-dire non nulle) et affichez :
- `NoCom` : Le numéro de commande
- `DelaiLivraisonJours` : Le nombre entier de jours entre la date de commande (`DateCom`) et la date d'envoi (`DateEnv`)

<details>
<summary>💡 Indice</summary>

En SQLite, convertissez chaque date en nombre de jours avec `JULIANDAY()` avant de faire la soustraction, puis convertissez le résultat en nombre entier avec `CAST(... AS INT)`.
</details>

<!-- expected-query: Q2
SELECT NoCom, CAST(JULIANDAY(DateEnv) - JULIANDAY(DateCom) AS INT) AS DelaiLivraisonJours FROM Commande WHERE DateEnv IS NOT NULL;
-->

## Rappel de cours

### Extraire ou formater une date (`STRFTIME`)

La fonction `STRFTIME(format, date)` extrait une partie d'une date sous forme de texte.
Codes utiles : `%Y` (année à 4 chiffres), `%m` (mois de `01` à `12`), `%d` (jour de `01` à `31`).

```sql
-- Afficher l'année d'embauche de chaque employé
SELECT Nom, STRFTIME('%Y', DateEmbauche) AS Annee
FROM Employe;
```

### Calculer un écart en jours entre deux dates (`JULIANDAY`)

La fonction `JULIANDAY(date)` convertit une date en nombre de jours, ce qui permet de soustraire deux dates :

```sql
-- Nombre entier de jours entre la naissance et l'embauche d'un employé
SELECT Nom, CAST(JULIANDAY(DateEmbauche) - JULIANDAY(DateNaissance) AS INT) AS NbJours
FROM Employe;
```
